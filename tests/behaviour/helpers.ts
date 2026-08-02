import type { Page } from '@playwright/test';

/*
 * Shared plumbing for the behaviour suite.
 *
 * The two recorders below exist because the obvious way to test a transition --
 * screenshot it, or read a computed style at a guessed timestamp -- is a
 * coin flip. Both of these observe *state* instead:
 *
 *   startTransitionLog  document-level capture listeners for the transition and
 *                       animation events. Transition events bubble, so one pair
 *                       of listeners on the document catches every part,
 *                       including elements that do not exist yet when the
 *                       listener is installed. Fully event-driven: nothing is
 *                       sampled, so nothing can be missed by sampling too late.
 *
 *   startFrameRecorder  a requestAnimationFrame sampler, for the one question
 *                       events cannot answer: did `data-starting-style` survive
 *                       to a painted frame? A rAF callback runs *before* that
 *                       frame's style/layout/paint step, so whatever the DOM
 *                       says inside the callback is what the frame goes on to
 *                       paint. The only thing that could invalidate that is a
 *                       synchronous React re-render between the callback and the
 *                       paint, which React only does for updates scheduled from
 *                       a layout effect during a commit -- and a commit cannot
 *                       land there. The recorder also registers its own callback
 *                       before the interaction, so it runs ahead of any rAF a
 *                       component schedules during that same frame.
 */

export async function gotoStory(page: Page, id: string): Promise<void> {
  /*
   * Not a formality. `reducedMotion` is not a declared test option in Playwright
   * 1.62 -- it appears only in doc comments -- so it cannot be pinned in the
   * config, and every assertion in this suite depends on transitions actually
   * running. Setting it here makes the requirement explicit and enforced.
   */
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'load' });

  // Same two barriers the visual suite uses, for the same reasons: the flag is
  // set on STORY_RENDERED (after play() resolves), and state:'attached' is
  // required because <html> reports hidden on fullscreen/portalled stories.
  await page.waitForSelector('html[data-sb-rendered=true]', { state: 'attached', timeout: 15_000 });
  await page.waitForFunction(() => document.fonts.status === 'loaded');
}

/** name -> CSS selector. Recorders report per-name, so tests never match on class strings. */
export type Targets = Record<string, string>;

export type TransitionRecord = {
  /** transitionrun | transitionstart | transitionend | transitioncancel | animationstart | animationend */
  type: string;
  /** CSS property for transition events, animation-name for animation events. */
  property: string;
  /** Which of the named targets the event fired on, or null if none matched. */
  target: string | null;
  t: number;
};

export async function startTransitionLog(page: Page, targets: Targets): Promise<void> {
  await page.evaluate((namedTargets) => {
    const w = window as unknown as { __transitions?: TransitionRecord[] };
    const log: TransitionRecord[] = [];
    w.__transitions = log;
    const t0 = performance.now();

    const nameOf = (node: EventTarget | null): string | null => {
      if (!(node instanceof Element)) return null;
      for (const [name, selector] of Object.entries(namedTargets)) {
        if (node.matches(selector)) return name;
      }
      return null;
    };

    const record = (event: Event) => {
      const property =
        (event as TransitionEvent).propertyName ?? (event as AnimationEvent).animationName ?? '';
      log.push({
        type: event.type,
        property,
        target: nameOf(event.target),
        t: Math.round(performance.now() - t0),
      });
    };

    for (const type of [
      'transitionrun',
      'transitionstart',
      'transitionend',
      'transitioncancel',
      'animationstart',
      'animationend',
      'animationcancel',
    ]) {
      // Capture phase on the document, so a portalled element that mounts later
      // is covered without re-installing anything.
      document.addEventListener(type, record, true);
    }
  }, targets);
}

export async function readTransitionLog(page: Page): Promise<TransitionRecord[]> {
  return page.evaluate(
    () => (window as unknown as { __transitions?: TransitionRecord[] }).__transitions ?? []
  ) as Promise<TransitionRecord[]>;
}

/** Properties that ran a transition on the named target, in order of first appearance. */
export function propertiesFor(log: TransitionRecord[], target: string): string[] {
  const seen = new Set<string>();
  for (const entry of log) {
    if (entry.target === target && entry.type === 'transitionrun') seen.add(entry.property);
  }
  return [...seen];
}

export type FrameSample = {
  starting: boolean;
  ending: boolean;
  open: boolean;
  closed: boolean;
  opacity: string;
  /*
   * transform, translate, scale and rotate are all recorded separately, and that
   * is not padding. Tailwind v4 compiles `translate-x-full`, `scale-95` and
   * `rotate-180` to the *individual* transform properties, not to `transform`,
   * so a rule that animates `transform` does not animate any of them. Watching
   * only `transform` hides that class of bug completely.
   */
  transform: string;
  translate: string;
  scale: string;
  rotate: string;
  height: string;
  /** transition-property (or animation-name) of everything live on this element right now. */
  animations: string[];
};

export type Frame = { t: number } & Record<string, FrameSample | null | number>;

export async function startFrameRecorder(
  page: Page,
  targets: Targets,
  durationMs = 1_500
): Promise<void> {
  await page.evaluate(
    ({ namedTargets, duration }) => {
      const w = window as unknown as { __frames?: Record<string, unknown>[] };
      const frames: Record<string, unknown>[] = [];
      w.__frames = frames;
      const t0 = performance.now();

      const tick = () => {
        const now = performance.now();
        const frame: Record<string, unknown> = { t: Math.round(now - t0) };
        for (const [name, selector] of Object.entries(namedTargets)) {
          const el = document.querySelector(selector);
          if (!el) {
            frame[name] = null;
            continue;
          }
          // Reading computed style here forces the same style recalculation the
          // browser is about to do for this frame's paint, so these values are
          // the ones that get painted.
          const cs = getComputedStyle(el);
          frame[name] = {
            starting: el.hasAttribute('data-starting-style'),
            ending: el.hasAttribute('data-ending-style'),
            open: el.hasAttribute('data-open'),
            closed: el.hasAttribute('data-closed'),
            opacity: cs.opacity,
            transform: cs.transform,
            translate: cs.translate,
            scale: cs.scale,
            rotate: cs.rotate,
            height: cs.height,
            animations: el
              .getAnimations()
              .map(
                (a) =>
                  (a as CSSTransition).transitionProperty ??
                  (a as CSSAnimation).animationName ??
                  'unknown'
              ),
          };
        }
        frames.push(frame);
        if (now - t0 < duration) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    },
    { namedTargets: targets, duration: durationMs }
  );
}

export async function readFrames(page: Page): Promise<Frame[]> {
  return page.evaluate(
    () => (window as unknown as { __frames?: Frame[] }).__frames ?? []
  ) as Promise<Frame[]>;
}

export function samples(frames: Frame[], target: string): FrameSample[] {
  return frames.map((f) => f[target]).filter((s): s is FrameSample => !!s && typeof s === 'object');
}

/** Union of every transition/animation seen live on the target across all frames. */
export function animationsSeen(frames: Frame[], target: string): string[] {
  const seen = new Set<string>();
  for (const sample of samples(frames, target)) for (const a of sample.animations) seen.add(a);
  return [...seen];
}

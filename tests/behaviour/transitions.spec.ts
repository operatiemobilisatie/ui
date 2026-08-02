import { expect, test } from '@playwright/test';

import {
  animationsSeen,
  gotoStory,
  propertiesFor,
  readFrames,
  readTransitionLog,
  samples,
  startFrameRecorder,
  startTransitionLog,
} from './helpers';
import {
  ALERT_DIALOG_POPUP,
  DIALOG_BACKDROP,
  DIALOG_POPUP,
  MENU_POPUP,
  TOAST,
  TOOLTIP_POPUP,
  accordionChevron,
  accordionPanel,
  accordionTrigger,
} from './selectors';

/*
 * Every transition asserted here is new in v3. `tailwindcss-animate` was listed
 * as a dependency but never registered as a plugin, so every `animate-in` /
 * `fade-out-0` / `zoom-in-95` class in the v2 components emitted nothing: the
 * tooltip, menu, dialog, alert-dialog and toast had no open or close animation
 * at all. The accordion is the single exception -- it animated under Radix via
 * @keyframes over --radix-accordion-content-height, and now animates via
 * height over --accordion-panel-height.
 *
 * The visual suite cannot see any of this: it sets animations:'disabled', which
 * snapshots the settled frame by definition.
 */

/** How long to keep sampling after an interaction. The longest transition here is 200ms. */
const SETTLE = 600;

test.describe('tooltip', () => {
  test('popup enters with a painted starting style and an opacity/scale transition', async ({
    page,
  }) => {
    await gotoStory(page, 'data-display-tooltip--opens-on-hover');

    // The story's play() leaves the tooltip open. Close it so the *enter* is
    // what gets recorded rather than a tooltip that is already settled.
    await page.keyboard.press('Escape');
    await expect(page.locator(TOOLTIP_POPUP)).toHaveCount(0);

    await startTransitionLog(page, { popup: TOOLTIP_POPUP });
    await startFrameRecorder(page, { popup: TOOLTIP_POPUP });

    await page.getByRole('button', { name: 'Hover me' }).hover();
    await expect(page.locator(TOOLTIP_POPUP)).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    const properties = propertiesFor(await readTransitionLog(page), 'popup');
    expect(properties).toContain('opacity');
    expect(properties).toContain('scale');

    const frames = samples(await readFrames(page), 'popup');
    const starting = frames.filter((f) => f.starting);
    expect(starting.length).toBeGreaterThan(0);
    // The starting style pins opacity at 0 -- if the popup were already at full
    // opacity while data-starting-style was set, the class would not be doing
    // anything and the fade would be invisible.
    expect(starting[0].opacity).toBe('0');
    // ...and it must actually finish, rather than stay stuck at the start.
    expect(frames[frames.length - 1].opacity).toBe('1');
  });

  test('popup exits with a painted ending style before it unmounts', async ({ page }) => {
    await gotoStory(page, 'data-display-tooltip--opens-on-hover');
    await page.getByRole('button', { name: 'Hover me' }).hover();
    await expect(page.locator(TOOLTIP_POPUP)).toHaveCount(1);

    await startTransitionLog(page, { popup: TOOLTIP_POPUP });
    await startFrameRecorder(page, { popup: TOOLTIP_POPUP });

    await page.mouse.move(5, 5);
    await expect(page.locator(TOOLTIP_POPUP)).toHaveCount(0);
    await page.waitForTimeout(SETTLE);

    expect(propertiesFor(await readTransitionLog(page), 'popup')).toContain('opacity');
    const ending = samples(await readFrames(page), 'popup').filter((f) => f.ending);
    expect(ending.length).toBeGreaterThan(0);
  });
});

test.describe('dropdown menu', () => {
  test('popup enters with a painted starting style and an opacity/scale transition', async ({
    page,
  }) => {
    await gotoStory(page, 'data-display-dropdownmenu--opens-on-click');

    // play() already opened it; Escape closes and hands focus back to the trigger.
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU_POPUP)).toHaveCount(0);

    await startTransitionLog(page, { popup: MENU_POPUP });
    await startFrameRecorder(page, { popup: MENU_POPUP });

    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator(MENU_POPUP)).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    const properties = propertiesFor(await readTransitionLog(page), 'popup');
    expect(properties).toContain('opacity');
    expect(properties).toContain('scale');

    const frames = samples(await readFrames(page), 'popup');
    const starting = frames.filter((f) => f.starting);
    expect(starting.length).toBeGreaterThan(0);
    expect(starting[0].opacity).toBe('0');
    expect(frames[frames.length - 1].opacity).toBe('1');
  });

  test('popup exits with a painted ending style before it unmounts', async ({ page }) => {
    await gotoStory(page, 'data-display-dropdownmenu--opens-on-click');
    await expect(page.locator(MENU_POPUP)).toHaveCount(1);

    await startTransitionLog(page, { popup: MENU_POPUP });
    await startFrameRecorder(page, { popup: MENU_POPUP });

    await page.keyboard.press('Escape');
    await expect(page.locator(MENU_POPUP)).toHaveCount(0);
    await page.waitForTimeout(SETTLE);

    expect(propertiesFor(await readTransitionLog(page), 'popup')).toContain('opacity');
    const ending = samples(await readFrames(page), 'popup').filter((f) => f.ending);
    expect(ending.length).toBeGreaterThan(0);
    expect(ending[0].opacity).toBe('1');
  });
});

test.describe('dialog', () => {
  test('popup and backdrop both transition in from a painted starting style', async ({ page }) => {
    await gotoStory(page, 'data-display-dialog--default');

    await startTransitionLog(page, { popup: DIALOG_POPUP, backdrop: DIALOG_BACKDROP });
    await startFrameRecorder(page, { popup: DIALOG_POPUP, backdrop: DIALOG_BACKDROP });

    await page.getByRole('button', { name: 'Share' }).click();
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    const log = await readTransitionLog(page);
    expect(propertiesFor(log, 'popup')).toEqual(expect.arrayContaining(['opacity', 'scale']));
    expect(propertiesFor(log, 'backdrop')).toContain('opacity');

    const frames = await readFrames(page);
    for (const target of ['popup', 'backdrop']) {
      const seen = samples(frames, target);
      const starting = seen.filter((f) => f.starting);
      expect(starting.length, `${target} painted no starting frame`).toBeGreaterThan(0);
      expect(starting[0].opacity, `${target} starting opacity`).toBe('0');
      expect(seen[seen.length - 1].opacity, `${target} settled opacity`).toBe('1');
    }
  });

  test('popup and backdrop both transition out from a painted ending style', async ({ page }) => {
    await gotoStory(page, 'data-display-dialog--opened');
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(1);

    await startTransitionLog(page, { popup: DIALOG_POPUP, backdrop: DIALOG_BACKDROP });
    await startFrameRecorder(page, { popup: DIALOG_POPUP, backdrop: DIALOG_BACKDROP });

    await page.keyboard.press('Escape');
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(0);
    await page.waitForTimeout(SETTLE);

    const log = await readTransitionLog(page);
    expect(propertiesFor(log, 'popup')).toContain('opacity');
    expect(propertiesFor(log, 'backdrop')).toContain('opacity');

    const frames = await readFrames(page);
    for (const target of ['popup', 'backdrop']) {
      const ending = samples(frames, target).filter((f) => f.ending);
      expect(ending.length, `${target} painted no ending frame`).toBeGreaterThan(0);
    }
  });
});

test.describe('alert dialog', () => {
  test('popup and backdrop both transition in from a painted starting style', async ({ page }) => {
    await gotoStory(page, 'feedback-alertdialog--default');

    await startTransitionLog(page, { popup: ALERT_DIALOG_POPUP, backdrop: DIALOG_BACKDROP });
    await startFrameRecorder(page, { popup: ALERT_DIALOG_POPUP, backdrop: DIALOG_BACKDROP });

    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page.locator(ALERT_DIALOG_POPUP)).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    const log = await readTransitionLog(page);
    expect(propertiesFor(log, 'popup')).toEqual(expect.arrayContaining(['opacity', 'scale']));
    expect(propertiesFor(log, 'backdrop')).toContain('opacity');

    const frames = await readFrames(page);
    for (const target of ['popup', 'backdrop']) {
      const starting = samples(frames, target).filter((f) => f.starting);
      expect(starting.length, `${target} painted no starting frame`).toBeGreaterThan(0);
      expect(starting[0].opacity, `${target} starting opacity`).toBe('0');
    }
  });
});

test.describe('toast', () => {
  /*
   * ANSWERED: `data-starting-style` never survives to a painted frame on a toast,
   * and the enter transition runs anyway.
   *
   * Every other Base UI part clears `transitionStatus: 'starting'` from a
   * requestAnimationFrame inside useTransitionStatus, which is why the tooltip,
   * menu, dialog and alert-dialog above all paint at least one starting frame.
   * Toast.Root does not: `useIsoLayoutEffect(recalculateHeight)` clears it from
   * a *layout effect*, which runs inside the commit, and React flushes the
   * resulting store update synchronously before the browser paints. Measured
   * here: zero starting frames out of ~40 sampled, every run.
   *
   * The transition still runs, and the reason is worth knowing, because it is
   * what makes `data-starting-style` usable at all on a toast: the same
   * `recalculateHeight` reads `element.offsetHeight` *while* the attribute is
   * still applied, which forces a style recalculation and lets the engine record
   * the starting values. Removing the attribute is then a style change the
   * engine can transition away from.
   *
   * The consequence for a consumer is precise: a `data-starting-style:` rule on
   * a toast works as a *transition origin* for any property named in
   * `transition-property`, and does nothing whatsoever for a property that is
   * not -- because "not transitioned" would mean "visible only on a painted
   * frame", and there is no painted frame.
   *
   * If a future Base UI moves this clear onto the rAF path, the first assertion
   * below flips, and it should be flipped deliberately rather than relaxed.
   */
  test('enter transitions from the starting style without ever painting it', async ({ page }) => {
    await gotoStory(page, 'feedback-toaster--default');

    // play() pushed one toast. Close it: a clean queue means the recorded frames
    // belong to the toast this test adds, and the default 5s timeout on the
    // first one cannot fire mid-recording.
    await page.locator(TOAST).getByRole('button', { includeHidden: true }).click();
    await expect(page.locator(TOAST)).toHaveCount(0);

    await startTransitionLog(page, { toast: TOAST });
    await startFrameRecorder(page, { toast: TOAST });

    await page.getByRole('button', { name: 'Show toast' }).click();
    await expect(page.locator(TOAST)).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    const frames = samples(await readFrames(page), 'toast');
    const properties = propertiesFor(await readTransitionLog(page), 'toast');

    expect(frames.filter((f) => f.starting).length).toBe(0);

    // Opacity: starts at 0 on the first frame the toast is painted at all, and
    // interpolates rather than stepping.
    expect(Number(frames[0].opacity)).toBeLessThan(0.2);
    expect(new Set(frames.map((f) => f.opacity)).size).toBeGreaterThan(3);
    expect(Number(frames[frames.length - 1].opacity)).toBe(1);
    expect(properties).toContain('opacity');

    /*
     * The slide. `data-starting-style:-translate-y-full` /
     * `sm:data-starting-style:translate-y-full` compile to Tailwind v4's
     * `translate` property, so `translate` -- not `transform` -- is what has to
     * be in the transition list for the toast to slide into place instead of
     * appearing where it lands.
     */
    expect(properties).toContain('translate');
    expect(frames[0].translate).not.toBe('none');
    expect(frames[frames.length - 1].translate).toBe('none');
  });

  test('exit slides out and fades before unmounting', async ({ page }) => {
    await gotoStory(page, 'feedback-toaster--default');
    await expect(page.locator(TOAST)).toHaveCount(1);

    await startTransitionLog(page, { toast: TOAST });
    await startFrameRecorder(page, { toast: TOAST });

    await page.locator(TOAST).getByRole('button', { includeHidden: true }).click();
    await expect(page.locator(TOAST)).toHaveCount(0);
    await page.waitForTimeout(SETTLE);

    const properties = propertiesFor(await readTransitionLog(page), 'toast');
    expect(properties).toContain('opacity');
    expect(properties).toContain('translate');

    // Unlike the enter, the ending style *is* painted: it is applied by a normal
    // render rather than being raced by a layout effect.
    const ending = samples(await readFrames(page), 'toast').filter((f) => f.ending);
    expect(ending.length, 'toast painted no ending frame').toBeGreaterThan(0);
  });
});

test.describe('accordion', () => {
  test('opens with a height transition from a painted zero-height frame', async ({ page }) => {
    await gotoStory(page, 'data-display-accordion--default');

    await startTransitionLog(page, { panel: accordionPanel(0) });
    await startFrameRecorder(page, { panel: accordionPanel(0) });

    await page.locator(accordionTrigger(0)).click();
    await expect(page.locator(accordionPanel(0))).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    expect(propertiesFor(await readTransitionLog(page), 'panel')).toContain('height');

    const frames = samples(await readFrames(page), 'panel');
    const starting = frames.filter((f) => f.starting);
    expect(starting.length, 'panel painted no starting frame').toBeGreaterThan(0);
    expect(starting[0].height).toBe('0px');

    // Intermediate heights prove the panel interpolated rather than jumping.
    const heights = new Set(frames.map((f) => f.height));
    expect(heights.size).toBeGreaterThan(2);
    expect(frames[frames.length - 1].height).not.toBe('0px');
  });

  test('closes with a height transition and only then unmounts the panel', async ({ page }) => {
    await gotoStory(page, 'data-display-accordion--expanded');
    await expect(page.locator(accordionPanel(0))).toHaveCount(1);

    await startTransitionLog(page, { panel: accordionPanel(0) });
    await startFrameRecorder(page, { panel: accordionPanel(0) });

    await page.locator(accordionTrigger(0)).click();
    await expect(page.locator(accordionPanel(0))).toHaveCount(0);
    await page.waitForTimeout(SETTLE);

    expect(propertiesFor(await readTransitionLog(page), 'panel')).toContain('height');

    const frames = samples(await readFrames(page), 'panel');
    /*
     * `data-ending-style` rather than `data-closed` is the hook for the exit.
     * data-closed does appear on a closing panel, but a settled-closed panel is
     * not in the DOM at all, so only the ending style spans the whole exit.
     */
    const ending = frames.filter((f) => f.ending);
    expect(ending.length, 'panel painted no ending frame').toBeGreaterThan(0);
    const heights = new Set(frames.map((f) => f.height));
    expect(heights.size).toBeGreaterThan(2);
  });

  /*
   * Characterisation, not a wish. Base UI has a documented one-frame issue when
   * a single-mode accordion swaps which item is open (mui/base-ui#3099), so this
   * was written to record what the two panels actually do rather than to assert
   * what they ought to.
   *
   * Measured on @base-ui/react 1.6.0, and better than the issue suggests: both
   * panels run a real height transition, both interpolate over several frames,
   * and the outgoing panel is still mounted and carrying data-ending-style while
   * the incoming one is already mounted -- so the swap cross-fades in height
   * rather than snapping the outgoing panel shut in one frame. If a future
   * version regresses to the one-frame behaviour, the interpolation counts below
   * are what will catch it.
   */
  test('single mode: closing one item while opening another', async ({ page }) => {
    await gotoStory(page, 'data-display-accordion--default');

    await page.locator(accordionTrigger(0)).click();
    await expect(page.locator(accordionPanel(0))).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    await startTransitionLog(page, { closing: accordionPanel(0), opening: accordionPanel(1) });
    await startFrameRecorder(page, { closing: accordionPanel(0), opening: accordionPanel(1) });

    await page.locator(accordionTrigger(1)).click();
    await expect(page.locator(accordionPanel(1))).toHaveCount(1);
    await expect(page.locator(accordionPanel(0))).toHaveCount(0);
    await page.waitForTimeout(SETTLE);

    const log = await readTransitionLog(page);
    const frames = await readFrames(page);

    // Both directions run a real height transition.
    expect(propertiesFor(log, 'closing')).toContain('height');
    expect(propertiesFor(log, 'opening')).toContain('height');

    // And they overlap: there is at least one frame where the outgoing panel is
    // still mounted and ending while the incoming one is already mounted.
    const overlap = frames.filter(
      (f) =>
        f.closing &&
        typeof f.closing === 'object' &&
        f.closing.ending &&
        f.opening &&
        typeof f.opening === 'object'
    );
    expect(overlap.length, 'the two panels never coexisted').toBeGreaterThan(0);

    // Neither side collapses in a single frame.
    const closingHeights = new Set(samples(frames, 'closing').map((f) => f.height));
    const openingSamples = samples(frames, 'opening');
    expect(closingHeights.size, 'the closing panel did not interpolate').toBeGreaterThan(2);
    expect(new Set(openingSamples.map((f) => f.height)).size).toBeGreaterThan(2);
    expect(openingSamples.filter((f) => f.starting).length).toBeGreaterThan(0);
  });

  /*
   * The chevron hangs off `data-panel-open`, not `data-open`: Base UI runs a
   * trigger through a different state mapping from the parts it controls, so
   * `data-open:` on a trigger is valid Tailwind that never matches. Only the
   * defaultValue mount path has ever been screenshotted, so this drives it from
   * a click.
   */
  test('chevron rotates on a click-opened item', async ({ page }) => {
    await gotoStory(page, 'data-display-accordion--default');

    const trigger = page.locator(accordionTrigger(0));
    const chevron = page.locator(accordionChevron(0));

    await expect(trigger).not.toHaveAttribute('data-panel-open', /.*/);
    const before = await chevron.evaluate((el) => getComputedStyle(el).rotate);

    await startTransitionLog(page, { chevron: accordionChevron(0) });
    await trigger.click();
    await expect(trigger).toHaveAttribute('data-panel-open', '');
    await page.waitForTimeout(SETTLE);

    expect(before).toBe('none');
    expect(await chevron.evaluate((el) => getComputedStyle(el).rotate)).toBe('180deg');
    expect(propertiesFor(await readTransitionLog(page), 'chevron')).toContain('rotate');
  });
});

test.describe('no unexpected keyframe animations', () => {
  /*
   * A guard on the Phase 4/5 claim that the dead `tailwindcss-animate` classes
   * were deleted rather than resurrected. If a `@keyframes`-based animation ever
   * reappears on a popup, this catches it -- getAnimations() reports CSS
   * animations by name and transitions by property.
   */
  test('the dialog popup animates only via transitions', async ({ page }) => {
    await gotoStory(page, 'data-display-dialog--default');
    await startFrameRecorder(page, { popup: DIALOG_POPUP });
    await page.getByRole('button', { name: 'Share' }).click();
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(1);
    await page.waitForTimeout(SETTLE);

    const seen = animationsSeen(await readFrames(page), 'popup');
    expect(seen.sort()).toEqual(['opacity', 'scale']);
  });
});

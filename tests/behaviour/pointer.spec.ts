import { expect, test, type Page } from '@playwright/test';

import { gotoStory } from './helpers';
import {
  DIALOG_POPUP,
  MENU_ROOT_POPUP,
  SLIDER_CONTROL,
  SLIDER_INPUT,
  SLIDER_THUMB,
  SLIDER_TRACK,
  SUBMENU_POPUP,
  SUBMENU_TRIGGER,
  TOAST,
} from './selectors';

/** Press, drag in `steps` increments, release. Base UI's swipe threshold is 40px. */
async function drag(page: Page, from: { x: number; y: number }, dx: number, dy: number) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  const steps = 8;
  for (let i = 1; i <= steps; i += 1) {
    await page.mouse.move(from.x + (dx * i) / steps, from.y + (dy * i) / steps);
  }
  await page.mouse.up();
}

async function centreOf(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox();
  if (!box) throw new Error(`no bounding box for ${selector}`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Push a fresh toast so the test never races the previous one's 5s timeout. */
async function freshToast(page: Page) {
  await gotoStory(page, 'feedback-toaster--default');
  await page.locator(TOAST).getByRole('button', { includeHidden: true }).click();
  await expect(page.locator(TOAST)).toHaveCount(0);
  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.locator(TOAST)).toHaveCount(1);

  /*
   * Wait for the enter *slide* to finish, not just for the element to exist.
   * The toast animates up from `transform: translateY(150%)`, so a bounding box
   * measured the instant it mounts points at empty space below where the thing
   * will be, and the drag below would press on nothing.
   *
   * This used to poll `translate` for 'none', which stopped being a wait at all
   * once the toast adopted Base UI's stacking geometry: the slide, the per-index
   * peek offset and the scale now compose into one `transform`, so `translate`
   * reads 'none' from the first frame and the poll passed instantly. Polling for
   * no live animations is both a real barrier and indifferent to which property
   * the geometry happens to use.
   */
  await expect
    .poll(() => page.locator(TOAST).evaluate((el) => el.getAnimations().length))
    .toBe(0);

  // The settled state for a lone toast: index 0, no swipe offset, no shrink.
  await expect
    .poll(() => page.locator(TOAST).evaluate((el) => getComputedStyle(el).transform))
    .toBe('matrix(1, 0, 0, 1, 0, 0)');
}

test.describe('toast swipe to dismiss', () => {
  /*
   * Base UI's default swipeDirection is ['down', 'right']; Radix swiped right
   * only. The in-flight transform is written inline on the root with
   * `transition: none` pinned while a pointer is down, which is why the v2
   * `data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)` classes were
   * deleted rather than renamed -- there is nothing left for them to do.
   */
  test('swiping down dismisses', async ({ page }) => {
    await freshToast(page);
    await drag(page, await centreOf(page, TOAST), 0, 90);
    await expect(page.locator(TOAST)).toHaveCount(0);
  });

  test('swiping right dismisses', async ({ page }) => {
    await freshToast(page);
    await drag(page, await centreOf(page, TOAST), 120, 0);
    await expect(page.locator(TOAST)).toHaveCount(0);
  });

  test('swiping in an unsupported direction leaves no residual transform', async ({ page }) => {
    await freshToast(page);
    const settledTransform = await page
      .locator(TOAST)
      .evaluate((el) => getComputedStyle(el).transform);

    // Left is not in the default direction set, so this must not dismiss...
    await drag(page, await centreOf(page, TOAST), -120, 0);
    await expect(page.locator(TOAST)).toHaveCount(1);

    /*
     * ...and the spring-back has to be allowed to finish before the transform is
     * read. A fixed 400ms wait used to cover it, and stopped covering it when the
     * transform transition went from 200ms to Base UI's 0.5s
     * cubic-bezier(0.22, 1, 0.36, 1): the toast was still 0.015px from home and
     * the assertion caught it mid-flight. `--toast-swipe-movement-x` is reset the
     * moment the pointer lifts, so the variables below say "settled" well before
     * the paint does -- which is exactly the gap this poll closes.
     */
    await expect
      .poll(() => page.locator(TOAST).evaluate((el) => el.getAnimations().length))
      .toBe(0);

    // The point of the test: no residue from the damped drag transform applied
    // inline while the pointer was down.
    const after = await page.locator(TOAST).evaluate((el) => ({
      transform: getComputedStyle(el).transform,
      movementX: getComputedStyle(el).getPropertyValue('--toast-swipe-movement-x').trim(),
      movementY: getComputedStyle(el).getPropertyValue('--toast-swipe-movement-y').trim(),
    }));
    expect(after.transform).toBe(settledTransform);
    expect(after.movementX).toBe('0px');
    expect(after.movementY).toBe('0px');
  });
});

test.describe('dropdown submenu pointer', () => {
  /*
   * Characterised rather than assumed, because Base UI's SubmenuTrigger wires
   * up both interactions and then disables one: `openOnHover` defaults to true,
   * and `useClick` is registered with `ignoreMouse: openOnHover`. So a mouse
   * press on the trigger does nothing at all and the hover is what opens it,
   * after a 100ms rest delay -- which is also why the story's play() opens it
   * from the keyboard instead.
   */
  const SUBMENU_STORY = 'data-display-dropdownmenu--with-submenu';

  /** Reset to "parent menu open, submenu closed, pointer parked away". */
  async function parentMenuOnly(page: Page) {
    await gotoStory(page, SUBMENU_STORY);
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU_ROOT_POPUP)).toHaveCount(0);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator(MENU_ROOT_POPUP)).toHaveCount(1);
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(0);
  }

  /**
   * Rest the pointer on the submenu trigger. The first move is over the parent
   * popup and is not padding: Base UI gates a submenu's hover-open on the parent
   * menu having seen a real mousemove (`allowMouseEnter`), so arriving on the
   * trigger from outside the popup never opens it.
   */
  async function hoverTrigger(page: Page) {
    const box = await page.locator(SUBMENU_TRIGGER).boundingBox();
    if (!box) throw new Error('no submenu trigger box');
    await page.mouse.move(box.x + box.width / 2, box.y - 20, { steps: 5 });
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
  }

  test('hovering the trigger opens the submenu, and leaving closes it', async ({ page }) => {
    await parentMenuOnly(page);
    await hoverTrigger(page);

    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);
    await expect(page.locator(SUBMENU_TRIGGER)).toHaveAttribute('data-popup-open', '');
    // Opened by pointer, the trigger is highlighted as well -- unlike the
    // keyboard path, where the parent's active index moves off it.
    await expect(page.locator(SUBMENU_TRIGGER)).toHaveAttribute('data-highlighted', '');

    // Leaving the popup entirely closes the submenu but not the parent menu.
    await page.mouse.move(5, 5, { steps: 10 });
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(0);
    await expect(page.locator(MENU_ROOT_POPUP)).toHaveCount(1);
  });

  test('a mouse press on the trigger is not what opens it', async ({ page }) => {
    /*
     * `ignoreMouse: openOnHover` makes the click interaction inert for a mouse,
     * so a submenu that appears "on click" actually appeared because the pointer
     * came to rest there. Proved in-page from three timestamps rather than from
     * a sampled state: when the pointer arrived on the trigger, when the press
     * was delivered, and when the popup entered the DOM.
     *
     * Both margins are one-sided rather than tuned. `arrived -> appeared` is
     * bounded below by the 100ms rest delay in real time, so no machine can make
     * it smaller; a slow one only makes it larger. And the press is delivered in
     * the first few milliseconds of that window, so `press < appeared` is a
     * direct demonstration that the press had already happened and had not
     * opened anything -- React flushes a discrete mousedown synchronously, so a
     * click-driven open would be in the DOM before the following mouseup.
     * Measured on this container: arrived->press 8-15ms, arrived->appeared 104ms.
     */
    await parentMenuOnly(page);

    const box = await page.locator(SUBMENU_TRIGGER).boundingBox();
    if (!box) throw new Error('no submenu trigger box');
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    // Prime allowMouseEnter over the popup but above the trigger, so the move
    // below is the pointer's first arrival on the trigger itself.
    await page.mouse.move(cx, box.y - 20, { steps: 4 });

    await page.evaluate(
      ({ popupSelector, triggerSelector }) => {
        const w = window as unknown as {
          __probe: { arrived: number | null; press: number | null; appeared: number | null };
        };
        w.__probe = { arrived: null, press: null, appeared: null };
        document.querySelector(triggerSelector)?.addEventListener('mousemove', () => {
          w.__probe.arrived = performance.now();
        });
        document.addEventListener(
          'mouseup',
          () => {
            w.__probe.press = performance.now();
          },
          true
        );
        new MutationObserver(() => {
          if (w.__probe.appeared === null && document.querySelector(popupSelector)) {
            w.__probe.appeared = performance.now();
          }
        }).observe(document.body, { childList: true, subtree: true });
      },
      { popupSelector: SUBMENU_POPUP, triggerSelector: SUBMENU_TRIGGER }
    );

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.up();
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);

    const probe = await page.evaluate(
      () =>
        (window as unknown as { __probe: { arrived: number; press: number; appeared: number } })
          .__probe
    );
    expect(probe.arrived).not.toBeNull();
    expect(probe.press).not.toBeNull();
    expect(probe.appeared).not.toBeNull();

    // The press landed while the submenu was still closed...
    expect(probe.press).toBeLessThan(probe.appeared);
    // ...and the submenu opened on the hover rest delay instead.
    expect(probe.appeared - probe.arrived).toBeGreaterThan(80);
  });

  test('pressing the trigger while the submenu is open does not toggle it shut', async ({
    page,
  }) => {
    // `toggle: !openOnHover` -- false here, so the press has nothing to toggle.
    await parentMenuOnly(page);
    await hoverTrigger(page);
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);

    await page.locator(SUBMENU_TRIGGER).click();
    await page.waitForTimeout(400);
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);
  });
});

/*
 * A pointer x, converted to a value the way an edge-aligned Base UI slider does.
 *
 * This is a real behaviour change from v2 and it is easy to miss. Radix mapped a
 * pointer across the *whole* track rect -- `getValueFromPointer` used
 * `[0, rect.width]` -- and applied `getThumbInBoundsOffset()` purely as a
 * visual nudge. Base UI with `thumbAlignment="edge"` insets the mapping by half
 * a thumb at each end, so the value tracks where the thumb's *centre* can
 * actually go. On this story (288px track, 20px thumb) that is a span of 268px
 * starting 10px in, so a press at 25% of the track reads 23, not 25, and 75%
 * reads 77. Consumers converting a click position to a value by hand will see
 * up to half a thumb width of difference.
 */
async function edgeAlignedValue(page: Page, pointerX: number) {
  const track = await page.locator(SLIDER_TRACK).boundingBox();
  const thumb = await page.locator(SLIDER_THUMB).boundingBox();
  if (!track || !thumb) throw new Error('missing box');
  const usable = track.width - thumb.width;
  const ratio = (pointerX - (track.x + thumb.width / 2)) / usable;
  return String(Math.round(Math.min(1, Math.max(0, ratio)) * 100));
}

test.describe('slider pointer', () => {
  test('dragging the thumb changes the value', async ({ page }) => {
    await gotoStory(page, 'form-slider--default');
    const input = page.locator(SLIDER_INPUT);
    await expect(input).toHaveValue('50');

    const track = await page.locator(SLIDER_TRACK).boundingBox();
    if (!track) throw new Error('no track box');
    const targetX = track.x + track.width * 0.75;
    const expected = await edgeAlignedValue(page, targetX);

    const thumb = await centreOf(page, SLIDER_THUMB);
    await page.mouse.move(thumb.x, thumb.y);
    await page.mouse.down();
    await page.mouse.move(targetX, thumb.y, { steps: 10 });
    await page.mouse.up();

    expect(expected).toBe('77'); // guards the helper against becoming a tautology
    await expect(input).toHaveValue(expected);
  });

  test('pressing the track jumps the value to that position', async ({ page }) => {
    await gotoStory(page, 'form-slider--default');
    const input = page.locator(SLIDER_INPUT);
    await expect(input).toHaveValue('50');

    const track = await page.locator(SLIDER_TRACK).boundingBox();
    if (!track) throw new Error('no track box');
    const targetX = track.x + track.width * 0.25;
    const expected = await edgeAlignedValue(page, targetX);

    await page.mouse.click(targetX, track.y + track.height / 2);

    expect(expected).toBe('23');
    await expect(input).toHaveValue(expected);
  });

  test('the focus ring comes from has-[:focus-visible] on the thumb', async ({ page }) => {
    /*
     * Under Radix the thumb itself took focus, so `focus-visible:ring-2` matched
     * it. Base UI's thumb is a presentational <div> wrapping the focusable
     * <input type="range">, so `focus-visible:` on the thumb stays valid
     * Tailwind and silently never matches again -- the ring just disappears.
     */
    await gotoStory(page, 'form-slider--default');
    const thumb = page.locator(SLIDER_THUMB);

    const unfocused = await thumb.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(unfocused).toBe('none');

    await page.keyboard.press('Tab');
    await expect(page.locator(SLIDER_INPUT)).toBeFocused();

    const focused = await thumb.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(focused).not.toBe('none');
  });

  /*
   * thumbAlignment. Base UI defaults to "center", which aligns the thumb's
   * centre with the end of the track and hangs half of a 20px thumb off both
   * ends of an 8px track; Radix's getThumbInBoundsOffset() behaved like "edge".
   * They agree exactly at the midpoint -- which is the only position the
   * screenshot suite ever sees -- so this is structurally invisible to VR and
   * has to be read off the geometry at the extremes.
   */
  test('the thumb stays inside the track at min and at max', async ({ page }) => {
    await gotoStory(page, 'form-slider--default');
    await page.keyboard.press('Tab');
    await expect(page.locator(SLIDER_INPUT)).toBeFocused();

    const boxes = async () => {
      const track = await page.locator(SLIDER_TRACK).boundingBox();
      const thumb = await page.locator(SLIDER_THUMB).boundingBox();
      if (!track || !thumb) throw new Error('missing box');
      return { track, thumb };
    };

    // Subpixel layout means exact equality is the wrong test; half a pixel is
    // well inside the 10px error that "center" alignment would produce.
    const EPSILON = 0.5;

    await page.keyboard.press('Home');
    await expect(page.locator(SLIDER_INPUT)).toHaveValue('0');
    const atMin = await boxes();
    expect(atMin.thumb.x).toBeGreaterThanOrEqual(atMin.track.x - EPSILON);

    await page.keyboard.press('End');
    await expect(page.locator(SLIDER_INPUT)).toHaveValue('100');
    const atMax = await boxes();
    expect(atMax.thumb.x + atMax.thumb.width).toBeLessThanOrEqual(
      atMax.track.x + atMax.track.width + EPSILON
    );
  });

  test('the thumb is centred on the track vertically', async ({ page }) => {
    /*
     * Guards the Root/Control split. `relative` has to sit on Control, not Root:
     * the thumb positions itself with `top: 50%` against its nearest positioned
     * ancestor, and Root carries 40px of vertical padding, so getting this wrong
     * drops the thumb 8px below the track with no CSS error of any kind.
     */
    await gotoStory(page, 'form-slider--default');
    const track = await page.locator(SLIDER_TRACK).boundingBox();
    const thumb = await page.locator(SLIDER_THUMB).boundingBox();
    if (!track || !thumb) throw new Error('missing box');

    const trackCentre = track.y + track.height / 2;
    const thumbCentre = thumb.y + thumb.height / 2;
    expect(Math.abs(trackCentre - thumbCentre)).toBeLessThanOrEqual(0.5);

    // And the control is the positioned ancestor doing it.
    const position = await page
      .locator(SLIDER_CONTROL)
      .evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe('relative');
  });
});

test.describe('dialog scroll locking', () => {
  /*
   * Base UI's useScrollLock writes inline styles on the document rather than
   * mounting react-remove-scroll's wrapper, so what to assert on is different
   * from v2 even though the user-visible effect is the same.
   *
   * None of the stories is tall enough to have a real scrollbar, and adding one
   * or changing what a story renders is off limits -- story IDs and their
   * rendering are load-bearing for the screenshot baselines. So this asserts on
   * the mechanism (the computed overflow the lock produces, and that it is
   * cleaned up) plus the observable consequence that the document cannot be
   * scrolled while the dialog is open.
   */
  test('locks the document while open and releases it on close', async ({ page }) => {
    await gotoStory(page, 'data-display-dialog--default');

    const overflow = () =>
      page.evaluate(() => ({
        html: getComputedStyle(document.documentElement).overflow,
        body: getComputedStyle(document.body).overflow,
      }));

    expect(await overflow()).toMatchObject({ body: 'visible' });

    await page.getByRole('button', { name: 'Share' }).click();
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(1);

    expect(await overflow()).toMatchObject({ body: 'hidden' });

    // The consequence, not just the mechanism: nothing can scroll the document.
    const scrolled = await page.evaluate(() => {
      const before = window.scrollY;
      window.scrollTo(0, 500);
      document.documentElement.scrollTop = 500;
      document.body.scrollTop = 500;
      return { before, after: window.scrollY };
    });
    expect(scrolled.after).toBe(scrolled.before);

    await page.keyboard.press('Escape');
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(0);
    expect(await overflow()).toMatchObject({ body: 'visible' });
  });
});

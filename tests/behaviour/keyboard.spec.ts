import { expect, test, type Page } from '@playwright/test';

import { gotoStory } from './helpers';
import {
  ALERT_DIALOG_POPUP,
  DIALOG_POPUP,
  MENU_ITEM,
  MENU_POPUP,
  MENU_ROOT_POPUP,
  SLIDER_INPUT,
  SUBMENU_POPUP,
  SUBMENU_TRIGGER,
  TOAST,
  TOAST_VIEWPORT,
} from './selectors';

/** Text of the item currently carrying data-highlighted, or null. */
const highlighted = (page: Page) =>
  page.evaluate(
    (selector) => document.querySelector(`${selector}[data-highlighted]`)?.textContent ?? null,
    MENU_ITEM
  );

const activeDescription = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName,
      role: el.getAttribute('role'),
      text: (el.textContent ?? '').trim().slice(0, 40),
    };
  });

test.describe('dropdown menu keyboard model', () => {
  test('arrow keys move data-highlighted between items', async ({ page }) => {
    await gotoStory(page, 'data-display-dropdownmenu--opens-on-click');
    await expect(page.locator(MENU_POPUP)).toHaveCount(1);

    // Nothing is highlighted until a key is pressed: a click-opened menu starts
    // with focus on the popup itself and no active item.
    expect(await highlighted(page)).toBeNull();
    expect((await activeDescription(page))?.role).toBe('menu');

    await page.keyboard.press('ArrowDown');
    expect(await highlighted(page)).toBe('Profile');

    await page.keyboard.press('ArrowDown');
    expect(await highlighted(page)).toBe('Settings');

    await page.keyboard.press('ArrowUp');
    expect(await highlighted(page)).toBe('Profile');

    /*
     * Recorded, not asserted as a requirement: Base UI 1.6 *does* move DOM focus
     * onto the highlighted item once the keyboard is used, even though it leaves
     * focus on the popup while the menu is merely open. The migration note that
     * "Base UI keeps focus on the popup" is only true of the initial state, so
     * `data-highlighted` -- not `:focus` -- remains the correct styling hook,
     * but a consumer relying on document.activeElement will still find the item.
     */
    expect((await activeDescription(page))?.role).toBe('menuitem');
  });

  test('type-ahead jumps to the matching item', async ({ page }) => {
    await gotoStory(page, 'data-display-dropdownmenu--default');
    await expect(page.locator(MENU_POPUP)).toHaveCount(1);

    await page.keyboard.press('s');
    expect(await highlighted(page)).toBe('Settings');

    /*
     * Type-ahead accumulates keystrokes into one search string and resets after
     * a quiet period, so the second probe has to be genuinely separated from the
     * first -- pressing "p" immediately would search for "sp" and match nothing.
     * This is a "wait longer than the reset", not a sample at a guessed instant,
     * so it does not make the test timing-sensitive.
     */
    await page.waitForTimeout(1_500);
    await page.keyboard.press('p');
    expect(await highlighted(page)).toBe('Profile');
  });

  test('Escape closes the menu and returns focus to the trigger', async ({ page }) => {
    await gotoStory(page, 'data-display-dropdownmenu--opens-on-click');
    await expect(page.locator(MENU_POPUP)).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(page.locator(MENU_POPUP)).toHaveCount(0);
    expect(await activeDescription(page)).toMatchObject({ tag: 'BUTTON', text: 'Open menu' });
  });

  test('a keyboard-opened popup shows no focus ring', async ({ page }) => {
    await gotoStory(page, 'data-display-dropdownmenu--opens-on-click');
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU_POPUP)).toHaveCount(0);

    // Focus is back on the trigger; open with the keyboard rather than a click.
    await page.keyboard.press('Enter');
    await expect(page.locator(MENU_POPUP)).toHaveCount(1);

    /*
     * The popup takes DOM focus on open, so without `outline-hidden` the UA
     * focus ring would be drawn round the whole menu on every keyboard open --
     * a visible regression the screenshot suite cannot see, because its only
     * open-menu baselines come from defaultOpen rather than an interaction.
     */
    const ring = await page.locator(MENU_POPUP).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth };
    });
    expect(ring.outlineStyle).toBe('none');
  });
});

test.describe('dropdown submenu keyboard model', () => {
  /*
   * The submenu story leaves both popups open, because that is what its
   * screenshot needs. Every test here closes the submenu first and drives the
   * open itself, so the assertion is about the interaction rather than about
   * whatever play() happened to leave behind.
   */
  const SUBMENU_STORY = 'data-display-dropdownmenu--with-submenu';

  /** Text of the item carrying data-highlighted inside one popup, or null. */
  const highlightedIn = (page: Page, popup: string) =>
    page.evaluate(
      ({ popupSelector, itemSelector }) =>
        document.querySelector(`${popupSelector} ${itemSelector}[data-highlighted]`)?.textContent ??
        null,
      { popupSelector: popup, itemSelector: MENU_ITEM }
    );

  test('ArrowRight opens the submenu and ArrowLeft closes it again', async ({ page }) => {
    await gotoStory(page, SUBMENU_STORY);
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);

    await page.keyboard.press('ArrowLeft');
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(0);
    // ArrowLeft closes only the submenu -- the parent menu stays up.
    await expect(page.locator(MENU_ROOT_POPUP)).toHaveCount(1);

    // Focus and the highlight both land back on the trigger that was left.
    expect(await activeDescription(page)).toMatchObject({ role: 'menuitem', text: 'Invite people' });
    expect(await highlightedIn(page, MENU_ROOT_POPUP)).toBe('Invite people');

    await page.keyboard.press('ArrowRight');
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);
  });

  test('opening from the keyboard highlights and focuses the first submenu item', async ({
    page,
  }) => {
    /*
     * This is where a submenu diverges from the parent menu, and it is worth
     * pinning down because the two are the same component. A click-opened parent
     * menu leaves DOM focus on the popup with nothing highlighted (asserted
     * above); ArrowRight into a submenu skips that state entirely and arrives
     * with the first item already active, because the key that opened it is also
     * a navigation key.
     */
    await gotoStory(page, SUBMENU_STORY);
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(0);

    await page.keyboard.press('ArrowRight');
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);

    expect(await highlightedIn(page, SUBMENU_POPUP)).toBe('Email invite');
    expect(await activeDescription(page)).toMatchObject({ role: 'menuitem', text: 'Email invite' });

    // And the arrows keep working inside the submenu.
    await page.keyboard.press('ArrowDown');
    expect(await highlightedIn(page, SUBMENU_POPUP)).toBe('Copy link');
  });

  test('the trigger carries data-popup-open, and loses data-highlighted, while open', async ({
    page,
  }) => {
    /*
     * Both halves matter. `data-popup-open` is the trigger-specific attribute
     * (Base UI runs a trigger through triggerOpenStateMapping, so `data-open:`
     * on one is valid Tailwind that never matches) -- and it is not redundant
     * with `data-highlighted`, because a keyboard-opened submenu moves the
     * parent's active index *off* the trigger. Without the
     * `data-popup-open:bg-accent` rule in dropdown-menu.tsx the trigger would go
     * unstyled the instant its submenu opened.
     *
     * The attributes rather than the computed background: `--color-accent` is
     * one of the six @theme tokens this library still does not define, so
     * `bg-accent` currently emits nothing. When that is fixed the rule starts
     * painting, and this test already guarantees it will paint at the right time.
     */
    await gotoStory(page, SUBMENU_STORY);
    const trigger = page.locator(SUBMENU_TRIGGER);

    await expect(trigger).toHaveAttribute('data-popup-open', '');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).not.toHaveAttribute('data-highlighted', /.*/);

    await page.keyboard.press('ArrowLeft');
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(0);

    await expect(trigger).not.toHaveAttribute('data-popup-open', /.*/);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('data-highlighted', '');
  });

  test('Escape closes the submenu only, and a second Escape closes the menu', async ({ page }) => {
    /*
     * SubmenuRoot defaults `closeParentOnEsc` to false, so Escape is scoped to
     * the innermost menu. Radix's Sub had no such prop and behaved the same way,
     * but it is now a defaulted prop a consumer can flip, which makes the
     * default worth a test.
     */
    await gotoStory(page, SUBMENU_STORY);
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(page.locator(SUBMENU_POPUP)).toHaveCount(0);
    await expect(page.locator(MENU_ROOT_POPUP)).toHaveCount(1);
    expect(await activeDescription(page)).toMatchObject({ role: 'menuitem', text: 'Invite people' });

    await page.keyboard.press('Escape');
    await expect(page.locator(MENU_POPUP)).toHaveCount(0);
    expect(await activeDescription(page)).toMatchObject({ tag: 'BUTTON', text: 'Open menu' });
  });
});

test.describe('dialog', () => {
  test('Escape closes it and focus returns to the trigger', async ({ page }) => {
    await gotoStory(page, 'data-display-dialog--default');

    await page.getByRole('button', { name: 'Share' }).click();
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(0);
    expect(await activeDescription(page)).toMatchObject({ tag: 'BUTTON', text: 'Share' });
  });

  test('pressing outside closes it', async ({ page }) => {
    await gotoStory(page, 'data-display-dialog--default');

    await page.getByRole('button', { name: 'Share' }).click();
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(1);

    // Top-left corner: the backdrop covers the viewport, the popup is centred.
    await page.mouse.click(8, 8);
    await expect(page.locator(DIALOG_POPUP)).toHaveCount(0);
  });
});

test.describe('alert dialog', () => {
  /*
   * The point of an alert dialog is that a stray click cannot dismiss it. Base
   * UI enforces that in the component rather than leaving it to props, which is
   * the same guarantee Radix gave -- but it is now a different code path, and
   * nothing else in the suite covers it.
   */

  /*
   * Escape DOES close an alert dialog, and that is not a migration regression --
   * it is what v2 did too, and what the WAI-ARIA alertdialog pattern asks for.
   *
   * Measured rather than assumed, because "an alert dialog is dismissible by
   * neither Escape nor an outside press" is a common and wrong summary of both
   * libraries. Radix's AlertDialogContent prevented `onPointerDownOutside` and
   * `onInteractOutside` and left `onEscapeKeyDown` alone; Base UI's
   * useRenderDialogRoot forces `disablePointerDismissal` for the alert-dialog
   * mode but passes `escapeKey: isTopmost` through unchanged. Same behaviour,
   * different code path -- which is exactly why it is worth a test.
   */
  test('Escape closes it, as it did under Radix', async ({ page }) => {
    await gotoStory(page, 'feedback-alertdialog--default');

    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page.locator(ALERT_DIALOG_POPUP)).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(page.locator(ALERT_DIALOG_POPUP)).toHaveCount(0);
  });

  test('pressing outside does NOT close it', async ({ page }) => {
    await gotoStory(page, 'feedback-alertdialog--default');

    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page.locator(ALERT_DIALOG_POPUP)).toHaveCount(1);

    await page.mouse.click(8, 8);
    await page.waitForTimeout(400);
    await expect(page.locator(ALERT_DIALOG_POPUP)).toHaveCount(1);
  });

  test('the Close part does close it', async ({ page }) => {
    await gotoStory(page, 'feedback-alertdialog--default');

    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page.locator(ALERT_DIALOG_POPUP)).toHaveCount(1);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator(ALERT_DIALOG_POPUP)).toHaveCount(0);
  });
});

test.describe('toast', () => {
  /*
   * None of this existed under Radix. F6 is Base UI's "jump to the notification
   * region" shortcut; the toast itself is only Escape-dismissible once focus is
   * inside it, which is why the two halves are asserted separately.
   */
  test('F6 moves focus to the viewport', async ({ page }) => {
    await gotoStory(page, 'feedback-toaster--default');
    await expect(page.locator(TOAST)).toHaveCount(1);

    await page.keyboard.press('F6');
    const active = await page.evaluate(
      (selector) => document.activeElement === document.querySelector(selector),
      TOAST_VIEWPORT
    );
    expect(active).toBe(true);
  });

  test('Escape closes the toast only once focus is inside it', async ({ page }) => {
    await gotoStory(page, 'feedback-toaster--default');
    await expect(page.locator(TOAST)).toHaveCount(1);

    // Focus is on the story's button, outside the toast: Escape is a no-op.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(page.locator(TOAST)).toHaveCount(1);

    // F6 lands on the viewport, Tab steps into the toast, and now Escape works.
    await page.keyboard.press('F6');
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(
      (selector) => !!document.activeElement?.closest(selector),
      TOAST
    );
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(page.locator(TOAST)).toHaveCount(0);
  });
});

test.describe('slider keyboard', () => {
  /*
   * All new plumbing. Radix put tabindex on the thumb itself; Base UI's thumb is
   * a presentational <div> wrapping a visually hidden <input type="range">, and
   * every key below is handled by Base UI rather than by the native input.
   */
  test('arrows, Shift+Arrow, PageUp/PageDown, Home and End', async ({ page }) => {
    await gotoStory(page, 'form-slider--default');

    const input = page.locator(SLIDER_INPUT);
    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('50');

    await page.keyboard.press('ArrowRight');
    await expect(input).toHaveValue('51');

    await page.keyboard.press('ArrowLeft');
    await expect(input).toHaveValue('50');

    // largeStep defaults to 10 in Base UI. Radix had no Shift modifier at all.
    await page.keyboard.press('Shift+ArrowRight');
    await expect(input).toHaveValue('60');

    await page.keyboard.press('Shift+ArrowLeft');
    await expect(input).toHaveValue('50');

    // PageUp/PageDown use the same largeStep.
    await page.keyboard.press('PageUp');
    await expect(input).toHaveValue('60');

    await page.keyboard.press('PageDown');
    await expect(input).toHaveValue('50');

    await page.keyboard.press('Home');
    await expect(input).toHaveValue('0');

    await page.keyboard.press('End');
    await expect(input).toHaveValue('100');
  });

  test('Slider.Value follows the handle', async ({ page }) => {
    /*
     * The v2 label printed `props.defaultValue`, so the number under the thumb
     * froze at the initial value forever. Slider.Value reads live state; this is
     * the regression test for that fix, and no screenshot can catch it because
     * the only baseline is the untouched midpoint.
     */
    await gotoStory(page, 'form-slider--default');

    const value = page.locator('output');
    await expect(value).toHaveText('50');

    await page.keyboard.press('Tab');
    await page.keyboard.press('End');
    await expect(value).toHaveText('100');
  });
});

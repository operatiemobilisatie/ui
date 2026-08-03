import { expect, test } from '@playwright/test';

import { gotoStory } from './helpers';

/*
 * Regression coverage for the v3 audit's a11y and interaction fixes. Each test
 * exercises a story the way a consumer would, and asserts on live DOM state
 * rather than on screenshots -- the visual suite cannot see any of these
 * (focus rings, keyboard-selected highlights, and aria state are all
 * interaction-driven).
 */

const RADIO_INPUT = 'input[type="radio"]';

test.describe('radio-button keyboard model', () => {
  test('the input is in the tab order, so arrow keys and Space work', async ({ page }) => {
    await gotoStory(page, 'form-radiobutton--group');

    // The first radio (defaultChecked) is in the tab order and focusable.
    const first = page.locator(RADIO_INPUT).first();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();

    // A native radio group takes one tab stop: the second option is NOT its
    // own tab stop (the old label tabIndex made every option one).
    await page.keyboard.press('Tab');
    await expect(first).not.toBeFocused();

    // Arrow keys move selection within the group.
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    const second = page.locator(RADIO_INPUT).nth(1);
    await expect(second).toBeChecked();

    // Arrow again selects the third.
    await page.keyboard.press('ArrowDown');
    const third = page.locator(RADIO_INPUT).nth(2);
    await expect(third).toBeChecked();
  });
});

test.describe('select option highlight', () => {
  test('the focused option carries the highlight class, not just hover', async ({ page }) => {
    await gotoStory(page, 'form-select--default');

    // Open the menu with the keyboard.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // react-select drives highlight via isFocused, so a keyboard-arrowed option
    // must carry the bg-gray-100 class that :hover alone would never set.
    const firstOption = page.locator('[role="option"]').first();
    await page.keyboard.press('ArrowDown');
    await expect(firstOption).toHaveClass(/bg-gray-100/);
  });
});

test.describe('progress contract', () => {
  test('renders a progressbar with a live aria-valuenow for a numeric value', async ({
    page,
  }) => {
    await gotoStory(page, 'feedback-progress--default');

    const bar = page.locator('[role="progressbar"]');
    await expect(bar).toHaveAttribute('aria-valuenow', '60');
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');

    // The count-up settles at the story's value.
    await expect(page.getByText('60%')).toBeVisible();
  });
});

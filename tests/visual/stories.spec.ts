import { readFileSync, existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const INDEX = '.storybook/static/index.json';

/*
 * Read the story index at collection time, not over HTTP: Playwright starts the
 * webServer *after* collecting tests, so `npm run build-storybook` must already
 * have run. The `vr` script chains them for exactly this reason.
 */
if (!existsSync(INDEX)) {
  throw new Error(`${INDEX} not found -- run \`npm run build-storybook\` first (or use \`npm run vr\`).`);
}

type Entry = { id: string; type: string; tags?: string[] };

const entries: Record<string, Entry> = JSON.parse(readFileSync(INDEX, 'utf8')).entries;

const stories = Object.values(entries)
  .filter((e) => e.type === 'story' && !e.tags?.includes('!vr'))
  .sort((a, b) => a.id.localeCompare(b.id));

test.describe('storybook visual regression', () => {
  for (const story of stories) {
    test(story.id, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'load' });

      /*
       * Set by .storybook/preview.ts on STORY_RENDERED, which fires after play()
       * resolves. state: 'attached' is required -- the default is 'visible', and
       * <html> reports as hidden on layout:'fullscreen' stories whose only
       * content is fixed-position or portalled, so the default silently timed out
       * on every toast story despite the attribute being present.
       */
      await page.waitForSelector('html[data-sb-rendered=true]', { state: 'attached', timeout: 15_000 });

      // The Storybook stylesheet declares font-display: block, so this is a real barrier.
      await page.waitForFunction(() => document.fonts.status === 'loaded');

      // Belt and braces on top of animations:'disabled'.
      await page
        .waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), undefined, {
          timeout: 3_000,
        })
        .catch(() => {});

      await expect(page).toHaveScreenshot(`${story.id}.png`, {
        // Not cosmetic: Dialog/Menu/Tooltip popups portal into <body>, outside
        // #storybook-root, so a viewport-only shot would clip them.
        fullPage: true,
        mask: [page.locator('[data-vr-mask]')],
      });
    });
  }
});

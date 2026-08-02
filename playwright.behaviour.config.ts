import { defineConfig, devices } from '@playwright/test';

/*
 * The behaviour suite is a *separate config*, not a second project inside
 * playwright.config.ts, and deliberately so.
 *
 *   - `npm run vr` must keep meaning "take screenshots and nothing else". A
 *     second project in the same file would be picked up by every existing
 *     invocation of `playwright test`, including the ones in CI.
 *   - Animations are ENABLED here. That is the whole point of the suite: the
 *     screenshot config sets `animations: 'disabled'` on toHaveScreenshot, so it
 *     is structurally blind to every transition Phase 5 introduced.
 *   - There are no snapshots at all, so none of the snapshot plumbing
 *     (snapshotPathTemplate, threshold, maxDiffPixels) applies and no baseline
 *     PNG can be touched from here.
 *
 * The webServer serves the same static Storybook build on a different port, so
 * a running visual suite and a running behaviour suite do not fight over 6007.
 */

const PORT = 6008;

export default defineConfig({
  testDir: './tests/behaviour',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  /*
   * Zero, same as the visual suite and for the same reason. A behaviour test
   * that only passes on the second attempt is measuring the machine, not the
   * component, and hiding that behind a retry is worse than not having the test.
   */
  retries: 0,

  // Transitions are real time here, so these tests are mostly waiting rather
  // than rasterising. Two workers keeps memory in the same envelope as the
  // visual suite on a 4 GB box.
  workers: Number(process.env.PW_WORKERS) || 2,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report-behaviour', open: 'never' }]],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    timezoneId: 'UTC',
    locale: 'en-GB',
    trace: 'retain-on-failure',
    /*
     * `reducedMotion` is not a declared test option in Playwright 1.62 -- it only
     * appears in doc comments -- so it cannot be set here. `gotoStory()` calls
     * page.emulateMedia({ reducedMotion: 'no-preference' }) instead, which is
     * the supported route and makes the requirement explicit rather than relying
     * on the default.
     */
  },

  projects: [{ name: 'behaviour', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `npx http-server .storybook/static -p ${PORT} -s -c-1`,
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

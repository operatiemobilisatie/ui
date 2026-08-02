import { defineConfig, devices } from '@playwright/test';

const PORT = 6007;

export default defineConfig({
  testDir: './tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  // Deliberately zero. Retrying a flaky pixel diff turns real rendering
  // nondeterminism into a green build that fails randomly later.
  retries: 0,

  /*
   * Each worker is a full Chromium taking fullPage screenshots, which is memory
   * hungry: at 4 workers on a 4 GB box the renderer dies with "Target crashed"
   * on a random handful of stories every run. Two is comfortable; raise it with
   * PW_WORKERS on a bigger machine.
   */
  workers: Number(process.env.PW_WORKERS) || 2,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0.15, // per-pixel YIQ tolerance, absorbs subpixel antialiasing

      /*
       * Absolute, and deliberately tiny. A ratio is the wrong control here:
       * these stories are small components centred in a 1280x800 fullPage frame,
       * so maxDiffPixelRatio: 0.002 would have allowed ~2000 differing pixels --
       * more than an entire button changing width. Measured: a px-5 -> px-6 change
       * on Button moves only 78-189 pixels, so that budget silently passed it.
       *
       * Rendering inside the pinned container is deterministic, so the honest
       * budget is 0 and anything above it is a real change.
       */
      maxDiffPixels: 0,
    },
  },

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
    timezoneId: 'UTC',
    locale: 'en-GB',
  },

  // One browser only. Adding firefox/webkit triples the baseline count for
  // near-zero signal on a Tailwind component library.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `npx http-server .storybook/static -p ${PORT} -s -c-1`,
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

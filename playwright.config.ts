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
  workers: process.env.CI ? 4 : '50%',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0.15, // per-pixel YIQ tolerance, absorbs subpixel antialiasing
      maxDiffPixelRatio: 0.002, // ~2000px of a 1280x800 frame
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

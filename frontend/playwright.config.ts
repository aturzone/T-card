import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config.
 *
 * Playwright doesn't ship a browser for every Linux distro (e.g. Ubuntu 26.04).
 * If `npx playwright install chromium` fails on your machine, point Chromium at
 * an existing Chromium-family browser via PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH:
 *
 *   export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/brave/current/opt/brave.com/brave/brave
 *   npm run test:e2e
 *
 * For the default case (`npx playwright install` worked) leave it unset.
 */
const braveDefault = '/snap/brave/current/opt/brave.com/brave/brave';
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath ? { executablePath } : undefined,
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 7'],
        launchOptions: executablePath ? { executablePath } : undefined,
      },
    },
  ],
});

// Hint for users on machines where neither bundled chromium nor brave exist.
if (!executablePath && !require('node:fs').existsSync(braveDefault)) {
  // eslint-disable-next-line no-console
  console.warn(
    '\n[playwright] No bundled chromium + no Brave at',
    braveDefault,
    '\n            → run `npx playwright install chromium`',
    '\n            → or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH to a Chromium binary.',
  );
}

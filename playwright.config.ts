import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,   // safer for tests with login/logout
  forbidOnly: !!process.env.CI,
  retries: 0,             // no automatic retries
  workers: 1,             // optional: run one test at a time

  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  timeout: 300000,

  use: {
    actionTimeout: 300000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  expect: {
    timeout: 300000,
  },
});

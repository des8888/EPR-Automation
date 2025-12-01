import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,

  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  timeout: 300000,

  use: {
    actionTimeout: 300000,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'on',

  },

  expect: {
    timeout: 300000,
  },
});

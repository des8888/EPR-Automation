import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

const storageFile = './auth/storageState.json';
const accountingStorageFile = './auth/accounting.json';
const storageExists = fs.existsSync(storageFile);
const accountingStorageExists = fs.existsSync(accountingStorageFile);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : undefined,

  // ✅ HTML reporter output
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  timeout: 300000,

  use: {
    actionTimeout: 300000, // applies to clicks, fills, waitFor, etc.
    trace: 'retain-on-failure', // ✅ capture full trace when test fails
    screenshot: 'only-on-failure', // ✅ take screenshot when test fails
    video: 'retain-on-failure', // ✅ keep video on failure for debugging
  },

  expect: {
    timeout: 300000 // waits up to 5 minutes
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      testIgnore: /accounting\.setup\.ts/,
    },
    {
      name: 'behind-login',
      testMatch: /^(?!.*AccountingPage\.test\.ts).*\.test\.ts$/,
      dependencies: ['setup'],
      use: storageExists
        ? {
            storageState: storageFile,
          }
        : {},
    },
    {
      name: 'accounting',
      testMatch: /AccountingPage\.test\.ts/,
      dependencies: ['accounting-setup'],
      use: accountingStorageExists
        ? { storageState: accountingStorageFile }
        : {},
    },
    {
      name: 'accounting-setup',
      testMatch: /tests\/setup\/accounting\.setup\.ts/,
    },
  ],
});

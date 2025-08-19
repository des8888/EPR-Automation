import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

const storageFile = '.auth/storageState.json';
const storageExists = fs.existsSync(storageFile);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 120000,
  use: {
  actionTimeout: 120000, // applies to clicks, fills, waitFor, etc.
  },
  expect: {
    timeout: 120000 // waits up to 2 minutes
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      
    },
    {
      name: 'behind-login',
      testMatch: /.*\.test\.ts/,
      dependencies: ['setup'],
      use: storageExists
        ? {
            storageState: storageFile,  // Apply ONLY if file exists!
          }
        : {},
    },
  ],
});

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  globalSetup: './lib/check-auth.ts',
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testDir: './scripts',
      testMatch: 'save-auth.spec.ts',
    },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        storageState: './auth.json',
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
      dependencies: ['setup'],
    },
  ],
});

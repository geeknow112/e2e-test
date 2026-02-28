import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  globalSetup: './lib/check-auth.ts',
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'on',
    video: { mode: 'on', size: { width: 1920, height: 1080 } },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        storageState: './auth.json',
        locale: 'ja-JP',
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ['--lang=ja'],
        },
      },
    },
  ],
});

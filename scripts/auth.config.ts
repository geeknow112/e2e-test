import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 手動ログイン用の設定
 * 使い方: npm run auth:manual
 */
export default defineConfig({
  testDir: '../scripts',
  testMatch: 'manual-auth.spec.ts',
  timeout: 300000,
  use: {
    baseURL: process.env.BASE_URL,
    headless: false,
  },
});

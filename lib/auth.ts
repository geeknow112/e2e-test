import { Page, expect } from '@playwright/test';

/**
 * WP管理画面に自動ログインする
 * 環境変数 BASE_URL, WP_USER, WP_PASS を使用
 */
export async function login(page: Page) {
  const baseUrl = process.env.BASE_URL;
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASS;

  if (!baseUrl || !user || !pass) {
    throw new Error('環境変数 BASE_URL / WP_USER / WP_PASS が設定されていません');
  }

  await page.goto(`${baseUrl}/wp-login.php`);
  await page.fill('#user_login', user);
  await page.fill('#user_pass', pass);
  await page.click('#wp-submit');
  await page.waitForURL('**/wp-admin/**');
  await expect(page.locator('#wpadminbar')).toBeVisible();
}

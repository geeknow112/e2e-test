import { test } from '@playwright/test';

/**
 * 手動ログイン用スクリプト
 * ブラウザが開くので手動でログインしてください。
 * ログイン完了後、auth.json が自動保存されます。
 * 使い方: npm run auth:manual
 */
test('手動ログインして認証状態を保存', async ({ browser }) => {
  test.setTimeout(300000);
  const context = await browser.newContext();
  const page = await context.newPage();
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error('環境変数 BASE_URL が設定されていません');
  }

  await page.goto(`${baseUrl}/wp-admin/`);
  console.log('ブラウザでログインしてください...');

  await page.waitForURL('**/wp-admin/**', { timeout: 300000 });
  await context.storageState({ path: './auth.json' });
  console.log('auth.json 保存完了');

  await browser.close();
});

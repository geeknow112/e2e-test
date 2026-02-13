import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

async function checkAuth() {
  const authPath = path.resolve('./auth.json');

  // auth.jsonが存在しない場合
  if (!fs.existsSync(authPath)) {
    console.error('\n❌ auth.json が見つかりません。');
    console.error('👉 npm run auth:manual を実行してログインしてください。\n');
    process.exit(1);
  }

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    console.error('\n❌ 環境変数 BASE_URL が設定されていません。\n');
    process.exit(1);
  }

  // auth.jsonを使ってWP管理画面にアクセスし、ログイン状態を確認
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: authPath });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/wp-admin/`, { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    const url = page.url();
    const hasLoginForm = await page.locator('input#user_login, input[name="log"]').count() > 0;
    const isLoginPage = url.includes('login') || url.includes('wp-login') || hasLoginForm;

    if (isLoginPage) {
      console.error('\n❌ 認証が切れています。');
      console.error('👉 npm run auth:manual を実行して再ログインしてください。\n');
      await browser.close();
      process.exit(1);
    }

    console.log('✅ 認証OK');
  } catch (e) {
    console.error('\n❌ 認証チェック中にエラーが発生しました。');
    console.error('👉 npm run auth:manual を実行して再ログインしてください。\n');
    await browser.close();
    process.exit(1);
  }

  await browser.close();
}

export default checkAuth;

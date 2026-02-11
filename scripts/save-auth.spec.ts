import { test } from '@playwright/test';
import { login } from '../lib/auth';

/**
 * 認証セットアップ
 * - 環境変数 WP_USER / WP_PASS で自動ログインし auth.json を保存
 * - auth.json が既にあればスキップ可（手動実行: npm run auth）
 */
test('ログインして認証状態を保存', async ({ page, context }) => {
  await login(page);
  await context.storageState({ path: './auth.json' });
});

import { Page, expect } from '@playwright/test';

// WAIT_SEC環境変数で待機秒数を指定（1〜3、デフォルト3）
const rawWait = process.env.WAIT_SEC ? Number(process.env.WAIT_SEC) : 3;
if (isNaN(rawWait) || rawWait < 1 || rawWait > 3) {
  throw new Error(`WAIT_SEC は 1〜3 の整数で指定してください（現在値: ${process.env.WAIT_SEC}）`);
}
const SLOW_WAIT = rawWait * 1000;

/**
 * 指定ミリ秒待機する（目視確認用）
 */
export async function wait(page: Page, ms = SLOW_WAIT) {
  await page.waitForTimeout(ms);
}

/**
 * ページが正常に表示されていることを検証する共通ヘルパー
 */
export async function assertPageLoaded(page: Page) {
  await expect(page.locator('#wpbody-content').first()).toBeVisible();
  await expect(page.locator('#wpadminbar')).toBeVisible();
  const body = await page.locator('body').textContent();
  expect(body).not.toContain('Fatal error');
  expect(body).not.toContain('Not Found');
  await page.evaluate(() => { document.body.style.zoom = '75%'; });
  await wait(page);
}

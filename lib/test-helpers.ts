import { Page, expect } from '@playwright/test';

const SLOW_WAIT = 3000;

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

import { Page, Locator, expect } from '@playwright/test';

// WAIT_SEC環境変数で待機秒数を指定（1〜10、デフォルト3）
const rawWait = process.env.WAIT_SEC ? Number(process.env.WAIT_SEC) : 3;
if (isNaN(rawWait) || rawWait < 1 || rawWait > 10) {
  throw new Error(`WAIT_SEC は 1〜10 の整数で指定してください（現在値: ${process.env.WAIT_SEC}）`);
}
const SLOW_WAIT = rawWait * 1000;

/**
 * 指定ミリ秒待機する（目視確認用）
 */
export async function wait(page: Page, ms = SLOW_WAIT) {
  await page.waitForTimeout(ms);
}

/**
 * テスト名をページ上部にオーバーレイ表示する
 */
export async function showTestTitle(page: Page, title: string) {
  await page.evaluate((t) => {
    document.getElementById('pw-test-title')?.remove();
    document.getElementById('pw-step-log')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'pw-test-title';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;padding:14px 24px;background:rgba(220,0,0,0.95);color:#fff;font-size:28px;font-weight:bold;z-index:2147483647;text-align:center;font-family:sans-serif;box-sizing:border-box;';
    overlay.textContent = t;
    document.documentElement.appendChild(overlay);
  }, title);
  await page.waitForTimeout(2000);
}

/**
 * 操作ステップをサブタイトルとしてタイトルバーの下に表示する
 */
export async function showStep(page: Page, step: string) {
  await page.evaluate((s) => {
    let log = document.getElementById('pw-step-log');
    if (!log) {
      log = document.createElement('div');
      log.id = 'pw-step-log';
      log.style.cssText = 'position:fixed;top:56px;left:0;width:100%;padding:8px 24px;background:rgba(0,0,0,0.8);color:#0f0;font-size:18px;font-family:monospace;z-index:2147483646;box-sizing:border-box;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      document.documentElement.appendChild(log);
    }
    const now = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    log.textContent = `[${now}] ${s}`;
  }, step);
}

/**
 * テスト結果（PASS/FAIL）をオーバーレイ表示する
 */
export async function showTestResult(page: Page, passed: boolean) {
  await page.evaluate((ok) => {
    document.getElementById('pw-test-result')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'pw-test-result';
    overlay.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);padding:40px 80px;background:${ok ? 'rgba(0,160,0,0.95)' : 'rgba(220,0,0,0.95)'};color:#fff;font-size:64px;font-weight:bold;z-index:2147483647;border-radius:20px;font-family:sans-serif;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.5);`;
    overlay.textContent = ok ? '✅ PASS' : '❌ FAIL';
    document.documentElement.appendChild(overlay);
  }, passed);
  await page.waitForTimeout(2000);
}

/**
 * 操作対象の要素を赤枠でハイライトしてからクリックする
 */
export async function highlightClick(page: Page, locator: Locator, stepLabel?: string) {
  if (stepLabel) await showStep(page, stepLabel);
  await locator.evaluate((el) => {
    el.style.outline = '3px solid red';
    el.style.outlineOffset = '2px';
    el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);
  await locator.click();
  await locator.evaluate((el) => {
    el.style.outline = '';
    el.style.outlineOffset = '';
  }).catch(() => {});
}

/**
 * 操作対象の要素を赤枠でハイライトしてから入力する
 */
export async function highlightFill(page: Page, locator: Locator, value: string, stepLabel?: string) {
  if (stepLabel) await showStep(page, stepLabel);
  await locator.evaluate((el) => {
    el.style.outline = '3px solid red';
    el.style.outlineOffset = '2px';
    el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);
  await locator.fill(value);
  await locator.evaluate((el) => {
    el.style.outline = '';
    el.style.outlineOffset = '';
  }).catch(() => {});
}

/**
 * セレクトボックスを赤枠でハイライトしてから選択する
 */
export async function highlightSelect(page: Page, locator: Locator, value: string, stepLabel?: string) {
  if (stepLabel) await showStep(page, stepLabel);
  await locator.evaluate((el) => {
    el.style.outline = '3px solid red';
    el.style.outlineOffset = '2px';
    el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);
  await locator.selectOption(value);
  await locator.evaluate((el) => {
    el.style.outline = '';
    el.style.outlineOffset = '';
  }).catch(() => {});
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
  await wait(page);
}

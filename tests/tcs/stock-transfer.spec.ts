import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-transfer`;

test.describe('在庫振替画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示');
    await showTestResult(page, true);
  });

  test('フォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'フォーム要素の確認');

    const content = page.locator('#wpbody-content').first();
    const hasForm = await content.locator('form').count();
    const hasTable = await content.locator('table').count();
    expect(hasForm + hasTable).toBeGreaterThan(0);
    await showTestResult(page, true);
  });

  test('「確認」ボタンが存在しクリックできる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'ボタン操作: 確認');

    const confirmBtn = page.locator('#wpbody-content input[value="確認"]').first();
    if (await confirmBtn.isVisible()) {
      await highlightClick(page, confirmBtn, '確認ボタンをクリック');
      await wait(page);
      await expect(page.locator('#wpbody-content').first()).toBeVisible();
      await showTestResult(page, true);
    } else {
      const submitBtn = page.locator('#wpbody-content input[type="submit"], #wpbody-content button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await highlightClick(page, submitBtn, '送信ボタンをクリック');
        await wait(page);
        await expect(page.locator('#wpbody-content').first()).toBeVisible();
        await showTestResult(page, true);
      } else {
        test.skip(true, '確認/送信ボタンが存在しない');
      }
    }
  });

  test('一括登録画面へのリンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'リンク遷移: 一括登録');

    const bulkLink = page.locator('#wpbody-content a[href*="page=stock-bulk"]').first();
    if (await bulkLink.isVisible()) {
      await highlightClick(page, bulkLink, '一括登録リンクをクリック');
      await wait(page);
      await page.waitForURL(/page=stock-bulk/, { timeout: 10000 });
      await assertPageLoaded(page);
      await showTestResult(page, true);
    } else {
      test.skip(true, '一括登録リンクが存在しない');
    }
  });
});

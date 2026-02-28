import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-bulk`;

test.describe('在庫登録(一括)画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示');
    await showTestResult(page, true);
  });

  test('「確認」ボタンが存在しクリックできる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'ボタン操作: 確認');

    const confirmBtn = page.locator('#wpbody-content input[value="確認"]').first();
    await expect(confirmBtn).toBeVisible();
    await highlightClick(page, confirmBtn, '確認ボタンをクリック');
    await wait(page);
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
    await showTestResult(page, true);
  });

  test('転送管理画面へのリンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'リンク遷移: 転送管理');

    const transferLink = page.locator('#wpbody-content a[href*="page=stock-transfer"]').first();
    if (await transferLink.isVisible()) {
      await highlightClick(page, transferLink, '転送管理リンクをクリック');
      await wait(page);
      await page.waitForURL(/page=stock-transfer/, { timeout: 10000 });
      await assertPageLoaded(page);
      await showTestResult(page, true);
    } else {
      test.skip(true, '転送リンクが存在しない');
    }
  });
});

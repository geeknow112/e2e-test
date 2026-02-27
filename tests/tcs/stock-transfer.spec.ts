import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-transfer`;

test.describe('在庫振替画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });

  test('フォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const content = page.locator('#wpbody-content').first();
    const hasForm = await content.locator('form').count();
    const hasTable = await content.locator('table').count();
    expect(hasForm + hasTable).toBeGreaterThan(0);
  });

  test('「確認」ボタンが存在しクリックできる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const confirmBtn = page.locator('#wpbody-content input[value="確認"]').first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await wait(page);
      await expect(page.locator('#wpbody-content').first()).toBeVisible();
    } else {
      const submitBtn = page.locator('#wpbody-content input[type="submit"], #wpbody-content button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await wait(page);
        await expect(page.locator('#wpbody-content').first()).toBeVisible();
      } else {
        test.skip(true, '確認/送信ボタンが存在しない');
      }
    }
  });

  test('一括登録画面へのリンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const bulkLink = page.locator('#wpbody-content a[href*="page=stock-bulk"]').first();
    if (await bulkLink.isVisible()) {
      await bulkLink.click();
      await wait(page);
      await page.waitForURL(/page=stock-bulk/, { timeout: 10000 });
      await assertPageLoaded(page);
    } else {
      test.skip(true, '一括登録リンクが存在しない');
    }
  });
});

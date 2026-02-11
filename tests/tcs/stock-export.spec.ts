import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-export`;

test.describe('在庫証明書画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });

  test('「検索」ボタンをクリックして正常に動作する', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // ダイアログが出る場合に備えて自動で閉じる
    page.on('dialog', async (dialog) => { await dialog.accept(); });

    const searchBtn = page.locator('#wpbody-content input[value="検索"]').first();
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await wait(page);
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
  });

  test('「表示」ボタンをクリックして正常に動作する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const showBtn = page.locator('#wpbody-content input[value=" 表示 "]').first();
    await expect(showBtn).toBeVisible();
    await showBtn.click();
    await wait(page);
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
  });
});

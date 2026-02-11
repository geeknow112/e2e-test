import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=goods-list`;

test.describe('商品検索画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });

  test('「検索」ボタンをクリックして正常に動作する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const searchBtn = page.locator('#wpbody-content input[value="検索"]').first();
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();
    await wait(page);
    await assertPageLoaded(page);
  });

  test('商品番号リンクをクリックして商品詳細へ遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const detailLink = page.locator('#wpbody-content a[href*="page=goods-detail"]').first();
    if (await detailLink.isVisible()) {
      await detailLink.click();
      await wait(page);
      await page.waitForURL(/page=goods-detail/, { timeout: 10000 });
      await assertPageLoaded(page);
    } else {
      test.skip(true, '商品詳細リンクが存在しない');
    }
  });

  test('ページネーション（次のページ）をクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const nextPage = page.locator('#wpbody-content a[href*="paged=2"]').first();
    if (await nextPage.isVisible()) {
      await nextPage.click();
      await wait(page);
      await page.waitForURL(/paged=2/, { timeout: 10000 });
      await assertPageLoaded(page);
    } else {
      test.skip(true, 'ページネーションが存在しない');
    }
  });
});

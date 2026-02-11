import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=delivery-graph-stg`;

test.describe('配送予定表(STG)画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });

  test('「検索」ボタンが存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const searchBtn = page.locator('#wpbody-content input[value="検索"]').first();
    await expect(searchBtn).toBeVisible();
    await wait(page);
  });

  test('注文詳細リンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const salesLink = page.locator('#wpbody-content a[href*="page=sales-detail"]').first();
    if (await salesLink.isVisible()) {
      await salesLink.click();
      await wait(page);
      await page.waitForURL(/page=sales-detail/, { timeout: 10000 });
      await assertPageLoaded(page);
    } else {
      test.skip(true, '注文詳細リンクが存在しない');
    }
  });
});

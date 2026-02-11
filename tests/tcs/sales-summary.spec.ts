import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=sales-summary`;

test.describe('注文集計画面', () => {
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
});

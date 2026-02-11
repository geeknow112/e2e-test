import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=sales-list`;

test.describe('注文検索画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });

  test('注文詳細リンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
    await wait(page);

    const detailLink = page.locator('#wpbody-content a[href*="page=sales-detail"]').first();
    if (await detailLink.isVisible()) {
      await detailLink.click();
      await wait(page);
      await page.waitForURL(/page=sales-detail/, { timeout: 10000 });
      await assertPageLoaded(page);
    } else {
      test.skip(true, '注文詳細リンクが存在しない');
    }
  });

  test('配送予定表リンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
    await wait(page);

    const graphLink = page.locator('#wpbody-content a[href*="page=delivery-graph"]').first();
    if (await graphLink.isVisible()) {
      await graphLink.click();
      await wait(page);
      await page.waitForURL(/page=delivery-graph/, { timeout: 10000 });
      await assertPageLoaded(page);
    } else {
      test.skip(true, '配送予定表リンクが存在しない');
    }
  });
});

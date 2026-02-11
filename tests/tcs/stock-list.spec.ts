import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-list`;

test.describe('在庫検索画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });

  test('在庫詳細リンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
    await wait(page);

    const detailLink = page.locator('#wpbody-content a[href*="page=stock-bulk"]').first();
    if (await detailLink.isVisible()) {
      await detailLink.click();
      await wait(page);
      await page.waitForURL(/page=stock-bulk/, { timeout: 10000 });
      await assertPageLoaded(page);
    } else {
      test.skip(true, '在庫詳細リンクが存在しない');
    }
  });
});

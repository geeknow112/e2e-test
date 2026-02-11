import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=customer-detail`;

test.describe('顧客登録画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });

  test('「確認」ボタンが存在しクリックできる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const confirmBtn = page.locator('#wpbody-content input[value="確認"]').first();
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();
    await wait(page);
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
  });
});

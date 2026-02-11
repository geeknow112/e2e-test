import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-list`;

test.describe('在庫検索画面', () => {
  test('検索条件を入力して検索し、結果が正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // 倉庫を選択
    await page.locator('select[name="s[outgoing_warehouse]"]').selectOption('1');
    await wait(page);

    // 入庫日を入力
    await page.locator('input[name="s[arrival_s_dt]"]').fill('2024-01-01');
    await page.locator('input[name="s[arrival_e_dt]"]').fill('2025-12-31');
    await wait(page);

    // 検索ボタンをクリック
    const searchBtn = page.locator('#wpbody-content input[value="検索"]').first();
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();
    await wait(page);

    // 検索結果が正常に表示される
    await assertPageLoaded(page);
  });

  test('在庫詳細リンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

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

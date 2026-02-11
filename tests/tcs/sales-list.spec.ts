import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=sales-list`;

test.describe('注文検索画面', () => {

  test('各検索条件パターンで検索し結果が正常に表示される', async ({ page }) => {
    test.setTimeout(300000);

    // --- 1. 条件なしで検索 ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 2. 車種のみ指定 ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('select[name="s[car_model]"]').selectOption('2'); // 6t-1
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 3. ステータスのみ指定（確定） ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('select[name="s[status]"]').selectOption('1');
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 4. ステータスのみ指定（未確定） ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('select[name="s[status]"]').selectOption('0');
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 5. 倉庫のみ指定 ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('select[name="s[outgoing_warehouse]"]').selectOption('1'); // 内藤SP
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 6. 配送日のみ指定 ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('input[name="s[delivery_s_dt]"]').fill('2024-01-01');
    await page.locator('input[name="s[delivery_e_dt]"]').fill('2025-12-31');
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 7. 入庫日のみ指定 ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('input[name="s[arrival_s_dt]"]').fill('2024-01-01');
    await page.locator('input[name="s[arrival_e_dt]"]').fill('2025-12-31');
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 8. 車種＋ステータス ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('select[name="s[car_model]"]').selectOption('3'); // 6t-2
    await page.locator('select[name="s[status]"]').selectOption('1'); // 確定
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 9. 倉庫＋配送日 ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('select[name="s[outgoing_warehouse]"]').selectOption('2'); // 丹波SP
    await page.locator('input[name="s[delivery_s_dt]"]').fill('2024-06-01');
    await page.locator('input[name="s[delivery_e_dt]"]').fill('2025-06-30');
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);

    // --- 10. 全条件指定 ---
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await page.locator('select[name="s[car_model]"]').selectOption('1'); // 未確定
    await page.locator('select[name="s[status]"]').selectOption('0'); // 未確定
    await page.locator('select[name="s[outgoing_warehouse]"]').selectOption('1'); // 内藤SP
    await page.locator('input[name="s[delivery_s_dt]"]').fill('2024-01-01');
    await page.locator('input[name="s[delivery_e_dt]"]').fill('2025-12-31');
    await page.locator('input[name="s[arrival_s_dt]"]').fill('2024-01-01');
    await page.locator('input[name="s[arrival_e_dt]"]').fill('2025-12-31');
    await wait(page);
    await page.locator('#wpbody-content input[value="検索"]').first().click();
    await wait(page);
    await assertPageLoaded(page);
  });

  test('注文詳細リンクをクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

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

import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=delivery-graph`;

// --- フィルタボタン定義 ---
const FILTER_BUTTONS = [
  '繰返', '未確定', '①', '②', '③', '④', '⑤',
  '結果入力欄', '>>', '繰返 → 未確定',
] as const;

test.describe('配送予定表画面', () => {

  // 要件1: 画面初期表示・全要素確認
  test('画面が正常に表示されフィルタボタン群が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // 検索ボタン（TCSバグあり、存在確認のみ）
    await expect(page.locator('#wpbody-content input[value="検索"]').first()).toBeVisible();

    // フィルタボタン群
    for (const label of FILTER_BUTTONS) {
      await expect(page.locator(`#wpbody-content input[value="${label}"]`).first()).toBeVisible();
    }
    await wait(page);
  });

  // 要件2: フィルタボタン動作確認（1テスト内で連続実行）
  test('各フィルタボタンをクリックしてエラーが発生しない', async ({ page }) => {
    test.setTimeout(180000);

    for (const label of FILTER_BUTTONS) {
      await page.goto(PAGE_URL);
      await assertPageLoaded(page);

      const btn = page.locator(`#wpbody-content input[value="${label}"]`).first();
      await btn.click();
      await wait(page);

      // エラーが発生していないことを確認
      const body = await page.locator('body').textContent();
      expect(body).not.toContain('Fatal error');
    }
  });

  // 要件3: 注文詳細リンク遷移
  test('商品名リンクをクリックして注文詳細画面に遷移する', async ({ page }) => {
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

  // 要件4: テーブル内入力フォーム要素確認
  test('テーブル内の入力フォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // 数量入力欄
    const qtyInput = page.locator('#wpbody-content input[type="number"][id^="qty_"]').first();
    await expect(qtyInput).toBeAttached();

    // 出庫倉庫セレクトボックス
    const warehouseSelect = page.locator('#wpbody-content select[id^="outgoing_warehouse_"]').first();
    await expect(warehouseSelect).toBeAttached();

    // 顧客氏名セレクトボックス
    const customerSelect = page.locator('#wpbody-content select[id^="customer_"]').first();
    await expect(customerSelect).toBeAttached();

    // 「注文」ボタン
    await expect(page.locator('#wpbody-content input[value="注文"]').first()).toBeAttached();

    // 「更新」ボタン
    await expect(page.locator('#wpbody-content input[value="更新"]').first()).toBeAttached();

    // 「直取分」ボタン
    await expect(page.locator('#wpbody-content input[value="直取分"]').first()).toBeAttached();

    // 「入力」リンクボタン
    await expect(page.locator('#wpbody-content a.btn-primary:has-text("入力")').first()).toBeAttached();

    await wait(page);
  });
});

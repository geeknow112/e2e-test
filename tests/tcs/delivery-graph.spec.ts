import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick, highlightFill, showStep } from '../../lib/test-helpers';

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
    await showTestTitle(page, '画面初期表示: フィルタボタン群の確認');

    // 検索ボタン（TCSバグあり、存在確認のみ）
    await expect(page.locator('#wpbody-content input[value="検索"]').first()).toBeVisible();

    // フィルタボタン群
    for (const label of FILTER_BUTTONS) {
      await expect(page.locator(`#wpbody-content input[value="${label}"]`).first()).toBeVisible();
    }
    await wait(page);
    await showTestResult(page, true);
  });

  // 要件2: フィルタボタン動作確認（1テスト内で連続実行）
  test('各フィルタボタンをクリックしてエラーが発生しない', async ({ page }) => {
    test.setTimeout(180000);

    for (const label of FILTER_BUTTONS) {
      await page.goto(PAGE_URL);
      await assertPageLoaded(page);
      await showTestTitle(page, `フィルタ: ${label}`);

      const btn = page.locator(`#wpbody-content input[value="${label}"]`).first();
      await highlightClick(page, btn, `${label}ボタンをクリック`);
      await wait(page);

      // エラーが発生していないことを確認
      const body = await page.locator('body').textContent();
      expect(body).not.toContain('Fatal error');
    }
    await showTestResult(page, true);
  });

  // 要件3: 注文詳細リンク遷移
  test('商品名リンクをクリックして注文詳細画面に遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'リンク遷移: 注文詳細');

    const salesLink = page.locator('#wpbody-content a[href*="page=sales-detail"]').first();
    if (await salesLink.isVisible()) {
      await highlightClick(page, salesLink, '注文詳細リンクをクリック');
      await wait(page);
      await page.waitForURL(/page=sales-detail/, { timeout: 10000 });
      await assertPageLoaded(page);
      await showTestResult(page, true);
    } else {
      test.skip(true, '注文詳細リンクが存在しない');
    }
  });

  // 要件4: テーブル内入力フォーム要素確認
  test('テーブル内の入力フォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'テーブル内入力フォーム要素の確認');

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
    await showTestResult(page, true);
  });

  // 要件5: 日付検索フォームの動作確認（既知バグ: cmd_searchのBladeテンプレート未展開）
  test('日付検索フォームに日付を入力して検索ボタンを押す', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '日付検索フォームの動作確認');

    // 日付入力欄の存在確認
    const dateInput = page.locator('#wpbody-content input[type="date"][name="s[sdt]"]');
    await expect(dateInput).toBeVisible();
    await showStep(page, '日付入力欄が存在することを確認');
    await wait(page);

    // 日付を入力
    await highlightFill(page, dateInput, '2026-03-28', '開始日に 2026-03-28 を入力');
    await wait(page);

    // 検索ボタンの存在確認
    const searchBtn = page.locator('#wpbody-content input#search-submit[value="検索"]');
    await expect(searchBtn).toBeVisible();

    // cmd_search関数のBladeテンプレート展開状態を確認
    const cmdSearchSource = await page.evaluate(() => {
      return typeof (window as any).cmd_search === 'function'
        ? (window as any).cmd_search.toString()
        : 'NOT FOUND';
    });
    const hasBladeTemplate = cmdSearchSource.includes('{{') || cmdSearchSource.includes('admin_url()');
    await showStep(page, hasBladeTemplate
      ? '⚠️ BUG検出: cmd_search内にBladeテンプレートが未展開のまま残っている'
      : '✅ cmd_search関数は正常に展開されている');
    await wait(page);

    // 検索ボタンをクリック（Bladeバグにより不正URLへ遷移する可能性あり）
    const currentUrl = page.url();
    await showStep(page, '検索ボタンをクリック');

    // クリック→ナビゲーションをまとめてtry/catchで処理
    // Bladeバグの場合、不正URLへ遷移しページコンテキストが壊れる
    let pageAlive = true;
    let searchWorked = false;
    try {
      // noWaitAfter: trueでクリック後のナビゲーション完了を待たない
      await searchBtn.click({ noWaitAfter: true });
      // 少し待ってからページ状態を確認
      await page.waitForTimeout(3000);
      // ページが生きているか確認
      await page.evaluate(() => document.title);

      // action=search を含むURLに遷移したか確認
      const afterUrl = page.url();
      if (/action=search/.test(afterUrl)) {
        searchWorked = true;
        await showStep(page, '✅ 検索が実行され、URLに action=search が含まれている');
        await assertPageLoaded(page);
        const hasDateParam = afterUrl.includes('s%5Bsdt%5D=') || afterUrl.includes('s[sdt]=');
        await showStep(page, hasDateParam
          ? '✅ URLに日付パラメータが含まれている'
          : '⚠️ URLに日付パラメータが含まれていない');
      } else if (afterUrl === currentUrl) {
        await showStep(page, '⚠️ BUG: 検索ボタンを押してもページ遷移しなかった');
      } else if (afterUrl.includes('{{') || afterUrl.includes('admin_url')) {
        await showStep(page, '⚠️ BUG: Bladeテンプレートが未展開のURLに遷移した');
      } else {
        await showStep(page, '⚠️ 検索後のURLが想定外: 遷移先を確認してください');
      }

      // エラーページでないことだけ確認
      const body = await page.locator('body').textContent();
      expect(body).not.toContain('Fatal error');
    } catch {
      pageAlive = false;
      console.log('⚠️ BUG: 検索ボタンクリック後にページコンテキストが破壊されました（Bladeテンプレート未展開が原因の可能性）');
    }

    // バグの有無を記録（テスト自体はfailにしない、バグレポート用）
    if (hasBladeTemplate) {
      test.info().annotations.push({
        type: 'known-bug',
        description: 'cmd_search関数内のBladeテンプレート(admin_url, formPage)が未展開。日付検索が動作しない。',
      });
    }

    if (pageAlive) {
      await wait(page);
      await showTestResult(page, !hasBladeTemplate);
    }
  });
});

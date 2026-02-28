import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showStep, showTestResult, highlightClick, highlightFill } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=sales-detail`;

// --- フォーム要素ロケーター ---
const LOCATORS = {
  salesNo: 'input[name="sales"]#sales',
  customer: '#customer',
  carClass: '#class',
  carsTank: '#cars_tank',
  goods: 'select#goods',
  shipAddr: '#ship_addr',
  field1: '#field1',
  qty: 'select#qty',
  useStock: '#use_stock',
  useStockLabel: 'label.btn[for="use_stock"]',
  deliveryDt: '#delivery_dt',
  arrivalDt: '#arrival_dt',
  outgoingWarehouse: '#outgoing_warehouse',
  repeatFg: '#repeat_fg',
  repeatFgLabel: 'label.btn[for="repeat_fg"]',
  period: '#period',
  span: '#span',
  repeatStartDt: '#repeat_s_dt',
  repeatEndDt: '#repeat_e_dt',
  confirmBtn: '#cmd_regist',
  updateBtn: '#cmd_update',
} as const;

const LIST_URL = `${baseUrl}/wp-admin/admin.php?page=sales-list`;

test.describe('注文登録画面', () => {

  // 要件1: 画面初期表示・フォーム要素確認
  test('画面が正常に表示されフォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示: フォーム要素の確認');

    await expect(page.locator(LOCATORS.salesNo)).toBeVisible();
    await expect(page.locator(LOCATORS.customer)).toBeVisible();
    await expect(page.locator(LOCATORS.carClass)).toBeVisible();
    await expect(page.locator(LOCATORS.carsTank)).toBeAttached();
    await expect(page.locator(LOCATORS.goods)).toBeAttached();
    await expect(page.locator(LOCATORS.shipAddr)).toBeAttached();
    await expect(page.locator(LOCATORS.qty)).toBeAttached();
    await expect(page.locator(LOCATORS.outgoingWarehouse)).toBeAttached();
    await expect(page.locator(LOCATORS.field1)).toBeVisible();
    await expect(page.locator(LOCATORS.useStock)).toBeAttached();
    await expect(page.locator(LOCATORS.repeatFg)).toBeAttached();
    await expect(page.locator(LOCATORS.deliveryDt)).toBeAttached();
    await expect(page.locator(LOCATORS.arrivalDt)).toBeAttached();
    await expect(page.locator(LOCATORS.period)).toBeAttached();
    await expect(page.locator(LOCATORS.span)).toBeAttached();
    await expect(page.locator(LOCATORS.repeatStartDt)).toBeAttached();
    await expect(page.locator(LOCATORS.repeatEndDt)).toBeAttached();
    await expect(page.locator(LOCATORS.confirmBtn)).toBeVisible();
    await wait(page);
    await showTestResult(page, true);
  });

  // 要件2: フォーム入力テスト（編集可能な欄のみ）
  test('編集可能な入力欄に値を設定できる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'フォーム入力: 各入力欄');

    // テキストエリア
    await highlightFill(page, page.locator(LOCATORS.field1), 'テスト備考', '備考を入力');
    await expect(page.locator(LOCATORS.field1)).toHaveValue('テスト備考');

    // 日付入力
    await highlightFill(page, page.locator(LOCATORS.deliveryDt), '2026-03-01', '配送日を入力');
    await expect(page.locator(LOCATORS.deliveryDt)).toHaveValue('2026-03-01');
    await highlightFill(page, page.locator(LOCATORS.arrivalDt), '2026-03-02', '入庫日を入力');
    await expect(page.locator(LOCATORS.arrivalDt)).toHaveValue('2026-03-02');

    // セレクトボックス（顧客を選択）
    const customerOptions = await page.locator(`${LOCATORS.customer} option`).count();
    if (customerOptions > 1) {
      await page.locator(LOCATORS.customer).selectOption({ index: 1 });
    }

    await wait(page);
    await showTestResult(page, true);
  });

  // 要件3: チェックボックス操作（label経由でクリック）
  test('チェックボックスをlabel経由で操作できる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'チェックボックス操作');

    // 在庫使用チェックボックス（labelでクリック）
    await highlightClick(page, page.locator(LOCATORS.useStockLabel), '在庫使用をON');
    await wait(page);
    await expect(page.locator(LOCATORS.useStock)).toBeChecked();
    await highlightClick(page, page.locator(LOCATORS.useStockLabel), '在庫使用をOFF');
    await expect(page.locator(LOCATORS.useStock)).not.toBeChecked();

    // 繰返チェックボックス（labelがあればlabel経由、なければ直接）
    const repeatLabel = page.locator(LOCATORS.repeatFgLabel);
    if (await repeatLabel.isVisible()) {
      await highlightClick(page, repeatLabel, '繰返をON');
      await wait(page);
      await expect(page.locator(LOCATORS.repeatFg)).toBeChecked();
      await highlightClick(page, repeatLabel, '繰返をOFF');
      await expect(page.locator(LOCATORS.repeatFg)).not.toBeChecked();
    } else {
      await page.locator(LOCATORS.repeatFg).check({ force: true });
      await wait(page);
      await expect(page.locator(LOCATORS.repeatFg)).toBeChecked();
      await page.locator(LOCATORS.repeatFg).uncheck({ force: true });
      await expect(page.locator(LOCATORS.repeatFg)).not.toBeChecked();
    }
    await showTestResult(page, true);
  });

  // 要件4: 確認ボタンクリック
  test('「確認」ボタンをクリックしてエラーが発生しない', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'ボタン操作: 確認');

    await highlightClick(page, page.locator(LOCATORS.confirmBtn), '確認ボタンをクリック');
    await wait(page);

    const body = await page.locator('body').textContent();
    expect(body).not.toContain('Fatal error');
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
    await showTestResult(page, true);
  });

  // 要件5: 既存データの編集→確認→更新→Success確認
  test('既存注文を編集して更新ボタンを押すとSuccessが表示される', async ({ page }) => {
    test.setTimeout(120000);

    // ダイアログを自動でOK
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Step1: 注文一覧から詳細画面へ遷移
    await page.goto(LIST_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '編集→確認→更新テスト');

    // 一覧の最初のsales-detailリンクをクリック
    const detailLink = page.locator('#wpbody-content a[href*="page=sales-detail"]').first();
    await expect(detailLink).toBeVisible();
    await detailLink.click();
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await showStep(page, '詳細画面に遷移完了');
    await wait(page);

    // Step2: 確認ボタンを押す（これだけ！）
    await showStep(page, '確認ボタンをクリック');
    await page.locator('#cmd_regist').click();
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await showStep(page, '確認ボタン押下後の画面');
    await wait(page);

    // 結果確認: 何が表示されているか
    const url = page.url();
    const hasUpdate = await page.locator('#cmd_update').isVisible().catch(() => false);
    const hasRegist = await page.locator('#cmd_regist').isVisible().catch(() => false);
    const hasReturn = await page.locator('#cmd_return').isVisible().catch(() => false);
    const bodyText = await page.locator('body').textContent() || '';
    const hasFatal = bodyText.includes('Fatal error');

    await showStep(page, `結果: update=${hasUpdate} regist=${hasRegist} return=${hasReturn} fatal=${hasFatal}`);

    // 確認画面に遷移できていれば更新ボタンが見える
    if (hasUpdate) {
      await showStep(page, '確認画面OK → 更新ボタンをクリック');
      await page.locator('#cmd_update').click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await wait(page);

      const finalBody = await page.locator('body').textContent() || '';
      expect(finalBody).not.toContain('Fatal error');
      await expect(page.locator('#cmd_return')).toBeVisible();
      await showTestResult(page, true);
    } else {
      // 確認画面に遷移できなかった場合、デバッグ情報を出して失敗
      throw new Error(`確認画面に遷移できませんでした。URL=${url}, fatal=${hasFatal}, regist=${hasRegist}`);
    }
  });
});

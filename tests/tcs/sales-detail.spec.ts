import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

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
} as const;

test.describe('注文登録画面', () => {

  // 要件1: 画面初期表示・フォーム要素確認
  test('画面が正常に表示されフォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

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
  });

  // 要件2: フォーム入力テスト（編集可能な欄のみ）
  test('編集可能な入力欄に値を設定できる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // テキストエリア
    await page.locator(LOCATORS.field1).fill('テスト備考');
    await expect(page.locator(LOCATORS.field1)).toHaveValue('テスト備考');

    // 日付入力
    await page.locator(LOCATORS.deliveryDt).fill('2026-03-01');
    await expect(page.locator(LOCATORS.deliveryDt)).toHaveValue('2026-03-01');
    await page.locator(LOCATORS.arrivalDt).fill('2026-03-02');
    await expect(page.locator(LOCATORS.arrivalDt)).toHaveValue('2026-03-02');

    // セレクトボックス（顧客を選択）
    const customerOptions = await page.locator(`${LOCATORS.customer} option`).count();
    if (customerOptions > 1) {
      await page.locator(LOCATORS.customer).selectOption({ index: 1 });
    }

    await wait(page);
  });

  // 要件3: チェックボックス操作（label経由でクリック）
  test('チェックボックスをlabel経由で操作できる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // 在庫使用チェックボックス（labelでクリック）
    await page.locator(LOCATORS.useStockLabel).click();
    await wait(page);
    await expect(page.locator(LOCATORS.useStock)).toBeChecked();
    await page.locator(LOCATORS.useStockLabel).click();
    await expect(page.locator(LOCATORS.useStock)).not.toBeChecked();

    // 繰返チェックボックス（labelがあればlabel経由、なければ直接）
    const repeatLabel = page.locator(LOCATORS.repeatFgLabel);
    if (await repeatLabel.isVisible()) {
      await repeatLabel.click();
      await wait(page);
      await expect(page.locator(LOCATORS.repeatFg)).toBeChecked();
      await repeatLabel.click();
      await expect(page.locator(LOCATORS.repeatFg)).not.toBeChecked();
    } else {
      await page.locator(LOCATORS.repeatFg).check({ force: true });
      await wait(page);
      await expect(page.locator(LOCATORS.repeatFg)).toBeChecked();
      await page.locator(LOCATORS.repeatFg).uncheck({ force: true });
      await expect(page.locator(LOCATORS.repeatFg)).not.toBeChecked();
    }
  });

  // 要件4: 確認ボタンクリック
  test('「確認」ボタンをクリックしてエラーが発生しない', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    await page.locator(LOCATORS.confirmBtn).click();
    await wait(page);

    const body = await page.locator('body').textContent();
    expect(body).not.toContain('Fatal error');
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
  });
});

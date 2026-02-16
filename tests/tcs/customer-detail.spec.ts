import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=customer-detail`;

// --- フォーム要素ロケーター ---
const LOCATORS = {
  customerCode: 'input[name="customer"]#customer',
  customerName: '#customer_name',
  tank: '#tank_0',
  addTankBtn: '#add_tank_0',
  goodsCheckbox: 'input[name="goods_s[]"]',
  confirmBtn: '#cmd_regist',
} as const;

test.describe('顧客登録画面', () => {

  // 要件1: 画面初期表示・フォーム要素確認
  test('画面が正常に表示されフォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    await expect(page.locator(LOCATORS.customerCode)).toBeVisible();
    await expect(page.locator(LOCATORS.customerName)).toBeVisible();
    await expect(page.locator(LOCATORS.tank)).toBeVisible();
    await expect(page.locator(LOCATORS.addTankBtn)).toBeVisible();
    const checkboxCount = await page.locator(LOCATORS.goodsCheckbox).count();
    expect(checkboxCount).toBeGreaterThan(0);
    await expect(page.locator(LOCATORS.confirmBtn)).toBeVisible();
    await wait(page);
  });

  // 要件2: フォーム入力テスト（編集可能な欄のみ）
  test('編集可能なテキスト欄に入力できる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // customerCodeはreadonly、それ以外に入力
    await page.locator(LOCATORS.customerName).fill('テスト顧客');
    await page.locator(LOCATORS.tank).fill('テストタンク');
    await wait(page);

    await expect(page.locator(LOCATORS.customerName)).toHaveValue('テスト顧客');
    await expect(page.locator(LOCATORS.tank)).toHaveValue('テストタンク');
  });

  // 要件3: 商品チェックボックス操作
  test('商品チェックボックスをクリックできる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    const firstCheckbox = page.locator(LOCATORS.goodsCheckbox).first();
    await firstCheckbox.check();
    await wait(page);
    await expect(firstCheckbox).toBeChecked();

    await firstCheckbox.uncheck();
    await expect(firstCheckbox).not.toBeChecked();
  });

  // 要件4: 追加ボタン・確認ボタンクリック
  test('「追加」「確認」ボタンをクリックしてエラーが発生しない', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    await page.locator(LOCATORS.addTankBtn).click();
    await wait(page);
    const body1 = await page.locator('body').textContent();
    expect(body1).not.toContain('Fatal error');

    await page.locator(LOCATORS.confirmBtn).click();
    await wait(page);
    const body2 = await page.locator('body').textContent();
    expect(body2).not.toContain('Fatal error');
    await expect(page.locator('#wpbody-content').first()).toBeVisible();
  });
});

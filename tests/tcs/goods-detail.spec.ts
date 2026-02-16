import { test, expect } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=goods-detail`;

// --- フォーム要素ロケーター ---
const LOCATORS = {
  goodsCode: '#goods',
  goodsName: '#goods_name',
  qty: '#qty',
  separatelyFg: '#separately_fg',
  remark: '#remark',
  confirmBtn: '#cmd_regist',
} as const;

test.describe('商品登録画面', () => {

  // 要件1: 画面初期表示・フォーム要素確認
  test('画面が正常に表示されフォーム要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    await expect(page.locator(LOCATORS.goodsCode)).toBeVisible();
    await expect(page.locator(LOCATORS.goodsName)).toBeVisible();
    await expect(page.locator(LOCATORS.qty)).toBeVisible();
    await expect(page.locator(LOCATORS.separatelyFg)).toBeAttached();
    await expect(page.locator(LOCATORS.remark)).toBeVisible();
    await expect(page.locator(LOCATORS.confirmBtn)).toBeVisible();
    await wait(page);
  });

  // 要件2: フォーム入力テスト（編集可能な欄のみ）
  test('編集可能なテキスト欄に入力できる', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    // goodsCodeはreadonly、それ以外に入力
    await page.locator(LOCATORS.goodsName).fill('テスト商品');
    await page.locator(LOCATORS.qty).fill('10');
    await page.locator(LOCATORS.remark).fill('テスト備考');
    await wait(page);

    await expect(page.locator(LOCATORS.goodsName)).toHaveValue('テスト商品');
    await expect(page.locator(LOCATORS.qty)).toHaveValue('10');
    await expect(page.locator(LOCATORS.remark)).toHaveValue('テスト備考');
  });

  // 要件3: 確認ボタンクリック
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

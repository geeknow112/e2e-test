import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

// --- 型定義 ---
interface SearchCondition {
  name: string;
  no?: string;
  goods_name?: string;
  qty?: string;
  lot?: string;
  outgoing_warehouse?: string;
  arrival_s_dt?: string;
  arrival_e_dt?: string;
}

// --- ロケーター定数 ---
const LOCATORS = {
  searchButton: '#wpbody-content input[value="検索"]',
  noInput: 'input[name="s[no]"]',
  goodsNameInput: 'input[name="s[goods_name]"]',
  qtyInput: 'input[name="s[qty]"]',
  lotInput: 'input[name="s[lot]"]',
  warehouseSelect: 'select[name="s[outgoing_warehouse]"]',
  arrivalStartDate: 'input[name="s[arrival_s_dt]"]',
  arrivalEndDate: 'input[name="s[arrival_e_dt]"]',
  paginationPage2: '#wpbody-content a[href*="paged=2"]',
} as const;

// --- 検索条件パターン ---
const SEARCH_PATTERNS: SearchCondition[] = [
  { name: '条件なし' },
  { name: '商品番号テキスト入力', no: '1' },
  { name: '商品名テキスト入力', goods_name: 'テスト商品' },
  { name: '数量テキスト入力', qty: '2' },
  { name: 'ロットテキスト入力', lot: 'LOT001' },
  { name: '出庫倉庫のみ（内藤SP）', outgoing_warehouse: '1' },
  { name: '入庫日のみ', arrival_s_dt: '2024-01-01', arrival_e_dt: '2025-12-31' },
  {
    name: '全条件指定',
    no: '1', goods_name: 'テスト', qty: '1', lot: 'LOT',
    outgoing_warehouse: '1', arrival_s_dt: '2024-01-01', arrival_e_dt: '2025-12-31',
  },
];

// --- URL定数 ---
const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-list`;

// --- 検索実行ヘルパー ---
async function executeSearch(page: Page, condition: SearchCondition): Promise<void> {
  await page.goto(PAGE_URL);
  await assertPageLoaded(page);

  if (condition.no) await page.locator(LOCATORS.noInput).fill(condition.no);
  if (condition.goods_name) await page.locator(LOCATORS.goodsNameInput).fill(condition.goods_name);
  if (condition.qty) await page.locator(LOCATORS.qtyInput).fill(condition.qty);
  if (condition.lot) await page.locator(LOCATORS.lotInput).fill(condition.lot);
  if (condition.outgoing_warehouse) await page.locator(LOCATORS.warehouseSelect).selectOption(condition.outgoing_warehouse);
  if (condition.arrival_s_dt) await page.locator(LOCATORS.arrivalStartDate).fill(condition.arrival_s_dt);
  if (condition.arrival_e_dt) await page.locator(LOCATORS.arrivalEndDate).fill(condition.arrival_e_dt);

  await wait(page);
  await page.locator(LOCATORS.searchButton).first().click();
  await wait(page);
  await assertPageLoaded(page);
}

// --- テストケース ---
test.describe('在庫検索画面', () => {

  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.noInput)).toBeVisible();
    await expect(page.locator(LOCATORS.goodsNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.qtyInput)).toBeVisible();
    await expect(page.locator(LOCATORS.lotInput)).toBeVisible();
    await expect(page.locator(LOCATORS.warehouseSelect)).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalStartDate)).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalEndDate)).toBeVisible();
    await wait(page);
  });

  test('各検索条件パターンで検索し結果が正常に表示される', async ({ page }) => {
    test.setTimeout(300000);
    for (const pattern of SEARCH_PATTERNS) {
      await executeSearch(page, pattern);
    }
  });

  test('リスト内の各リンク種別をクリックして遷移確認する', async ({ page }) => {
    test.setTimeout(120000);
    const linkTypes = [
      { name: '在庫詳細', selector: '#wpbody-content a[href*="page=stock-detail"]', urlPattern: /page=stock-detail/ },
      { name: '在庫一括', selector: '#wpbody-content a[href*="page=stock-bulk"]', urlPattern: /page=stock-bulk/ },
      { name: 'ロット登録', selector: '#wpbody-content a[href*="page=stock-lot-regist"]', urlPattern: /page=stock-lot-regist/ },
    ];
    for (const { name, selector, urlPattern } of linkTypes) {
      await page.goto(PAGE_URL);
      await assertPageLoaded(page);
      const link = page.locator(selector).first();
      if (await link.isVisible()) {
        await link.click();
        await wait(page);
        await page.waitForURL(urlPattern, { timeout: 10000 });
        await assertPageLoaded(page);
      }
    }
  });

  test('ページネーション（次のページ）をクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    const nextPage = page.locator(LOCATORS.paginationPage2).first();
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

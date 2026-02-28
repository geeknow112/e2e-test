import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick, highlightFill, highlightSelect } from '../../lib/test-helpers';

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
  await showTestTitle(page, `検索: ${condition.name}`);

  if (condition.no) await highlightFill(page, page.locator(LOCATORS.noInput), condition.no, '商品番号を入力');
  if (condition.goods_name) await highlightFill(page, page.locator(LOCATORS.goodsNameInput), condition.goods_name, '商品名を入力');
  if (condition.qty) await highlightFill(page, page.locator(LOCATORS.qtyInput), condition.qty, '数量を入力');
  if (condition.lot) await highlightFill(page, page.locator(LOCATORS.lotInput), condition.lot, 'ロットを入力');
  if (condition.outgoing_warehouse) await highlightSelect(page, page.locator(LOCATORS.warehouseSelect), condition.outgoing_warehouse, '出庫倉庫を選択');
  if (condition.arrival_s_dt) await highlightFill(page, page.locator(LOCATORS.arrivalStartDate), condition.arrival_s_dt, '入庫開始日を入力');
  if (condition.arrival_e_dt) await highlightFill(page, page.locator(LOCATORS.arrivalEndDate), condition.arrival_e_dt, '入庫終了日を入力');

  await wait(page);
  await highlightClick(page, page.locator(LOCATORS.searchButton).first(), '検索ボタンをクリック');
  await wait(page);
  await assertPageLoaded(page);
}

// --- テストケース ---
test.describe('在庫検索画面', () => {

  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示: 検索フォーム全要素の確認');
    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.noInput)).toBeVisible();
    await expect(page.locator(LOCATORS.goodsNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.qtyInput)).toBeVisible();
    await expect(page.locator(LOCATORS.lotInput)).toBeVisible();
    await expect(page.locator(LOCATORS.warehouseSelect)).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalStartDate)).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalEndDate)).toBeVisible();
    await wait(page);
    await showTestResult(page, true);
  });

  test('各検索条件パターンで検索し結果が正常に表示される', async ({ page }) => {
    test.setTimeout(300000);
    for (const pattern of SEARCH_PATTERNS) {
      await executeSearch(page, pattern);
    }
    await showTestResult(page, true);
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
      await showTestTitle(page, `リンク遷移: ${name}`);
      const link = page.locator(selector).first();
      if (await link.isVisible()) {
        await highlightClick(page, link, `${name}リンクをクリック`);
        await wait(page);
        await page.waitForURL(urlPattern, { timeout: 10000 });
        await assertPageLoaded(page);
      }
    }
    await showTestResult(page, true);
  });

  test('ページネーション（次のページ）をクリックして遷移する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'ページネーション: 2ページ目へ遷移');
    const nextPage = page.locator(LOCATORS.paginationPage2).first();
    if (await nextPage.isVisible()) {
      await highlightClick(page, nextPage, 'ページ2をクリック');
      await wait(page);
      await page.waitForURL(/paged=2/, { timeout: 10000 });
      await assertPageLoaded(page);
      await showTestResult(page, true);
    } else {
      test.skip(true, 'ページネーションが存在しない');
    }
  });
});

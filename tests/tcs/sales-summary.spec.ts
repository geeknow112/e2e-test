import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick, highlightFill, highlightSelect } from '../../lib/test-helpers';

interface SearchCondition {
  name: string;
  customer_name?: string;
  tank?: string;
  goods_name?: string;
  delivery_s_dt?: string;
  delivery_e_dt?: string;
  outgoing_warehouse?: string;
}

const LOCATORS = {
  searchButton: '#wpbody-content input[value="検索"]',
  customerNameInput: 'input[name="s[customer_name]"]',
  tankInput: 'input[name="s[tank]"]',
  goodsNameInput: 'input[name="s[goods_name]"]',
  deliveryStartDate: 'input[name="s[delivery_s_dt]"]',
  deliveryEndDate: 'input[name="s[delivery_e_dt]"]',
  warehouseSelect: 'select[name="s[outgoing_warehouse]"]',
} as const;

const SEARCH_PATTERNS: SearchCondition[] = [
  { name: '条件なし' },
  { name: '顧客名テキスト入力', customer_name: 'テスト顧客' },
  { name: 'タンクテキスト入力', tank: 'タンクA' },
  { name: '商品名テキスト入力', goods_name: 'テスト商品' },
  { name: '配送日のみ', delivery_s_dt: '2024-01-01', delivery_e_dt: '2025-12-31' },
  { name: '出庫倉庫のみ', outgoing_warehouse: '1' },
  {
    name: '全条件指定',
    customer_name: 'テスト', tank: 'タンク', goods_name: 'テスト',
    delivery_s_dt: '2024-01-01', delivery_e_dt: '2025-12-31',
    outgoing_warehouse: '1',
  },
];

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=sales-summary`;

async function executeSearch(page: Page, condition: SearchCondition): Promise<void> {
  await page.goto(PAGE_URL);
  await assertPageLoaded(page);
  await showTestTitle(page, `検索: ${condition.name}`);

  if (condition.customer_name) await highlightFill(page, page.locator(LOCATORS.customerNameInput), condition.customer_name, '顧客名を入力');
  if (condition.tank) await highlightFill(page, page.locator(LOCATORS.tankInput), condition.tank, 'タンクを入力');
  if (condition.goods_name) await highlightFill(page, page.locator(LOCATORS.goodsNameInput), condition.goods_name, '商品名を入力');
  if (condition.delivery_s_dt) await highlightFill(page, page.locator(LOCATORS.deliveryStartDate), condition.delivery_s_dt, '配送開始日を入力');
  if (condition.delivery_e_dt) await highlightFill(page, page.locator(LOCATORS.deliveryEndDate), condition.delivery_e_dt, '配送終了日を入力');
  if (condition.outgoing_warehouse) await highlightSelect(page, page.locator(LOCATORS.warehouseSelect), condition.outgoing_warehouse, '出庫倉庫を選択');

  await wait(page);
  await highlightClick(page, page.locator(LOCATORS.searchButton).first(), '検索ボタンをクリック');
  await wait(page);
  await assertPageLoaded(page);
}

test.describe('注文集計画面', () => {

  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示: 検索フォーム全要素の確認');
    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.customerNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.tankInput)).toBeVisible();
    await expect(page.locator(LOCATORS.goodsNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.deliveryStartDate)).toBeVisible();
    await expect(page.locator(LOCATORS.deliveryEndDate)).toBeVisible();
    await expect(page.locator(LOCATORS.warehouseSelect)).toBeVisible();
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
});

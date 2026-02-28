import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick, highlightFill, highlightSelect } from '../../lib/test-helpers';

interface SearchCondition {
  name: string;
  arrival_s_dt?: string;
  arrival_e_dt?: string;
  customer_name?: string;
  tank?: string;
  goods_name?: string;
  outgoing_warehouse?: string;
}

const LOCATORS = {
  searchButton: '#wpbody-content input[value="検索"]',
  arrivalStartDate: 'input[name="s[arrival_s_dt]"]',
  arrivalEndDate: 'input[name="s[arrival_e_dt]"]',
  customerNameInput: 'input[name="s[customer_name]"]',
  tankInput: 'input[name="s[tank]"]',
  goodsNameInput: 'input[name="s[goods_name]"]',
  warehouseSelect: 'select[name="s[outgoing_warehouse]"]',
} as const;

const SEARCH_PATTERNS: SearchCondition[] = [
  { name: '条件なし' },
  { name: '入庫日のみ', arrival_s_dt: '2024-01-01', arrival_e_dt: '2025-12-31' },
  { name: '顧客名テキスト入力', customer_name: 'テスト顧客' },
  { name: 'タンクテキスト入力', tank: 'タンクA' },
  { name: '商品名テキスト入力', goods_name: 'テスト商品' },
  { name: '出庫倉庫のみ', outgoing_warehouse: '1' },
  {
    name: '全条件指定',
    arrival_s_dt: '2024-01-01', arrival_e_dt: '2025-12-31',
    customer_name: 'テスト', tank: 'タンク', goods_name: 'テスト',
    outgoing_warehouse: '1',
  },
];

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-receive`;

async function executeSearch(page: Page, condition: SearchCondition): Promise<void> {
  await page.goto(PAGE_URL);
  await assertPageLoaded(page);
  await showTestTitle(page, `検索: ${condition.name}`);

  if (condition.arrival_s_dt) await highlightFill(page, page.locator(LOCATORS.arrivalStartDate), condition.arrival_s_dt, '入庫開始日を入力');
  if (condition.arrival_e_dt) await highlightFill(page, page.locator(LOCATORS.arrivalEndDate), condition.arrival_e_dt, '入庫終了日を入力');
  if (condition.customer_name) await highlightFill(page, page.locator(LOCATORS.customerNameInput), condition.customer_name, '顧客名を入力');
  if (condition.tank) await highlightFill(page, page.locator(LOCATORS.tankInput), condition.tank, 'タンクを入力');
  if (condition.goods_name) await highlightFill(page, page.locator(LOCATORS.goodsNameInput), condition.goods_name, '商品名を入力');
  if (condition.outgoing_warehouse) await highlightSelect(page, page.locator(LOCATORS.warehouseSelect), condition.outgoing_warehouse, '出庫倉庫を選択');

  await wait(page);
  await highlightClick(page, page.locator(LOCATORS.searchButton).first(), '検索ボタンをクリック');
  await wait(page);
  await assertPageLoaded(page);
}

test.describe('入庫予定日検索画面', () => {

  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示: 検索フォーム全要素の確認');
    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalStartDate)).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalEndDate)).toBeVisible();
    await expect(page.locator(LOCATORS.customerNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.tankInput)).toBeVisible();
    await expect(page.locator(LOCATORS.goodsNameInput)).toBeVisible();
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

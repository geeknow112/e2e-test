import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

// --- 型定義 ---
interface SearchCondition {
  name: string;
  no?: string;
  customer_name?: string;
  goods_name?: string;
  ship_addr?: string;
  lot?: string;
  car_model?: string;
  status?: string;
  outgoing_warehouse?: string;
  delivery_s_dt?: string;
  delivery_e_dt?: string;
  arrival_s_dt?: string;
  arrival_e_dt?: string;
}

// --- ロケーター定数 ---
const LOCATORS = {
  searchButton: '#wpbody-content input[value="検索"]',
  noInput: 'input[name="s[no]"]',
  customerNameInput: 'input[name="s[customer_name]"]',
  goodsNameInput: 'input[name="s[goods_name]"]',
  shipAddrInput: 'input[name="s[ship_addr]"]',
  lotInput: 'input[name="s[lot]"]',
  carModelSelect: 'select[name="s[car_model]"]',
  statusSelect: 'select[name="s[status]"]',
  warehouseSelect: 'select[name="s[outgoing_warehouse]"]',
  deliveryStartDate: 'input[name="s[delivery_s_dt]"]',
  deliveryEndDate: 'input[name="s[delivery_e_dt]"]',
  arrivalStartDate: 'input[name="s[arrival_s_dt]"]',
  arrivalEndDate: 'input[name="s[arrival_e_dt]"]',
  detailLink: '#wpbody-content a[href*="page=sales-detail"]',
  paginationPage2: '#wpbody-content a[href*="paged=2"]',
} as const;

// --- 検索条件パターン（10パターン） ---
const SEARCH_PATTERNS: SearchCondition[] = [
  { name: '条件なし' },
  { name: '車種のみ（6t-1）', car_model: '2' },
  { name: 'ステータスのみ（確定）', status: '1' },
  { name: 'ステータスのみ（未確定）', status: '0' },
  { name: '出庫倉庫のみ（内藤SP）', outgoing_warehouse: '1' },
  { name: '配送日のみ', delivery_s_dt: '2024-01-01', delivery_e_dt: '2025-12-31' },
  { name: '入庫日のみ', arrival_s_dt: '2024-01-01', arrival_e_dt: '2025-12-31' },
  { name: '注文番号テキスト入力', no: '1' },
  { name: '顧客名テキスト入力', customer_name: 'テスト顧客' },
  { name: '商品名テキスト入力', goods_name: 'テスト商品' },
  { name: '配送先テキスト入力', ship_addr: 'テスト配送先' },
  { name: 'ロットテキスト入力', lot: 'LOT001' },
  { name: '車種＋ステータス', car_model: '3', status: '1' },
  { name: '倉庫＋配送日', outgoing_warehouse: '2', delivery_s_dt: '2024-06-01', delivery_e_dt: '2025-06-30' },
  {
    name: '全条件指定',
    no: '1', customer_name: 'テスト', goods_name: 'テスト', ship_addr: 'テスト', lot: 'LOT',
    car_model: '2', status: '0', outgoing_warehouse: '1',
    delivery_s_dt: '2024-01-01', delivery_e_dt: '2025-12-31',
    arrival_s_dt: '2024-01-01', arrival_e_dt: '2025-12-31',
  },
];

// --- URL定数 ---
const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=sales-list`;

// --- 検索実行ヘルパー関数 ---
async function executeSearch(page: Page, condition: SearchCondition): Promise<void> {
  await page.goto(PAGE_URL);
  await assertPageLoaded(page);

  // テキスト入力の設定
  if (condition.no) {
    await page.locator(LOCATORS.noInput).fill(condition.no);
  }
  if (condition.customer_name) {
    await page.locator(LOCATORS.customerNameInput).fill(condition.customer_name);
  }
  if (condition.goods_name) {
    await page.locator(LOCATORS.goodsNameInput).fill(condition.goods_name);
  }
  if (condition.ship_addr) {
    await page.locator(LOCATORS.shipAddrInput).fill(condition.ship_addr);
  }
  if (condition.lot) {
    await page.locator(LOCATORS.lotInput).fill(condition.lot);
  }

  // セレクトボックスの設定
  if (condition.car_model) {
    await page.locator(LOCATORS.carModelSelect).selectOption(condition.car_model);
  }
  if (condition.status) {
    await page.locator(LOCATORS.statusSelect).selectOption(condition.status);
  }
  if (condition.outgoing_warehouse) {
    await page.locator(LOCATORS.warehouseSelect).selectOption(condition.outgoing_warehouse);
  }

  // 日付入力の設定
  if (condition.delivery_s_dt) {
    await page.locator(LOCATORS.deliveryStartDate).fill(condition.delivery_s_dt);
  }
  if (condition.delivery_e_dt) {
    await page.locator(LOCATORS.deliveryEndDate).fill(condition.delivery_e_dt);
  }
  if (condition.arrival_s_dt) {
    await page.locator(LOCATORS.arrivalStartDate).fill(condition.arrival_s_dt);
  }
  if (condition.arrival_e_dt) {
    await page.locator(LOCATORS.arrivalEndDate).fill(condition.arrival_e_dt);
  }

  await wait(page);
  await page.locator(LOCATORS.searchButton).first().click();
  await wait(page);
  await assertPageLoaded(page);
}

// --- テストケース ---
test.describe('注文検索画面', () => {

  // 要件1: 画面初期表示
  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.noInput)).toBeVisible();
    await expect(page.locator(LOCATORS.customerNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.goodsNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.shipAddrInput)).toBeVisible();
    await expect(page.locator(LOCATORS.lotInput)).toBeVisible();
    await expect(page.locator(LOCATORS.carModelSelect)).toBeVisible();
    await expect(page.locator(LOCATORS.statusSelect)).toBeVisible();
    await expect(page.locator(LOCATORS.warehouseSelect)).toBeVisible();
    await expect(page.locator(LOCATORS.deliveryStartDate)).toBeVisible();
    await expect(page.locator(LOCATORS.deliveryEndDate)).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalStartDate)).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalEndDate)).toBeVisible();
    await wait(page);
  });

  // 要件2・3: 検索条件テスト（データ駆動、1テスト内で連続実行）
  test('各検索条件パターンで検索し結果が正常に表示される', async ({ page }) => {
    test.setTimeout(300000);

    for (const pattern of SEARCH_PATTERNS) {
      await executeSearch(page, pattern);
    }
  });

  // 要件4: リスト内リンク遷移（全種別を1行目で確認）
  test('リスト内の各リンク種別をクリックして遷移確認する', async ({ page }) => {
    test.setTimeout(120000);

    const linkTypes = [
      { name: '注文詳細', selector: '#wpbody-content a[href*="page=sales-detail"]', urlPattern: /page=sales-detail/ },
      { name: '顧客詳細', selector: '#wpbody-content a[href*="page=customer-detail"]', urlPattern: /page=customer-detail/ },
      { name: '商品詳細', selector: '#wpbody-content a[href*="page=goods-detail"]', urlPattern: /page=goods-detail/ },
      { name: 'ロット登録', selector: '#wpbody-content a[href*="page=lot-regist"]', urlPattern: /page=lot-regist/ },
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

  // 要件5: ページネーション
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

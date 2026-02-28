import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick, highlightFill, highlightSelect } from '../../lib/test-helpers';

interface SearchCondition {
  name: string;
  delivery_s_dt?: string;
  outgoing_warehouse?: string;
}

const LOCATORS = {
  searchButton: '#wpbody-content input[value="検索"]',
  deliveryStartDate: 'input[name="s[delivery_s_dt]"]',
  warehouseSelect: 'select[name="s[outgoing_warehouse]"]',
} as const;

const SEARCH_PATTERNS: SearchCondition[] = [
  { name: '条件なし' },
  { name: '配送日のみ', delivery_s_dt: '2024-01-01' },
  { name: '出庫倉庫のみ', outgoing_warehouse: '1' },
  { name: '全条件指定', delivery_s_dt: '2024-01-01', outgoing_warehouse: '1' },
];

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-export-day`;

async function executeSearch(page: Page, condition: SearchCondition): Promise<void> {
  await page.goto(PAGE_URL);
  await assertPageLoaded(page);
  await showTestTitle(page, `検索: ${condition.name}`);

  if (condition.delivery_s_dt) await highlightFill(page, page.locator(LOCATORS.deliveryStartDate), condition.delivery_s_dt, '配送日を入力');
  if (condition.outgoing_warehouse) await highlightSelect(page, page.locator(LOCATORS.warehouseSelect), condition.outgoing_warehouse, '出庫倉庫を選択');

  await wait(page);
  await highlightClick(page, page.locator(LOCATORS.searchButton).first(), '検索ボタンをクリック');
  await wait(page);
  await assertPageLoaded(page);
}

test.describe('在庫出力日別画面', () => {

  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示: 検索フォーム全要素の確認');
    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.deliveryStartDate)).toBeVisible();
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

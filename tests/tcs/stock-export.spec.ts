import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait } from '../../lib/test-helpers';

interface SearchCondition {
  name: string;
  arrival_e_dt?: string;
  outgoing_warehouse?: string;
}

const LOCATORS = {
  searchButton: '#wpbody-content input[value="検索"]',
  arrivalEndDate: 'input[name="s[arrival_e_dt]"]',
  warehouseSelect: 'select[name="s[outgoing_warehouse]"]',
  dispButton: '#wpbody-content input[value=" 表示 "]',
  hideButton: '#wpbody-content input[value="非表示"]',
} as const;

const SEARCH_PATTERNS: SearchCondition[] = [
  { name: '条件なし' },
  { name: '入庫日のみ', arrival_e_dt: '2025-12-31' },
  { name: '出庫倉庫のみ', outgoing_warehouse: '1' },
  { name: '全条件指定', arrival_e_dt: '2025-12-31', outgoing_warehouse: '1' },
];

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=stock-export`;

async function executeSearch(page: Page, condition: SearchCondition): Promise<void> {
  await page.goto(PAGE_URL);
  await assertPageLoaded(page);

  if (condition.arrival_e_dt) await page.locator(LOCATORS.arrivalEndDate).fill(condition.arrival_e_dt);
  if (condition.outgoing_warehouse) await page.locator(LOCATORS.warehouseSelect).selectOption(condition.outgoing_warehouse);

  await wait(page);
  await page.locator(LOCATORS.searchButton).first().click();
  await wait(page);
  await assertPageLoaded(page);
}

test.describe('在庫出力画面', () => {

  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.arrivalEndDate)).toBeVisible();
    await expect(page.locator(LOCATORS.warehouseSelect)).toBeVisible();
    await expect(page.locator(LOCATORS.dispButton)).toBeVisible();
    await expect(page.locator(LOCATORS.hideButton)).toBeVisible();
    await wait(page);
  });

  test('各検索条件パターンで検索し結果が正常に表示される', async ({ page }) => {
    test.setTimeout(300000);
    for (const pattern of SEARCH_PATTERNS) {
      await executeSearch(page, pattern);
    }
  });

  test('表示・非表示ボタンをクリックしてエラーが発生しない', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);

    await page.locator(LOCATORS.dispButton).click();
    await wait(page);
    await assertPageLoaded(page);

    await page.locator(LOCATORS.hideButton).click();
    await wait(page);
    await assertPageLoaded(page);
  });
});

import { test, expect, Page } from '@playwright/test';
import { assertPageLoaded, wait, showTestTitle, showTestResult, highlightClick, highlightFill } from '../../lib/test-helpers';

interface SearchCondition {
  name: string;
  no?: string;
  goods_name?: string;
  qty?: string;
}

const LOCATORS = {
  searchButton: '#wpbody-content input[value="検索"]',
  noInput: 'input[name="s[no]"]',
  goodsNameInput: 'input[name="s[goods_name]"]',
  qtyInput: 'input[name="s[qty]"]',
  detailLink: '#wpbody-content a[href*="page=goods-detail"]',
  paginationPage2: '#wpbody-content a[href*="paged=2"]',
} as const;

const SEARCH_PATTERNS: SearchCondition[] = [
  { name: '条件なし' },
  { name: '商品番号テキスト入力', no: '1' },
  { name: '商品名テキスト入力', goods_name: 'テスト商品' },
  { name: '数量テキスト入力', qty: '2' },
  { name: '全条件指定', no: '1', goods_name: 'テスト', qty: '1' },
];

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=goods-list`;

async function executeSearch(page: Page, condition: SearchCondition): Promise<void> {
  await page.goto(PAGE_URL);
  await assertPageLoaded(page);
  await showTestTitle(page, `検索: ${condition.name}`);

  if (condition.no) await highlightFill(page, page.locator(LOCATORS.noInput), condition.no, '商品番号を入力');
  if (condition.goods_name) await highlightFill(page, page.locator(LOCATORS.goodsNameInput), condition.goods_name, '商品名を入力');
  if (condition.qty) await highlightFill(page, page.locator(LOCATORS.qtyInput), condition.qty, '数量を入力');

  await wait(page);
  await highlightClick(page, page.locator(LOCATORS.searchButton).first(), '検索ボタンをクリック');
  await wait(page);
  await assertPageLoaded(page);
}

test.describe('商品検索画面', () => {

  test('画面が正常に表示され検索フォームの全要素が存在する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, '画面初期表示: 検索フォーム全要素の確認');
    await expect(page.locator(LOCATORS.searchButton).first()).toBeVisible();
    await expect(page.locator(LOCATORS.noInput)).toBeVisible();
    await expect(page.locator(LOCATORS.goodsNameInput)).toBeVisible();
    await expect(page.locator(LOCATORS.qtyInput)).toBeVisible();
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

  test('リスト内の商品詳細リンクをクリックして遷移確認する', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
    await showTestTitle(page, 'リンク遷移: 商品詳細');
    const link = page.locator(LOCATORS.detailLink).first();
    if (await link.isVisible()) {
      await highlightClick(page, link, '商品詳細リンクをクリック');
      await wait(page);
      await page.waitForURL(/page=goods-detail/, { timeout: 10000 });
      await assertPageLoaded(page);
      await showTestResult(page, true);
    } else {
      test.skip(true, '商品詳細リンクが存在しない');
    }
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

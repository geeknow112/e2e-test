import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL!;
const STOCK_URL = `${baseUrl}/wp-admin/admin.php?page=stock-management`;

const buttons = [
  { name: '商品登録', urlPattern: /page=goods-detail/ },
  { name: '顧客登録', urlPattern: /page=customer-detail/ },
  { name: '注文登録', urlPattern: /page=sales-detail/ },
  { name: '商品検索', urlPattern: /page=goods-list/ },
  { name: '顧客検索', urlPattern: /page=customer-list/ },
  { name: '注文検索', urlPattern: /page=sales-list/ },
];

test.describe('在庫管理画面', () => {
  for (const { name, urlPattern } of buttons) {
    test(`「${name}」ボタンをクリックして正常に遷移する`, async ({ page }) => {
      await page.goto(STOCK_URL);
      await expect(page.locator('#wpbody-content')).toBeVisible();

      const btn = page.locator('#wpbody-content').getByRole('button', { name });
      await expect(btn).toBeVisible();
      await btn.click();

      await page.waitForURL(urlPattern, { timeout: 10000 });

      await expect(page.locator('#wpadminbar')).toBeVisible();
      const body = await page.locator('body').textContent();
      expect(body).not.toContain('Fatal error');
      expect(body).not.toContain('Not Found');
    });
  }
});

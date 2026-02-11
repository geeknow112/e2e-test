import { test } from '@playwright/test';
import { assertPageLoaded } from '../../lib/test-helpers';

const baseUrl = process.env.BASE_URL!;
const PAGE_URL = `${baseUrl}/wp-admin/admin.php?page=customer-detail`;

test.describe('顧客登録画面', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto(PAGE_URL);
    await assertPageLoaded(page);
  });
});

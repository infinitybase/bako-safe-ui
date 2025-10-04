import { expect, hasText } from '@fuels/playwright-utils';
import test from '@playwright/test';

import { txFilters } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';

test.describe.parallel('home page webAuth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page navegation', async ({ page }) => {
    await AuthTestService.loginAuth(page);

    await hasText(page, /Welcome to Bako Safe!/);
    await page.locator('[aria-label="Close window"]').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    // Navega pelos Vaults
    await page.getByTestId('vaultstab').click();
    await expect(page).toHaveURL(/vault/);
    await page.getByRole('button', { name: 'Back home' }).click();
    await expect(page).toHaveURL(/home/);
    await page.getByTestId('vaultstab').click();
    await expect(page).toHaveURL(/vault/);

    //await backHome(page, 'Vaults')
    //Testar breadcrumbs - ajuda nos seletores

    //Acessa Transactions
    await page.getByText('Transactions', { exact: true }).click();
    await expect(page).toHaveURL(/transaction/);
    await txFilters(page);

    // Navega pela Address Book
    await page.getByText('Address book', { exact: true }).click();
    await expect(page).toHaveURL(/address-book/);

    await page.getByRole('button', { name: 'Back home' }).click();
    await expect(page).toHaveURL(/home/);
    await page.getByText('Address book', { exact: true }).click();
  });
});

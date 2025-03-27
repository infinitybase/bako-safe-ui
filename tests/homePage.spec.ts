import { expect, hasText, test } from '@fuels/playwright-utils';

import { mockRouteAssets, txFilters } from './utils/helpers';
import { AuthTestService } from './utils/services/auth-service';
import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test('webauthn', async ({ page }) => {
  await mockRouteAssets(page);
  await AuthTestService.loginAuth(page);

  await hasText(page, /Welcome to Bako Safe!/);
  await page.locator('[aria-label="Close window"]').click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page).toHaveURL(/home/);

  //Criar 10 vaults
  //await createVaults(page, 'vaulteste')

  // Navega pelos Vaults
  await page.getByTestId('vaultstab').click();
  await expect(page).toHaveURL(/vault/);
  await page.getByRole('button', { name: 'Back home' }).click();
  await expect(page).toHaveURL(/home/);
  await page.getByTestId('vaultstab').click();
  await expect(page).toHaveURL(/vault/);

  //await backHome(page, 'Vaults')
  //Testar breadcrumbs - ajuda nos seletore

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

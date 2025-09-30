import {
  expect,
  FuelWalletTestHelper,
  hasText,
  test,
} from '@fuels/playwright-utils';

import { txFilters } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';
import { E2ETestUtils } from '../utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('home page fuel wallet', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;

  test.beforeEach(async ({ page, context, extensionId }) => {
    const E2EUtils = await E2ETestUtils.setupFuelWallet({
      page,
      context,
      extensionId,
    });

    fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
    await page.goto('/');
  });

  test('home page navegation', async ({ page }) => {
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);

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

import {
  FuelWalletTestHelper,
  getByAriaLabel,
  hasText,
  test,
} from '@fuels/playwright-utils';
import { expect } from '@playwright/test';

import { E2ETestUtils } from '../utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('create account  login fuel wallet', () => {
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

  test('example fuel wallet', async ({ page }) => {
    await page.getByRole('heading', { name: 'Fuel Wallet' }).click();

    await fuelWalletTestHelper.walletConnect();

    await E2ETestUtils.signMessageFuelWallet({
      page,
      fuelWalletTestHelper,
    });

    await hasText(page, /Welcome to Bako Safe!/);

    await getByAriaLabel(page, 'Close window').click();

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);
  });
});

import {
  FuelWalletTestHelper,
  getByAriaLabel,
  hasText,
  test,
} from '@fuels/playwright-utils';
import { expect } from '@playwright/test';

import { AuthTestService } from './utils/services/auth-service';
import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('create account and login', () => {
  test('loginWebAuth', async ({ page }) => {
    const { username } = await AuthTestService.loginAuth(page);

    await hasText(page, /Welcome to Bako Safe!/);

    await getByAriaLabel(page, 'Close window').click();

    await page.goto('/home');

    await getByAriaLabel(page, 'Dropdown header').click();
    await expect(page.getByText('Disconnect')).toBeVisible();

    await getByAriaLabel(page, 'Disconnect').click();
    const welcomeText = page.locator('text=Welcome to Bako Safe');
    await expect(welcomeText).toBeVisible();

    await getByAriaLabel(page, 'Username').clear();
    await getByAriaLabel(page, 'Username').fill(username);
    await page.locator('body').click();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(300);

    await getByAriaLabel(page, 'Close window').click();

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);
  });

  test('example fuel wallet', async ({ page, context, extensionId }) => {
    let fuelWalletTestHelper!: FuelWalletTestHelper;
    await test.step('', async () => {
      const E2EUtils = await E2ETestUtils.setupFuelWallet({
        page,
        context,
        extensionId,
      });

      fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
    });

    await page.goto('/');

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

import { expect, FuelWalletTestHelper, test } from '@fuels/playwright-utils';
import { WalletUnlocked } from 'fuels';

import { AuthTestService } from '../utils/services/auth-service';
import { TransactionTestService } from '../utils/services/transaction-service';
import { VaultTestService } from '../utils/services/vault-service';
import { E2ETestUtils } from '../utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('swap fuel wallet', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let genesisWallet: WalletUnlocked;

  test.beforeEach(async ({ page, context, extensionId }) => {
    const E2EUtils = await E2ETestUtils.setupFuelWallet({
      page,
      context,
      extensionId,
    });

    fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
    genesisWallet = E2EUtils.genesisWallet;

    await page.goto('/');
  });

  test('Swap with amount higher than balance', async ({ page }) => {
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    const { vaultAddress } = await VaultTestService.createVault(page);
    await VaultTestService.addFundVault(page, vaultAddress, genesisWallet);

    await page.locator('#swap_tab_sidebar').click();
    await page.getByRole('textbox', { name: 'ETH' }).fill('55,5555');
    await expect(
      page.getByRole('button', { name: 'Insufficient Balance' }),
    ).toBeVisible();

    await TransactionTestService.returnFundsToGenesisWalletWithFuelWallet(
      page,
      genesisWallet,
      fuelWalletTestHelper,
    );
  });

  test.fixme('Swap with minimum amount', async ({ page }) => {
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    const { vaultAddress } = await VaultTestService.createVault(page);
    await VaultTestService.addFundVault(page, vaultAddress, genesisWallet);

    await page.locator('#swap_tab_sidebar').click();
  });

  test('Search asset', async ({ page }) => {
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    await VaultTestService.createVault(page);

    await page.locator('#swap_tab_sidebar').click();

    await test.step('switch button', async () => {
      await expect(page.getByText('SellEthereumBalance: 0 ETH')).toBeVisible();
      await expect(page.getByText('BuyFuelBalance: 0 FUEL')).toBeVisible();

      await page.getByRole('button', { name: 'Invert Assets' }).click();

      await expect(page.getByText('SellFuelBalance: 0 FUEL')).toBeVisible();
      await expect(page.getByText('BuyEthereumBalance: 0 ETH')).toBeVisible();

      await page.getByRole('button', { name: 'Invert Assets' }).click();

      await expect(page.getByText('SellEthereumBalance: 0 ETH')).toBeVisible();
      await expect(page.getByText('BuyFuelBalance: 0 FUEL')).toBeVisible();
    });

    await test.step('list main assets and select', async () => {
      await page.getByText('Ethereum').click();

      await expect(
        page.getByRole('listitem').filter({ hasText: 'FUELFuel' }),
      ).toBeVisible();
      await expect(
        page.getByRole('listitem').filter({ hasText: 'ETHEthereum' }),
      ).toBeVisible();
      await expect(
        page.getByRole('listitem').filter({ hasText: 'USDCUSDC' }),
      ).toBeVisible();

      await page.getByRole('textbox', { name: 'Search asset' }).click();
      await page.getByRole('textbox', { name: 'Search asset' }).fill('USDC');
      await page.getByRole('listitem').filter({ hasText: 'USDCUSDC' }).click();
      await expect(page.getByText('SellUSDCBalance: 0 USDC')).toBeVisible();

      await page.getByText('Fuel', { exact: true }).first().click();
      await page.getByRole('textbox', { name: 'Search asset' }).click();
      await page.getByRole('textbox', { name: 'Search asset' }).fill('ETH');
      await expect(
        page.getByRole('listitem').filter({ hasText: 'ETHEthereum' }),
      ).toBeVisible();
      await page.getByRole('textbox', { name: 'Search asset' }).clear();
      await page
        .getByRole('textbox', { name: 'Search asset' })
        .fill('Ethereum');
      await page
        .getByRole('listitem')
        .filter({ hasText: 'ETHEthereum' })
        .click();
      await expect(page.getByText('BuyEthereumBalance: 0 ETH')).toBeVisible();
    });
  });
});

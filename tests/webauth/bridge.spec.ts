import test, { expect } from '@playwright/test';

import { selectNetwork, TestAssets } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';
import { VaultTestService } from '../utils/services/vault-service';

test.describe.parallel('bridge webauth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('bridge ETH', async ({ page }) => {
    const { genesisWallet } = await AuthTestService.loginAuth(page);
    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    await selectNetwork(page);

    const { vaultAddress } = await VaultTestService.createVault(page);
    await VaultTestService.addFundVault(
      page,
      vaultAddress,
      genesisWallet,
      true,
      TestAssets.ETH,
      '0.00008',
    );

    await page
      .locator('div')
      .filter({ hasText: /^Bridge$/ })
      .first()
      .click();

    await page.getByRole('combobox', { name: 'Asset', exact: true }).click();
    await page.getByRole('option', { name: 'ETH ETH' }).click();
    await page.getByLabel('Select a network').click();
    await page
      .locator('div')
      .filter({ hasText: /^Ethereum Sepolia$/ })
      .nth(1)
      .click();
    await page
      .getByRole('group')
      .filter({ hasText: 'Asset' })
      .getByLabel('Select an asset')
      .click();
    await page.getByText('Ethereum', { exact: true }).click();
    await page.getByRole('button', { name: 'MIN' }).click();

    await expect(page.getByText('Fee', { exact: true })).toBeVisible();
    await expect(page.getByText('Destination address')).toBeVisible();

    await page
      .getByRole('textbox', { name: 'Enter address' })
      .fill('0xccC71b6d11198f161187C8eCC291714ca5e9f6fE');

    await page.getByRole('button', { name: 'Continue to resume' }).click();

    await expect(page.getByText('Resume')).toBeVisible();
    await page.getByRole('button', { name: 'Bridge' }).click();
  });
});

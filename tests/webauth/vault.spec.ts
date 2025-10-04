import { expect, getByAriaLabel, hasText } from '@fuels/playwright-utils';
import test from '@playwright/test';

import { mockRouteAssets, selectNetwork } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';
import { VaultTestService } from '../utils/services/vault-service';
import { E2ETestUtils } from '../utils/setup';

test.describe.parallel('vaults webauth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('create vault 1/1', async ({ page }) => {
    await mockRouteAssets(page);
    const { genesisWallet } = await AuthTestService.loginAuth(page);

    await hasText(page, /Welcome to Bako Safe!/);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);

    await page.locator('#vault_name').fill('vaultName');
    await expect(page.getByText('This vault is available')).toBeVisible();
    await page.locator('#vault_name').clear();
    await page.locator('#vault_name').fill('Personal vault');
    await expect(
      page.getByText('Vault name already exists in this workspace'),
    ).toBeVisible();
    await page.locator('#vault_name').clear();

    await page.goto('/home');
    const { vaultAddress } = await VaultTestService.createVault(page);

    await expect(page).toHaveURL(/workspace/);

    await test.step('verify balance', async () => {
      await selectNetwork(page);

      const amount = '0.00001';

      await E2ETestUtils.fundVault({
        genesisWallet,
        vaultAddress,
        amount,
      });

      await page.reload();
      await page
        .getByRole('paragraph')
        .filter({ hasText: 'Update' })
        .getByRole('img')
        .first()
        .click();
      await page.locator('.chakra-icon.css-bokek7').click();

      await expect(page.getByRole('heading', { name: 'USD' })).toBeVisible();
      await expect(page.getByText(`${amount} ETH`)).toBeVisible();
    });
  });

  test('create vault 2/2', async ({ page }) => {
    await mockRouteAssets(page);
    const adr2 =
      '0x5cD19FF270Db082663993D3D9cF6342f9869491AfB06F6DC885B1794DB261fCB';

    const { genesisWallet } = await AuthTestService.loginAuth(page);
    await hasText(page, /Welcome to Bako Safe!/);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);
    await page.locator('#vault_name').fill('vaultName2');

    await getByAriaLabel(page, 'Create Vault Primary Action').click();
    await page.waitForTimeout(500);

    await page.getByText('Add more addresses').click();

    await test.step('wrong and empty address', async () => {
      await expect(page.getByText('Empty address')).toBeVisible();

      await page.locator('#Address\\ 2').fill('invalid address');
      await expect(page.getByText('Invalid address')).toBeVisible();

      await page.locator('#Address\\ 2').clear();
    });

    await page.goto('/home');
    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [adr2],
      2,
    );

    await test.step('verify balance', async () => {
      await selectNetwork(page);

      const amount = '0.00001';

      await E2ETestUtils.fundVault({
        genesisWallet,
        vaultAddress,
        amount,
      });

      await page.reload();
      await page
        .getByRole('paragraph')
        .filter({ hasText: 'Update' })
        .getByRole('img')
        .first()
        .click();
      await page.locator('.chakra-icon.css-bokek7').click();

      await expect(page.getByRole('heading', { name: 'USD' })).toBeVisible();
      await expect(page.getByText(`${amount} ETH`)).toBeVisible();
    });
  });
});

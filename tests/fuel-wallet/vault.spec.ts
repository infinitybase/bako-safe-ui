import {
  expect,
  FuelWalletTestHelper,
  getByAriaLabel,
  hasText,
  test,
} from '@fuels/playwright-utils';
import { WalletUnlocked } from 'fuels';

import {
  mockRouteAssets,
  mockRouteBakoAddr,
  mockRouteBakoName,
} from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';
import { E2ETestUtils } from '../utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('vaults fuel wallet', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let genesisWallet: WalletUnlocked;

  test.beforeEach(async ({ extensionId, context, page }) => {
    await mockRouteAssets(page);

    const E2EUtils = await E2ETestUtils.setupFuelWallet({
      page,
      context,
      extensionId,
    });

    fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
    genesisWallet = E2EUtils.genesisWallet;

    await page.goto('/');
  });

  test('create vault 1/1', async ({ page }) => {
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    await mockRouteAssets(page);

    // Check if the user is logged in and go to Home page
    await hasText(page, /Welcome to Bako Safe!/);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    // create vault 1/1
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
    await expect(page.getByText('Name is required')).toBeVisible();
    await page.locator('#vault_name').fill('vaultName');

    await page.locator('#vault_description').fill('vaultDescription');

    await getByAriaLabel(page, 'Create Vault Primary Action').click();

    await getByAriaLabel(page, 'Create Vault Primary Action').click();

    await page.locator('.loading-spinner').waitFor({ state: 'hidden' });

    await getByAriaLabel(page, 'Create Vault Secundary Action').click();
    await page.waitForTimeout(300);

    const hasClose = page.locator('[aria-label="Close window"]');
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }
    await page
      .locator('div')
      .filter({
        hasText: /^VaultsAccess and Manage All Your Vaults in One Place\.$/,
      })
      .first()
      .click();

    await expect(page.getByText('vaultName')).toBeVisible();
    await expect(page).toHaveURL(/workspace/);

    await test.step('verify balance', async () => {
      await page.getByText('vaultName').click();
      await page.waitForTimeout(500);
      if (await hasClose.isVisible()) {
        await hasClose.click();
      }

      await getByAriaLabel(page, 'Sidebar Vault Address').click();
      await page.waitForTimeout(500);
      const handleAddress = await page.evaluateHandle(() =>
        navigator.clipboard.readText(),
      );

      const vaultAddress = await handleAddress.jsonValue();
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
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    await mockRouteAssets(page);
    const adr2 =
      '0x5cD19FF270Db082663993D3D9cF6342f9869491AfB06F6DC885B1794DB261fCB';

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
    await page.locator('#Address\\ 2').fill(adr2); //endereço meta mask

    await page
      .getByRole('textbox', { name: 'Select min signatures vault form' })
      .click({ force: true });

    await page.waitForTimeout(500);
    await page.getByText('2', { exact: true }).click();
    await page.waitForTimeout(200);

    await getByAriaLabel(page, 'Create Vault Primary Action').click({
      timeout: 8000,
    });
    await page.waitForTimeout(2000);
    await page.locator('.loading-spinner').waitFor({ state: 'hidden' });

    await getByAriaLabel(page, 'Create Vault Secundary Action').click();
    await page.waitForTimeout(1000);

    const hasClose = page.locator('[aria-label="Close window"]');
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }

    const vaultsTitle = page.getByText('vaultName2');
    const number = await vaultsTitle.count();
    expect(number).toBe(3);
    for (let i = 0; i < number; i++) {
      await expect(vaultsTitle.nth(i)).toBeVisible();
    }

    await test.step('verify balance', async () => {
      await page.waitForTimeout(500);
      if (await hasClose.isVisible()) {
        await hasClose.click();
      }

      await getByAriaLabel(page, 'Sidebar Vault Address').click();
      await page.waitForTimeout(500);
      const handleAddress = await page.evaluateHandle(() =>
        navigator.clipboard.readText(),
      );

      const vaultAddress = await handleAddress.jsonValue();
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

  test('Should prevent adding vault addresses or handles as signers when creating multisig vault', async ({
    page,
  }) => {
    await test.step('Navigate to Bako Safe and start vault creation', async () => {
      await page.goto('/');
      await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
      await mockRouteAssets(page);

      await hasText(page, /Welcome to Bako Safe!/);

      await page.locator('[aria-label="Close window"]').click();
      await expect(page.getByText('Personal Vault').first()).toBeVisible();
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Sidebar Vault Address' }).click();
      const handleAddress = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );

      await page.getByRole('button', { name: 'Home' }).click();
      await expect(page).toHaveURL(/home/);

      await page.getByRole('button', { name: 'Create vault' }).click();
      await page.waitForTimeout(1000);
      await page.locator('#vault_name').fill('vaultName2');

      await getByAriaLabel(page, 'Create Vault Primary Action').click();
      await page.waitForTimeout(500);

      await page.getByText('Add more addresses').click();

      await test.step('Attempt to add raw vault address as signer (should be blocked)', async () => {
        await expect(page.getByText('Empty address')).toBeVisible();

        await page.locator('#Address\\ 2').fill(handleAddress);
        await mockRouteBakoName(page);

        await expect(
          page.getByText('You cannot add a vault as a signer'),
        ).toBeVisible();

        await page.locator('#Address\\ 2').clear();
        await expect(
          page.getByText('You cannot add a vault as a signer'),
        ).not.toBeVisible();
      });

      await test.step('Attempt to add vault handle as signer (should be blocked)', async () => {
        await page.locator('#Address\\ 2').fill(`@mockedHandle`);
        await mockRouteBakoAddr(page, handleAddress);

        await expect(
          page.getByText('You cannot add a vault as a signer'),
        ).toBeVisible();
      });
    });
  });
});

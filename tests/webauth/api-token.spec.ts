import { expect, getByAriaLabel } from '@fuels/playwright-utils';
import test from '@playwright/test';
import { BakoProvider, Vault } from 'bakosafe';
import { Address } from 'fuels';

import { disconnect, selectNetwork } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';
import { VaultTestService } from '../utils/services/vault-service';
import { E2ETestUtils } from '../utils/setup';

test.describe.parallel('API Token WebAuth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test.afterEach(async ({ page }) => {
    await page.pause();
  });

  test('tx using api token', async ({ page }) => {
    const apiTokenName = 'key1';
    const txNameApiToken = 'tx1';
    const txName = 'Deposit by apy token';

    const { genesisWallet } = await AuthTestService.loginAuth(page);

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });
    await page.locator('[aria-label="Close window"]').click();

    await selectNetwork(page);

    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Sidebar Vault Address' }).click();
    await page.waitForTimeout(1000);
    const vaultAddressUI = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );

    await page.locator('#settings_tab_sidebar').click();
    expect(page.getByLabel('API Token').locator('div')).toBeVisible();

    await test.step('create and delet api token', async () => {
      await page.getByLabel('API Token').locator('div').click();
      expect(
        page.getByRole('heading', { name: 'Create new API Tokens' }),
      ).toBeVisible();

      await getByAriaLabel(page, 'Input key name api token').fill(apiTokenName);
      await getByAriaLabel(page, 'Input tx api token').fill(txNameApiToken);

      await getByAriaLabel(page, 'Primary action create api token').click();
      await page.waitForTimeout(1000);
      await expect(
        page.getByRole('tabpanel').getByText('API Token created!'),
      ).toBeVisible();
      await page.waitForTimeout(300);
      await getByAriaLabel(page, 'Secundary action create api token').click();
      await page.waitForTimeout(300);

      await page.getByLabel('API Token').locator('div').click();
      expect(page.getByText('Add more api tokens')).toBeVisible();
      expect(page.getByText(apiTokenName, { exact: true })).toBeVisible();
      await page.getByTestId('delete-api-token').click();
      await page.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(300);
      await expect(
        page.getByRole('heading', { name: 'No Data available' }),
      ).toBeVisible();
      await page
        .getByRole('button', { name: 'Secundary action create api' })
        .click();
    });

    await page.waitForTimeout(1500);

    await page.getByLabel('API Token').locator('div').click();
    expect(
      page.getByRole('heading', { name: 'Create new API Tokens' }),
    ).toBeVisible();

    await getByAriaLabel(page, 'Input key name api token').fill(apiTokenName);
    await getByAriaLabel(page, 'Input tx api token').fill(txNameApiToken);

    await getByAriaLabel(page, 'Primary action create api token').click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByRole('tabpanel').getByText('API Token created!'),
    ).toBeVisible();

    await page.locator('#copy_form_api_token').click();
    const handleKey = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );
    const apiToken = await handleKey.jsonValue();

    await page.waitForTimeout(300);
    await getByAriaLabel(page, 'Secundary action create api token').click();
    await page.waitForTimeout(300);

    await page.getByLabel('API Token').locator('div').click();
    expect(page.getByText('Add more api tokens')).toBeVisible();
    expect(page.getByText(apiTokenName, { exact: true })).toBeVisible();
    await getByAriaLabel(page, 'Secundary action create api token').click();

    const provider = await BakoProvider.create(genesisWallet.provider.url, {
      serverApi: process.env.TEST_API,
      apiToken,
    });

    const vault = new Vault(provider);
    const vaultAddress = vault.address.toString();

    expect(vaultAddress).toBe(new Address(vaultAddressUI).toString());

    await E2ETestUtils.fundVault({
      genesisWallet,
      vaultAddress,
      amount: '0.00001',
    });

    await vault.transaction({
      assets: [
        {
          assetId: await provider.getBaseAssetId(),
          amount: '0.000005',
          to: vault.address.toString(),
        },
      ],
      name: txName,
    });

    await page.waitForTimeout(1000);

    await page.locator('#transactions_tab_sidebar').click();
    await page.waitForTimeout(500);
    await page.reload();
    expect(page.getByText(txName)).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);

    await page.waitForTimeout(1000);
    await expect(page.getByText('You signed')).toBeVisible();
  });

  test('create two tx vault 2/1 and sign first and decline/sign second', async ({
    page,
  }) => {
    const apiTokenName = 'key1';
    const txNameApiToken = 'tx1';
    const txName = 'Deposit by apy token';

    const {
      secondAddress,
      genesisWallet,
      username: firstUsername,
    } = await AuthTestService.loginPassKeyInTwoAccounts(page);

    await selectNetwork(page);

    const { vaultAddress: vaultAddressUI } =
      await VaultTestService.createVaulMultiSigns(page, [secondAddress], 1);

    await page.waitForTimeout(1000);

    await page.locator('#settings_tab_sidebar').click();
    expect(page.getByLabel('API Token').locator('div')).toBeVisible();

    await test.step('create and delet api token', async () => {
      await page.getByLabel('API Token').locator('div').click();
      expect(
        page.getByRole('heading', { name: 'Create new API Tokens' }),
      ).toBeVisible();

      await getByAriaLabel(page, 'Input key name api token').fill(apiTokenName);
      await getByAriaLabel(page, 'Input tx api token').fill(txNameApiToken);

      await getByAriaLabel(page, 'Primary action create api token').click();
      await page.waitForTimeout(1000);
      await expect(
        page.getByRole('tabpanel').getByText('API Token created!'),
      ).toBeVisible();
      await page.waitForTimeout(300);
      await getByAriaLabel(page, 'Secundary action create api token').click();
      await page.waitForTimeout(300);

      await page.getByLabel('API Token').locator('div').click();
      expect(page.getByText('Add more api tokens')).toBeVisible();
      expect(page.getByText(apiTokenName, { exact: true })).toBeVisible();
      await page.getByTestId('delete-api-token').click();
      await page.getByRole('button', { name: 'Delete' }).click();
      await expect(page.getByText('API Token removed!')).toBeVisible();
      await page.waitForTimeout(300);
      await expect(
        page.getByRole('heading', { name: 'No Data available' }),
      ).toBeVisible();
      await page
        .getByRole('button', { name: 'Secundary action create api' })
        .click();
    });

    await page.getByLabel('API Token').locator('div').click();
    expect(
      page.getByRole('heading', { name: 'Create new API Tokens' }),
    ).toBeVisible();

    await getByAriaLabel(page, 'Input key name api token').fill(apiTokenName);
    await getByAriaLabel(page, 'Input tx api token').fill(txNameApiToken);

    await getByAriaLabel(page, 'Primary action create api token').click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByRole('tabpanel').getByText('API Token created!'),
    ).toBeVisible();

    await page.locator('#copy_form_api_token').click();
    const handleKey = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );
    const apiToken = await handleKey.jsonValue();

    await page.waitForTimeout(300);
    await getByAriaLabel(page, 'Secundary action create api token').click();
    await page.waitForTimeout(300);

    await page.getByLabel('API Token').locator('div').click();
    expect(page.getByText('Add more api tokens')).toBeVisible();
    expect(page.getByText(apiTokenName, { exact: true })).toBeVisible();
    await getByAriaLabel(page, 'Secundary action create api token').click();

    const provider = await BakoProvider.create(genesisWallet.provider.url, {
      serverApi: process.env.TEST_API,
      apiToken,
    });

    const vault = new Vault(provider);
    const vaultAddress = vault.address.toString();

    expect(vaultAddress).toBe(new Address(vaultAddressUI).toString());

    await E2ETestUtils.fundVault({
      genesisWallet,
      vaultAddress,
      amount: '0.00001',
    });

    await vault.transaction({
      assets: [
        {
          assetId: await provider.getBaseAssetId(),
          amount: '0.000005',
          to: vault.address.toString(),
        },
      ],
      name: txName,
    });

    await page.waitForTimeout(1000);

    await page.locator('#transactions_tab_sidebar').click();

    // -- start transaction 2/1 and signed  by 1

    await page.reload();
    await expect(page.getByText(txName)).toBeVisible();
    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();
    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
    // -- end transaction 2/1 and signed  by 1

    // -- start transaction 2/1 - declined by 1 & signed  by 1
    await vault.transaction({
      assets: [
        {
          assetId: await provider.getBaseAssetId(),
          amount: '0.000004',
          to: vault.address.toString(),
        },
      ],
      name: `${txName}2`,
    });

    await page.reload();
    await expect(page.getByText(`${txName}2`)).toBeVisible();
    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Decline btn tx card').click();

    await expect(page.getByText('You declined')).toBeVisible();

    await disconnect(page);

    await AuthTestService.reloginAuthPassKey(page, firstUsername);
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await selectNetwork(page);

    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(2000);

    await expect(page.getByText('You signed')).toBeVisible();
    // -- send transaction 2/1 - declined by 1 & signed  by 1

    const completedCount = await page.getByText('Completed').count();
    expect(completedCount).toBe(2);
  });

  test('tx using api token vault 2/2', async ({ page }) => {
    const apiTokenName = 'key1';
    const txNameApiToken = 'tx1';
    const txName = 'Deposit by apy token';

    const {
      secondAddress,
      genesisWallet,
      username: firstUsername,
    } = await AuthTestService.loginPassKeyInTwoAccounts(page);

    await selectNetwork(page);

    await page.goto('/home');

    const { vaultAddress: vaultAddressUI } =
      await VaultTestService.createVaulMultiSigns(page, [secondAddress], 2);

    await page.waitForTimeout(1000);

    await page.locator('#settings_tab_sidebar').click();
    expect(page.getByLabel('API Token').locator('div')).toBeVisible();

    await test.step('create and delet api token', async () => {
      await page.getByLabel('API Token').locator('div').click();
      expect(
        page.getByRole('heading', { name: 'Create new API Tokens' }),
      ).toBeVisible();

      await getByAriaLabel(page, 'Input key name api token').fill(apiTokenName);
      await getByAriaLabel(page, 'Input tx api token').fill(txNameApiToken);

      await getByAriaLabel(page, 'Primary action create api token').click();
      await page.waitForTimeout(1000);
      await expect(
        page.getByRole('tabpanel').getByText('API Token created!'),
      ).toBeVisible();
      await page.waitForTimeout(300);
      await getByAriaLabel(page, 'Secundary action create api token').click();
      await page.waitForTimeout(300);

      await page.getByLabel('API Token').locator('div').click();
      expect(page.getByText('Add more api tokens')).toBeVisible();
      expect(page.getByText(apiTokenName, { exact: true })).toBeVisible();
      await page.getByTestId('delete-api-token').click();
      await page.getByRole('button', { name: 'Delete' }).click();
      await expect(page.getByText('API Token removed!')).toBeVisible();
      await page.waitForTimeout(300);
      await expect(
        page.getByRole('heading', { name: 'No Data available' }),
      ).toBeVisible();
      await page
        .getByRole('button', { name: 'Secundary action create api' })
        .click();
    });

    await page.getByLabel('API Token').locator('div').click();
    expect(
      page.getByRole('heading', { name: 'Create new API Tokens' }),
    ).toBeVisible();

    await getByAriaLabel(page, 'Input key name api token').fill(apiTokenName);
    await getByAriaLabel(page, 'Input tx api token').fill(txNameApiToken);

    await getByAriaLabel(page, 'Primary action create api token').click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByRole('tabpanel').getByText('API Token created!'),
    ).toBeVisible();

    await page.locator('#copy_form_api_token').click();
    const handleKey = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );
    const apiToken = await handleKey.jsonValue();

    await page.waitForTimeout(300);
    await getByAriaLabel(page, 'Secundary action create api token').click();
    await page.waitForTimeout(300);

    await page.getByLabel('API Token').locator('div').click();
    expect(page.getByText('Add more api tokens')).toBeVisible();
    expect(page.getByText(apiTokenName, { exact: true })).toBeVisible();
    await getByAriaLabel(page, 'Secundary action create api token').click();

    const provider = await BakoProvider.create(genesisWallet.provider.url, {
      serverApi: process.env.TEST_API,
      apiToken,
    });

    const vault = new Vault(provider);
    const vaultAddress = vault.address.toString();

    expect(vaultAddress).toBe(new Address(vaultAddressUI).toString());

    await E2ETestUtils.fundVault({
      genesisWallet,
      vaultAddress,
      amount: '0.00001',
    });

    await vault.transaction({
      assets: [
        {
          assetId: await provider.getBaseAssetId(),
          amount: '0.000005',
          to: vault.address.toString(),
        },
      ],
      name: txName,
    });

    await page.waitForTimeout(1000);

    await page.locator('#transactions_tab_sidebar').click();
    await page.reload();
    await page.waitForTimeout(500);
    await expect(page.getByText(txName)).toBeVisible();

    await page.reload();
    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();

    await disconnect(page);

    try {
      await AuthTestService.reloginAuthPassKey(page, firstUsername);
    } catch {
      page.reload();
      await AuthTestService.reloginAuthPassKey(page, firstUsername);
    }

    await selectNetwork(page);
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    await page.reload();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
  });
});

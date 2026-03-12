import {
  expect,
  FuelWalletTestHelper,
  getByAriaLabel,
  test,
} from '@fuels/playwright-utils';
import { BakoProvider, Vault } from 'bakosafe';
import { Address, WalletUnlocked } from 'fuels';

import { mockRouteAssets } from './utils/helpers';
import { AuthTestService } from './utils/services/auth-service';
import { VaultTestService } from './utils/services/vault-service';
import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('API Token', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let genesisWallet: WalletUnlocked;

  test.beforeEach(async ({ extensionId, context, page }) => {
    await mockRouteAssets(page);

    const E2EUtils = await E2ETestUtils.setupFuelWallet({
      page,
      context,
      extensionId,
    });

    genesisWallet = E2EUtils.genesisWallet;
    fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
  });

  test('tx using api token', async ({ page }) => {
    const apiTokenName = 'key1';
    const txNameApiToken = 'tx1';
    const txName = 'Deposit by apy token';

    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });
    await page.locator('[aria-label="Close window"]').click();

    await getByAriaLabel(page, 'Sidebar Vault Address').click();
    await page.waitForTimeout(500);
    const handleAddress = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );

    const vaultAddressUI = await handleAddress.jsonValue();

    await VaultTestService.addFundVault(page, vaultAddressUI, genesisWallet);

    await page.locator('#settings_tab_sidebar').click();
    expect(page.getByText('API Tokens')).toBeVisible();
    await page.getByLabel('API Tokens').click();
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

    await page.locator('[aria-label="Copy API Token"]').click();
    const handleKey = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );
    const apiToken = await handleKey.jsonValue();

    await page.waitForTimeout(300);
    await getByAriaLabel(page, 'Secundary action create api token').click();
    await page.waitForTimeout(300);

    await getByAriaLabel(page, 'API Tokens').click();
    expect(page.getByText('Add more api tokens')).toBeVisible();
    expect(page.getByText(apiTokenName)).toBeVisible();
    await getByAriaLabel(page, 'Secundary action create api token').click();

    const provider = await BakoProvider.create(genesisWallet.provider.url, {
      serverApi: 'http://localhost:3333',
      apiToken,
    });

    const vault = new Vault(provider);
    const vaultAddress = vault.address.toString();

    expect(vaultAddress).toBe(new Address(vaultAddressUI).toString());

    await vault.transaction({
      assets: [
        {
          assetId: await provider.getBaseAssetId(),
          amount: '0.0001',
          to: vault.address.toString(),
        },
      ],
      name: txName,
    });

    await page.waitForTimeout(1000);

    await page.locator('#transactions_tab_sidebar').click();
    await page.waitForTimeout(500);
    expect(page.getByText(txName)).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);
    await E2ETestUtils.signMessageFuelWallet({
      page,
      fuelWalletTestHelper,
    });
    await page.waitForTimeout(1000);
    await expect(page.getByText('You signed')).toBeVisible();
  });
});

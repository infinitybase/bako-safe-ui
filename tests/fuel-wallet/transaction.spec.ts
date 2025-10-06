import {
  expect,
  FuelWalletTestHelper,
  getByAriaLabel,
  test,
} from '@fuels/playwright-utils';
import { WalletUnlocked } from 'fuels';

import { getWalletAddress, mockRouteAssets } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';
import { TransactionTestService } from '../utils/services/transaction-service';
import { VaultTestService } from '../utils/services/vault-service';
import { E2ETestUtils } from '../utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Create transactions fuel wallet', async () => {
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

    await page.goto('/');
  });

  test('create and sign tx by wallet', async ({ page }) => {
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);

    // Check if the user is logged in
    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    const { vaultName, vaultAddress } =
      await VaultTestService.createVault(page);

    const elements = page.locator(`text=${vaultName}`);
    const count = await elements.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
      await expect(elements.nth(i)).toBeVisible();
    }

    const reload = false;
    await VaultTestService.addFundVault(
      page,
      vaultAddress,
      genesisWallet,
      reload,
    );
    await page.reload();
    await page.waitForTimeout(1000);

    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTxWrongData(page);
    await TransactionTestService.fillFormTx(page, genesisWallet, true);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Menu select mode create tx').click();
    await getByAriaLabel(page, 'Menu item create tx').click();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();

    await expect(page.getByText('1 pending transaction')).toBeVisible();
    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(2000);
    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });

    await expect(page.getByText('You signed')).toBeVisible();
  });

  test('create two tx vault 2/1 and sign first and decline/sign second', async ({
    page,
  }) => {
    const signsNeed = 1;

    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    const { address2 } = await getWalletAddress(fuelWalletTestHelper);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [address2],
      signsNeed,
    );

    await VaultTestService.addFundVault(page, vaultAddress, genesisWallet);

    // -- start transaction 2/1 and signed  by 1
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page, genesisWallet, false);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Menu select mode create tx').click();
    await getByAriaLabel(page, 'Menu item create tx').click();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();

    await expect(page.getByText('1 pending transaction')).toBeVisible();
    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(2000);
    await E2ETestUtils.signMessageFuelWallet({ fuelWalletTestHelper, page });

    await expect(page.getByText('You signed')).toBeVisible();
    // -- end transaction 2/1 and signed  by 1

    // -- start transaction 2/1 - declined by 1 & signed  by 1
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page, genesisWallet);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await TransactionTestService.onlyCreateTx(page);

    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Decline btn tx card').click();

    await expect(page.getByText('You declined')).toBeVisible();

    await AuthTestService.reloginWalletConnection(
      page,
      fuelWalletTestHelper,
      'Account 2',
    );
    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });

    await page.waitForTimeout(2000);

    await expect(page.getByText('You signed')).toBeVisible();
    // -- send transaction 2/1 - declined by 1 & signed  by 1

    const completedCount = await page.getByText('Completed').count();
    expect(completedCount).toBe(2);
  });

  test('create two tx vault 2/2 and decline first and 2 signed second', async ({
    page,
  }) => {
    const signsNeed = 2;

    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    const { address2 } = await getWalletAddress(fuelWalletTestHelper);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [address2],
      signsNeed,
    );

    await VaultTestService.addFundVault(page, vaultAddress, genesisWallet);
    // -- start test transaction 2/2 and decliened by 1
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page, genesisWallet, false);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Menu select mode create tx').click();
    await getByAriaLabel(page, 'Menu item create tx').click();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();

    await expect(page.getByText('1 pending transaction')).toBeVisible();
    await expect(page.getByText('0/2 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Decline btn tx card').click();

    await expect(page.getByText('You declined')).toBeVisible();
    await page.waitForTimeout(500);
    // -- finish test transaction 2/2 and decliened by 1

    // -- start teste transaction 2/2 and signed by 2 accounts
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page, genesisWallet);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await TransactionTestService.onlyCreateTx(page);

    await expect(page.getByText('1 pending transaction')).toBeVisible();

    await expect(page.getByText('0/2 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });

    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    await AuthTestService.reloginWalletConnection(
      page,
      fuelWalletTestHelper,
      'Account 2',
    );

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    try {
      await getByAriaLabel(page, 'Sign btn tx card').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Sign btn tx card').click();
    }
    await page.waitForTimeout(1000);
    await E2ETestUtils.signMessageFuelWallet({
      fuelWalletTestHelper,
      page,
    });

    await expect(page.getByText('You signed')).toBeVisible();

    // -- finish teste transaction 2/2 and signed by 2 accounts

    const completedCount = await page.getByText('Completed').count();
    expect(completedCount).toBe(1);
  });

  test('create tx vault 2/2 wallet 2 signs', async ({ page }) => {
    const signsNeed = 2;
    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
    // Check if the user is logged in
    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await getByAriaLabel(page, 'Dropdown header').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Copy address' }).click();
    const handleAddress = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );
    const secondAddress = await handleAddress.jsonValue();

    await page.waitForTimeout(300);
    await page.waitForTimeout(3000);

    await page.goto('/');
    await page.waitForTimeout(2000);

    await page.locator('body').click();

    await AuthTestService.reloginWalletConnection(
      page,
      fuelWalletTestHelper,
      'Account 2',
    );

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    const { vaultAddress, vaultName } =
      await VaultTestService.createVaulMultiSigns(
        page,
        [secondAddress],
        signsNeed,
      );

    const reload = false;
    await VaultTestService.addFundVault(
      page,
      vaultAddress,
      genesisWallet,
      reload,
    );

    // ----- relogin
    await AuthTestService.reloginWalletConnection(
      page,
      fuelWalletTestHelper,
      'Account 2',
    );

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await page.getByText(vaultName, { exact: true }).click();
    // ------------------------

    // -- start teste transaction 2/2 and signed by 2 accounts
    await page.waitForTimeout(2000);
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page, genesisWallet);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await TransactionTestService.onlyCreateTx(page);

    await expect(page.getByText('1 pending transaction')).toBeVisible();

    await expect(page.getByText('0/2 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);
    await E2ETestUtils.signMessageFuelWallet({
      page,
      fuelWalletTestHelper,
    });
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    await AuthTestService.reloginWalletConnection(page, fuelWalletTestHelper);

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);
    await E2ETestUtils.signMessageFuelWallet({
      page,
      fuelWalletTestHelper,
    });
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
    // -- finish teste transaction 2/2 and signed by 2 accounts
    const completedCount = await page.getByText('Completed').count();
    expect(completedCount).toBe(1);
  });
});

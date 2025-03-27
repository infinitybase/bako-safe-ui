import {
  expect,
  FuelWalletTestHelper,
  getByAriaLabel,
  test,
} from '@fuels/playwright-utils';
import { WalletUnlocked } from 'fuels';

import {
  disconnect,
  mockRouteAssets,
  selectNetwork,
  TestNetworks,
} from './utils/helpers';
import { AuthTestService } from './utils/services/auth-service';
import { TransactionTestService } from './utils/services/transaction-service';
import { VaultTestService } from './utils/services/vault-service';
import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Create transactions', () => {
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

  test('create and sign passwordkey', async ({ page }) => {
    const { genesisWallet: wallet } = await AuthTestService.loginAuth(page);

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await selectNetwork(page, TestNetworks.local);

    const { vaultAddress } = await VaultTestService.createVault(page);

    await VaultTestService.addFundVault(page, vaultAddress, wallet);

    await getByAriaLabel(page, 'Create transaction btn').click();
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();

    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();

    const completedCount = await page.getByText('Completed').count();
    expect(completedCount).toBe(2);
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

    await VaultTestService.addFundVault(page, vaultAddress, genesisWallet);

    await getByAriaLabel(page, 'Create transaction btn').click();
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();

    await E2ETestUtils.signMessageFuelWallet({
      page,
      fuelWalletTestHelper,
    });
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
  });

  test('create two tx vault 2/1 and sign first and decline/sign second', async ({
    page,
  }) => {
    const signsNeed = 1;

    const {
      secondAddress,
      genesisWallet: wallet,
      username: firstUsername,
    } = await AuthTestService.loginPassKeyInTwoAccounts(page);

    await selectNetwork(page, TestNetworks.local);

    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [secondAddress],
      signsNeed,
    );

    await VaultTestService.addFundVault(page, vaultAddress, wallet);

    // -- start transaction 2/1 and signed  by 1
    await getByAriaLabel(page, 'Create transaction btn').click();
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

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

    await expect(page.getByText('You signed')).toBeVisible();
    // -- end transaction 2/1 and signed  by 1

    // -- start transaction 2/1 - declined by 1 & signed  by 1
    await getByAriaLabel(page, 'Create transaction btn').click();
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await TransactionTestService.onlyCreateTx(page);

    await expect(page.getByText('1 pending transaction')).toBeVisible();

    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Decline btn tx card').click();

    await expect(page.getByText('You declined')).toBeVisible();

    await disconnect(page);

    await AuthTestService.reloginAuthPassKey(page, firstUsername);
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await selectNetwork(page, TestNetworks.local);

    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
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

    const {
      secondAddress,
      genesisWallet: wallet,
      username: firstUsername,
    } = await AuthTestService.loginPassKeyInTwoAccounts(page);

    await selectNetwork(page, TestNetworks.local);

    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [secondAddress],
      signsNeed,
    );

    await VaultTestService.addFundVault(page, vaultAddress, wallet);
    // -- start test transaction 2/2 and decliened by 1
    await getByAriaLabel(page, 'Create transaction btn').click();
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

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
    await getByAriaLabel(page, 'Create transaction btn').click();
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await TransactionTestService.onlyCreateTx(page);

    await expect(page.getByText('1 pending transaction')).toBeVisible();

    await expect(page.getByText('0/2 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    await disconnect(page);

    await AuthTestService.reloginAuthPassKey(page, firstUsername);
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await selectNetwork(page, TestNetworks.local);

    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
    // -- finish teste transaction 2/2 and signed by 2 accounts
    const completedCount = await page.getByText('Completed').count();
    expect(completedCount).toBe(1);
  });

  test('create two tx vault 2/2 wallet 2 signs', async ({ page }) => {
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
    await getByAriaLabel(page, 'Disconnect').click();
    await page.waitForTimeout(3000);

    await page.goto(
      'chrome-extension://gkoblaakkldmbbfnfhijgegmjahojbee/popup.html#/wallet',
    );
    await page.bringToFront();
    await page.waitForTimeout(2000);
    expect(page.getByText('Account 1')).toBeVisible();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: 'Accounts' }).click();

    await page.waitForTimeout(200);
    await expect(page.getByText('Add new account')).toBeVisible();
    await getByAriaLabel(page, 'Add account').click();
    await page.waitForTimeout(2000);
    expect(page.getByText('Account 2', { exact: true })).toBeVisible();

    await page.goto('/');
    await page.bringToFront();
    await page.waitForTimeout(2000);

    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [secondAddress],
      signsNeed,
    );

    await VaultTestService.addFundVault(page, vaultAddress, genesisWallet);

    // -- start teste transaction 2/2 and signed by 2 accounts
    await page.waitForTimeout(2000);
    await getByAriaLabel(page, 'Create transaction btn').click();
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

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

    await disconnect(page);

    await page.goto(
      'chrome-extension://gkoblaakkldmbbfnfhijgegmjahojbee/popup.html#/wallet',
    );
    await page.bringToFront();
    await page.waitForTimeout(1200);

    await page.getByRole('button', { name: 'Accounts' }).click();
    await page.waitForTimeout(200);

    await page.getByText('Account 1', { exact: true }).click();
    expect(page.getByText('Account 1', { exact: true })).toBeVisible();

    await page.waitForTimeout(2000);
    await page.goto('/');
    await page.bringToFront();
    await page.waitForTimeout(9000);

    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);

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

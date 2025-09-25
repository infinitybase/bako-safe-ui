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
  modalCloseTest,
  selectNetwork,
  TestAssets,
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

    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

    const { vaultAddress } = await VaultTestService.createVault(page);

    await VaultTestService.addFundVault(page, vaultAddress, wallet);
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

    await TransactionTestService.fillFormTxWrongData(page);
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

    const reload = false;
    await VaultTestService.addFundVault(
      page,
      vaultAddress,
      genesisWallet,
      reload,
    );
    await page.waitForTimeout(2000);

    // -- relogin
    await AuthTestService.reloginWalletConnection(page, fuelWalletTestHelper);

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await page.getByText(vaultName, { exact: true }).click();
    // ------------------------

    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await TransactionTestService.onlyCreateTx(page);
    await page.waitForTimeout(500);

    await getByAriaLabel(page, 'Sign btn tx card').click();

    await page.waitForTimeout(2000);

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

    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [secondAddress],
      signsNeed,
    );

    await VaultTestService.addFundVault(page, vaultAddress, wallet);

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
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await TransactionTestService.onlyCreateTx(page);

    await expect(page.getByText('0/1 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Decline btn tx card').click();

    await expect(page.getByText('You declined')).toBeVisible();

    await disconnect(page);

    await AuthTestService.reloginAuthPassKey(page, firstUsername);
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

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

    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [secondAddress],
      signsNeed,
    );

    await VaultTestService.addFundVault(page, vaultAddress, wallet);
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
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
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

    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

    await expect(page.getByText('1/2 Sgd', { exact: true })).toBeVisible();

    await getByAriaLabel(page, 'Sign btn tx card').click();
    await page.waitForTimeout(1000);

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
    await getByAriaLabel(page, 'Disconnect').click();
    await page.waitForTimeout(3000);

    await fuelWalletTestHelper.addAccount();

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

  // Rodar somente local, pois precisa de saldo de tolkens UNK
  test.fixme('tx multiple recipients and tokens', async ({ page }) => {
    const addr1 =
      '0x19E0E3971aCe37F66B4a2740DfB910608Bbc2b980cE240BB11e2161c4B8aA360';

    // login and create vault 1
    const { genesisWallet: wallet, username: user2 } =
      await AuthTestService.loginAuth(page);

    await getByAriaLabel(page, 'Close window').click();

    await page.goto('/home');
    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

    const { vaultAddress: vault2, vaultName: vaultName2 } =
      await VaultTestService.createVault(page);

    await disconnect(page);
    // login in user to send tx
    await AuthTestService.loginAuth(page, wallet);

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await getByAriaLabel(page, 'Close window').click();

    await page.goto('/home');

    await page.getByText('Address book', { exact: true }).click();
    await expect(page).toHaveURL(/address-book/);

    // add addrs book 1
    const adresbookForm = page.getByRole('button', {
      name: 'Add new favorite',
    });
    await adresbookForm.click();
    await modalCloseTest(page, adresbookForm);

    await page.getByLabel('Name or Label').nth(1).fill('addr1');
    await page.getByLabel('Address', { exact: true }).nth(1).fill(addr1);

    await page.getByLabel('Create address book').nth(1).click();
    await page.waitForTimeout(500);

    // add addrs book 2
    const adresbookForm2 = page.getByRole('button', {
      name: 'Add new favorite',
    });
    await adresbookForm2.click();
    await modalCloseTest(page, adresbookForm2);

    await page.getByLabel('Name or Label').nth(1).fill('addr2');
    await page.getByLabel('Address', { exact: true }).nth(1).fill(vault2);

    await page.getByLabel('Create address book').nth(1).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText('addr1')).toBeVisible();
    await expect(page.getByText('addr2')).toBeVisible();

    await page.waitForTimeout(1000);
    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    const { vaultAddress } = await VaultTestService.createVault(page);

    const reload = true;

    await VaultTestService.addFundVault(page, vaultAddress, wallet, !reload);

    await VaultTestService.addFundVault(
      page,
      vaultAddress,
      wallet,
      reload,
      TestAssets.UNK,
    );

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

    await TransactionTestService.fillFormChangeAsset(page, addr1, 1);
    await page.locator('#add_more_recipient').click();
    await TransactionTestService.fillFormChangeAsset(page, vault2, 2);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();
    await page.waitForTimeout(500);
    await expect(page.getByText('You signed')).toBeVisible();
    await page.waitForTimeout(300);
    await page
      .locator('[aria-label="Transaction Card Header"]')
      .first()
      .click();
    await page.waitForTimeout(2000);

    await disconnect(page);

    await AuthTestService.reloginAuthPassKey(page, user2);
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    // await selectNetwork(page, TestNetworks.local);
    await selectNetwork(page, TestNetworks.fuel_sepolia_testnet);

    await page.waitForTimeout(2000);

    await page.getByText(vaultName2).click();
    await page.waitForTimeout(500);

    await getByAriaLabel(page, 'Transaction Card Header').click();

    await expect(page.getByText('Deposit')).toBeVisible();
    await expect(page.getByText('UNK', { exact: true })).toBeVisible();
    const countMoney = await page.getByText('0.00001').count();
    expect(countMoney).toBe(2);
  });
});

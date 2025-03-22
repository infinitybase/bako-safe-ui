import {
  expect,
  FuelWalletTestHelper,
  getButtonByText,
  getByAriaLabel,
  hasAriaLabel,
  hasText,
  test,
} from '@fuels/playwright-utils';
import { randomUUID, WalletUnlocked } from 'fuels';

import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Fuel Wallet', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let genesisWallet: WalletUnlocked;

  test.beforeEach(async ({ extensionId, context, page }) => {
    const E2EUtils = await E2ETestUtils.setup({
      page,
      context,
      extensionId,
    });


    masterWallet = E2EUtils.genesisWallet;
    fuelWalletTestHelper = E2EUtils.fuelWalletTestHelper;
  });

  
  test('example fuel wallet', async ({ page }) => {
    // Get the Fuel Wallet button and click it
    await getByAriaLabel(page, 'Connect Fuel Wallet').click();

    // Approve the connection in the Fuel Wallet
    await fuelWalletTestHelper.walletConnect();

    // Sign a message in the Fuel Wallet
    await E2ETestUtils.signMessage({
      page,
      fuelWalletTestHelper,
    });

    // Check if the user is logged in
    await hasText(page, /Welcome to Bako Safe!/);

    // Close modal
    await getByAriaLabel(page, 'Close window').click();

    await page.goto('/home');
    await page.waitForTimeout(2000);

    await getButtonByText(page, 'Create vault').click();
    await page.locator('#vault_name').fill(randomUUID());

    await getByAriaLabel(page, 'Create Vault Primary Action').click();
    await getByAriaLabel(page, 'Create Vault Primary Action').click();
    await getButtonByText(page, 'Done').click();
    await page.waitForTimeout(2000);

    await getByAriaLabel(page, 'Sidebar Vault Address').click();

    // Get clipboard content after the link/button has been clicked
    const handle = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );
    const vaultAddress = await handle.jsonValue();
    await E2ETestUtils.fundVault({
      genesisWallet,
      vaultAddress,
      amount: '1.001',
    });

    await page.reload();
    await page.waitForTimeout(2000);

    await hasAriaLabel(page, 'ETH Asset Card');
  });
});

test('load page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Bako Safe/);
});

test('webauthn', async ({ page }) => {
  await E2ETestUtils.enablePasskey({ page });

  // Navegue até a página inicial
  await page.goto('/');
  await page.bringToFront();

  // select text "Welcome to Bako Safe"
  const welcomeText = page.locator('text=Welcome to Bako Safe');
  await expect(welcomeText).toBeVisible();

  // select input by id
  const usernameInput = page.locator('#fixed_id');
  console.log('Clicou no input', usernameInput.focus());
  const name = `guilhermemr${Date.now()}`;
  await usernameInput.fill(name); // type 'guilhermemr'
  await expect(usernameInput).toHaveValue(name);

  await page.waitForTimeout(1000);
  await getByAriaLabel(page, 'Create account')
    .filter({ has: page.locator(':visible') })
    .click();

  // Scroll to bottom of dialog content
  const termsOfUseDialog = await page.$('[aria-label="Terms of Use"]');
  if (termsOfUseDialog) {
    await termsOfUseDialog.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
  }

  await getByAriaLabel(page, 'Accept Terms of Use').click();
  await getByAriaLabel(page, 'Begin')
    .filter({ has: page.locator(':visible') })
    .click();

  // Check if the user is logged in
  await hasText(page, /Welcome to Bako Safe!/);
});

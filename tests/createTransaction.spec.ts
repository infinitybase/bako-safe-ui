import {
  expect,
  FuelWalletTestHelper,
  getByAriaLabel,
  hasText,
  test,
} from '@fuels/playwright-utils';
import { WalletUnlocked } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';

import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Fuel Wallet', () => {
  let node: Awaited<ReturnType<typeof launchTestNode>>;

  let fuelWalletTestHelper: FuelWalletTestHelper;
  let fuelWallet: WalletUnlocked;
  let masterWallet: WalletUnlocked;

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
    const closeWindow = page.locator('[aria-label="Close window"]');
    await closeWindow.click();

    await page.pause()
    

  });
});

import {
  downloadFuel,
  FuelWalletTestHelper,
  getByAriaLabel,
  test,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { bn, Mnemonic, Wallet } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';

export class E2ETestUtils {
  static FUEL_WALLET_VERSION = '0.46.1';

  static async downloadFuelExtension(config: { test: typeof test }) {
    const path = await downloadFuel(E2ETestUtils.FUEL_WALLET_VERSION);
    config.test.use({ pathToExtension: path });
  }

  static async setup(config: {
    page: Page;
    context: BrowserContext;
    extensionId: string;
  }) {
    const { context, extensionId } = config;

    // Launch node and create a random wallet
    const node = await launchTestNode();
    const randomMnemonic = Mnemonic.generate();
    const fuelWallet = Wallet.fromMnemonic(randomMnemonic);
    fuelWallet.connect(node.provider);

    // Get master wallet and fund the fuel wallet
    const [masterWallet] = node.wallets;
    const txResponse = await masterWallet.transfer(
      fuelWallet.address,
      bn.parseUnits('2'),
    );
    await txResponse.waitForResult();

    const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup(
      context,
      extensionId,
      node.provider.url.replace('0.0.0.0', 'localhost'),
      'test',
      randomMnemonic,
    );
    await config.page.goto('/');
    await config.page.bringToFront();
    await config.page.waitForTimeout(2000);

    return { fuelWalletTestHelper, node, fuelWallet, masterWallet };
  }

  static async signMessage(config: {
    fuelWalletTestHelper: FuelWalletTestHelper;
    page: Page;
  }) {
    const { fuelWalletTestHelper, page } = config;
    await page.waitForTimeout(2000);
    const popupPage = await fuelWalletTestHelper.getWalletPopupPage();
    await getByAriaLabel(popupPage, 'Sign').click();
  }

  static async enablePasskey(config: { page: Page }) {
    const client = await config.page.context().newCDPSession(config.page);
    await client.send('WebAuthn.enable');
    await client.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    });
  }
}

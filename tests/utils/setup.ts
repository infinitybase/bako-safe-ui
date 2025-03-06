import {
  downloadFuel,
  FuelWalletTestHelper,
  getByAriaLabel,
  getInputByName,
  test,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { bn, Mnemonic, Provider, Wallet } from 'fuels';
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

    const provider = new Provider("http://localhost:4000/v1/graphql")
    const genesisWallet = Wallet.fromPrivateKey("0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298", provider)

    const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup(
      context,
      extensionId,
      provider.url,
      'test',
    );
    const popupPage = await fuelWalletTestHelper.getWalletPopupPage();
    await getInputByName(popupPage,"url").fill(provider.url)
    await getInputByName(popupPage,"chainId").fill((await provider.getChainId()).toString())
    await fuelWalletTestHelper.switchNetwork("Local Ignition")
    await config.page.goto('/');
    await config.page.bringToFront();
    await config.page.waitForTimeout(2000);

    return { fuelWalletTestHelper, genesisWallet };
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

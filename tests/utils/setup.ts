import {
  FuelWalletTestHelper,
  getByAriaLabel,
  test,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { Account, bn, Mnemonic, Provider, Wallet } from 'fuels';

import { TestAssets } from './helpers';

export class E2ETestUtils {
  static async downloadFuelExtension(config: { test: typeof test }) {
    config.test.use({ pathToExtension: process.env.FUEL_EXTENSION_PATH! });
  }

  static buildProvider = () => {
    const provider = new Provider(process.env.E2E_TEST_NETWORK || 'http://localhost:4000/v1/graphql');
    const genesisWallet = Wallet.fromPrivateKey(
      '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
      provider,
    );

    return { provider, genesisWallet }
  }

  static async setupFuelWallet(config: {
    page: Page;
    context: BrowserContext;
    extensionId: string;
  }) {
    const { context, extensionId } = config;
    const { provider, genesisWallet } = this.buildProvider();

    const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup({
      context,
      fuelExtensionId: extensionId,
      fuelProvider: {
        url: provider.url,
        chainId: await provider.getChainId(),
      },
      chainName: (await provider.getChain()).name,
      mnemonic: Mnemonic.generate(),
    });
    await config.page.goto('/');
    await config.page.bringToFront();
    await config.page.waitForTimeout(2000);

    return { fuelWalletTestHelper, genesisWallet };
  }

  static async setupPasskey(config: { page: Page }) {
    const { provider, genesisWallet } = this.buildProvider();

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

    await config.page.goto('/');
    await config.page.bringToFront();
    await config.page.waitForTimeout(2000);

    return { genesisWallet };
  }

  static async signMessageFuelWallet(config: {
    fuelWalletTestHelper: FuelWalletTestHelper;
    page: Page;
  }) {
    const { fuelWalletTestHelper, page } = config;

    await page.waitForTimeout(2000);
    const popupPage = await fuelWalletTestHelper.getWalletPopupPage();
    await getByAriaLabel(popupPage, 'Sign').click();
    await page.waitForTimeout(500);
  }

  static async fundVault(config: {
    genesisWallet: Account;
    vaultAddress: string;
    amount: string;
    assetId?: TestAssets;
  }) {
    const { genesisWallet, vaultAddress, amount, assetId } = config;
    const asset = assetId ? assetId : TestAssets.ETH;

    const transactionResponse = await genesisWallet.transfer(
      vaultAddress,
      bn.parseUnits(amount),
      asset,
    );
    await transactionResponse.waitForResult();
  }
}

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
    const provider = new Provider(process.env.TEST_NETWORK!);
    const genesisWallet = Wallet.fromPrivateKey(
      '0x5ac4a3075cfeb0a1238efc082978aa6a7a2efe11e6f2ce2b564d708807fab6ad'!,
      provider,
    );

    return { provider, genesisWallet };
  };

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

    const walletPage = fuelWalletTestHelper.getWalletPage();

    const closeBtn = walletPage.getByRole('button', {
      name: 'Close dialog',
    });
    if (await closeBtn.isVisible()) {
      try {
        await closeBtn.click();
      } catch {
        null;
      }
    }

    await fuelWalletTestHelper.addAccount();
    await fuelWalletTestHelper.switchAccount('Account 1');

    return { fuelWalletTestHelper, genesisWallet };
  }

  static async setupPasskey(config: { page: Page }) {
    const { genesisWallet } = this.buildProvider();

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

    console.log(
      `Transferred ${amount} of asset ${asset} to vault address ${vaultAddress}`,
    );
  }
}

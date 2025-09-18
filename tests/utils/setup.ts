import {
  FuelWalletTestHelper,
  getByAriaLabel,
  test,
} from '@fuels/playwright-utils';
import { DeployContractConfig, launchTestNode, LaunchTestNodeReturn } from 'fuels/test-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { Account, bn, Mnemonic } from 'fuels';

import { TestAssets } from './helpers';

export class E2ETestUtils {
  static async downloadFuelExtension(config: { test: typeof test }) {
    config.test.use({ pathToExtension: process.env.FUEL_EXTENSION_PATH! });
  }

  static defaultLaunchTestNode = async () => {
    const node = await launchTestNode();
    return { node, genesisWallet: node.wallets[0] };
  }

  static async setupFuelWalletTestHelper(config: {
    page: Page;
    context: BrowserContext;
    extensionId: string;
    node: LaunchTestNodeReturn<DeployContractConfig[]>
  }) {
    const { context, extensionId, node } = config;

    const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup({
      context,
      fuelExtensionId: extensionId,
      fuelProvider: {
        url: node.provider.url,
        chainId: await node.provider.getChainId(),
      },
      chainName: (await node.provider.getChain()).name,
      mnemonic: Mnemonic.generate(),
    });

    await config.page.goto('/');
    await config.page.bringToFront();
    await config.page.waitForTimeout(2000);

    return fuelWalletTestHelper;
  }

  static async setupPasskey(config: { page: Page }) {
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

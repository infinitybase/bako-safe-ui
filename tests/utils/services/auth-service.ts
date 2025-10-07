import { FuelWalletTestHelper, getByAriaLabel } from '@fuels/playwright-utils';
import { Page } from '@playwright/test';
import { WalletUnlocked } from 'fuels';

import { disconnect } from '../helpers';
import { E2ETestUtils } from '../setup';

interface LoginAuthTestResponse {
  username: string;
  genesisWallet: WalletUnlocked;
}

export class AuthTestService {
  static async loginAuth(
    page: Page,
    wallet: WalletUnlocked | null = null,
  ): Promise<LoginAuthTestResponse> {
    if (!wallet) {
      const { genesisWallet } = await E2ETestUtils.setupPasskey({ page });
      wallet = genesisWallet;
    }

    // Navegue até a página inicial
    await page.goto('/');
    await page.bringToFront();

    // select input by id
    const usernameInput = page.locator('#fixed_id');
    console.log('Clicou no input', usernameInput.focus());
    const name = `teste${Date.now()}`;
    await usernameInput.fill(name); // type 'guilhermemr'

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
    await page.waitForTimeout(1000);

    return { username: name, genesisWallet: wallet };
  }

  static async reloginAuthPassKey(page: Page, username: string) {
    // Navegue até a página inicial
    await page.goto('/');
    await page.bringToFront();

    // select input by id
    const usernameInput = page.locator('#fixed_id');
    console.log('Clicou no input', usernameInput.focus());

    await usernameInput.fill(username);

    await getByAriaLabel(page, 'subtitle_login_page').nth(0).click();

    await page.waitForTimeout(300);

    await getByAriaLabel(page, 'Login account')
      .filter({ has: page.locator(':visible') })
      .click();
    await page.waitForTimeout(1000);
  }

  static async loginWalletConnection(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
  ) {
    await getByAriaLabel(page, 'Connect Fuel Wallet').click();

    //Approve the connection in the Fuel Wallet
    await fuelWalletTestHelper.walletConnect();

    // Sign a message in the Fuel Wallet
    await E2ETestUtils.signMessageFuelWallet({
      page,
      fuelWalletTestHelper,
    });
  }

  static async reloginWalletConnection(
    page: Page,
    fuelWalletTestHelper: FuelWalletTestHelper,
    accountName: string = 'Account 1',
  ) {
    await disconnect(page);

    await page.goto(
      'chrome-extension://gkoblaakkldmbbfnfhijgegmjahojbee/popup.html#/wallet',
    );
    await page.bringToFront();
    await page.waitForTimeout(1200);

    await page.getByRole('button', { name: 'Accounts' }).click();
    await page.waitForTimeout(200);

    await page.getByRole('heading', { name: accountName, exact: true }).click();

    await page.waitForTimeout(2000);
    await page.goto('/');
    await page.bringToFront();
    await page.waitForTimeout(9000);

    await AuthTestService.loginWalletConnection(page, fuelWalletTestHelper);
  }

  static async loginPassKeyInTwoAccounts(page: Page) {
    const { genesisWallet: wallet, username: firstUsername } =
      await this.loginAuth(page);

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    await getByAriaLabel(page, 'Dropdown header').click();
    await page.waitForTimeout(500);
    await getByAriaLabel(page, 'Copy address').click();
    const handleAddress = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );
    const secondAddress = await handleAddress.jsonValue();

    await getByAriaLabel(page, 'Disconnect').click();

    await this.loginAuth(page, wallet);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();

    return { genesisWallet: wallet, username: firstUsername, secondAddress };
  }
}

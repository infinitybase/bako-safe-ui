import { FuelWalletTestHelper, getByAriaLabel } from '@fuels/playwright-utils';
import { expect, Page } from '@playwright/test';
import { WalletUnlocked } from 'fuels';

import { E2ETestUtils } from '../setup';

interface TxTestResponse {
  transactionName: string;
  recipientAddr: string;
}

export class TransactionTestService {
  static async fillFormTx(
    page: Page,
    genesisWallet: WalletUnlocked,
    max = true,
  ): Promise<TxTestResponse> {
    const transactionName = 'transactionName';
    const recipientAddr = genesisWallet.address.toString();
    const amount = '0.00001';

    await page.locator('#transaction_name').fill(transactionName);
    await getByAriaLabel(page, 'Autocomplete Recipient Address 1').fill(
      recipientAddr,
    );
    if (max) {
      await page.getByRole('button', { name: 'MAX' }).click();
    } else {
      await page.locator('[data-testid="transaction_amount"]').fill(amount);
    }
    await page.waitForTimeout(500);

    return { transactionName, recipientAddr };
  }

  static async onlyCreateTx(page: Page) {
    await getByAriaLabel(page, 'Menu select mode create tx').click();
    await getByAriaLabel(page, 'Menu item create tx').click();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();
  }

  static async fillFormTxWrongData(page: Page): Promise<void> {
    const transactionName = 'transactionName';
    const addrInvalid = 'invalid adrs';
    const amountTxFee = '1,500,000,000,000,000.00';

    await page.locator('#transaction_name').fill(transactionName);
    await getByAriaLabel(page, 'Autocomplete Recipient Address 1').fill(
      addrInvalid,
    );
    await expect(page.getByText('Invalid address.')).toBeVisible();

    await page.locator('[data-testid="transaction_amount"]').fill(amountTxFee);
    await page.waitForTimeout(500);
    await expect(page.getByText('Insufficient funds for gas')).toBeVisible();

    await page.locator('#transaction_name').clear();
    await page.locator('[data-testid="transaction_amount"]').clear();
  }

  static async returnFundsToGenesisWalletWithFuelWallet(
    page: Page,
    genesisWallet: WalletUnlocked,
    fuelWalletTestHelper: FuelWalletTestHelper,
  ) {
    try {
      await getByAriaLabel(page, 'Create transaction btn').click();
    } catch {
      page.reload();
      await getByAriaLabel(page, 'Create transaction btn').click();
    }
    await expect(
      page.getByRole('heading', { name: 'Create Transaction' }),
    ).toBeVisible();

    await TransactionTestService.fillFormTx(page, genesisWallet);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();
    await page.waitForTimeout(500);

    await page.reload();
    await getByAriaLabel(page, 'Sign btn tx card').click();

    await page.waitForTimeout(2000);

    await E2ETestUtils.signMessageFuelWallet({
      page,
      fuelWalletTestHelper,
    });
    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();
  }

  static async returnFundsToGenesisWalletWithPasskey(
    page: Page,
    genesisWallet: WalletUnlocked,
  ) {
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
    await TransactionTestService.fillFormTx(page, genesisWallet);

    await expect(
      getByAriaLabel(page, 'Create Transaction Primary Action'),
    ).toBeEnabled();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();

    await page.waitForTimeout(1000);

    await expect(page.getByText('You signed')).toBeVisible();

    const completedCount = await page.getByText('Completed').count();
    expect(completedCount).toBe(2);
  }

  static async fillFormChangeAsset(
    page: Page,
    addr: string,
    index?: number,
  ): Promise<TxTestResponse> {
    const transactionName = 'transactionName';
    const amount = '0.00001';
    const option = index ? index - 1 : 0;

    await page.locator('#transaction_name').fill(transactionName);
    await getByAriaLabel(
      page,
      `Autocomplete Recipient Address ${index}`,
    ).click();
    await page.waitForTimeout(500);
    expect(page.getByText('addr1 -')).toBeVisible();
    expect(page.getByText('addr2 -')).toBeVisible();
    await page.waitForTimeout(500);
    await getByAriaLabel(page, `Autocomplete Recipient Address ${index}`).fill(
      addr,
    );
    await page.locator('[data-testid="transaction_asset"]').click();
    await page.waitForTimeout(500);
    await page.locator(`#option-${option}`).click();
    await page.waitForTimeout(2000);
    await page.locator('[data-testid="transaction_amount"]').fill(amount);
    await page.waitForTimeout(500);

    return { transactionName, recipientAddr: addr, amount };
  }
}

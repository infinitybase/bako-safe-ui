import { getByAriaLabel } from '@fuels/playwright-utils';
import { expect, Page } from '@playwright/test';

interface TxTestResponse {
  transactionName: string;
  recipientAddr: string;
  amount: string;
}

export class TransactionTestService {
  static async fillFormTx(page: Page): Promise<TxTestResponse> {
    const transactionName = 'transactionName';
    const recipientAddr =
      '0x0b9554fc251be0e3eb2b61266e827824ac49f66347629c4dc9c440de5752a992';
    const amount = '0.00001';

    await page.locator('#transaction_name').fill(transactionName);
    await getByAriaLabel(page, 'Autocomplete Recipient Address 1').fill(
      recipientAddr,
    );
    await page.locator('[data-testid="transaction_amount"]').fill(amount);
    await page.waitForTimeout(500);

    return { transactionName, recipientAddr, amount };
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
    //await expect(page.getByText('Not enough balance.')).toBeVisible();
    await expect(
      page.getByText('Not enough ETH to pay for transaction fee!'),
    ).toBeVisible();
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

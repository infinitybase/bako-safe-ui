import { getByAriaLabel } from '@fuels/playwright-utils';
import { Page } from '@playwright/test';

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
    await page.locator('#transaction_amount').fill(amount);
    await page.waitForTimeout(500);

    return { transactionName, recipientAddr, amount };
  }

  static async onlyCreateTx(page: Page) {
    await getByAriaLabel(page, 'Menu select mode create tx').click();
    await getByAriaLabel(page, 'Menu item create tx').click();

    await getByAriaLabel(page, 'Create Transaction Primary Action').click();
  }
}

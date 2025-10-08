import { Page } from '@playwright/test';

export class NewHandleService {
  static async getValueNewHandle(page: Page) {
    await page.locator('text=Estimated total').waitFor({ state: 'visible' });
    const estimatedTotal = await page.evaluate(() => {
      return (
        document
          .querySelector(
            'div.chakra-stack.css-10t90fk p.chakra-text.css-io0ltg:nth-of-type(2)',
          )
          ?.textContent?.trim() ?? ''
      );
    });
    const rawValue = parseFloat(estimatedTotal.replace('ETH', '').trim());
    const value = parseFloat((rawValue + 0.0000002).toFixed(9));

    return value;
  }
}

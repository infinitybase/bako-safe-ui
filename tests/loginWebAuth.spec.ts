import { getByAriaLabel, hasText, test } from '@fuels/playwright-utils';
import { expect } from '@playwright/test';

import { mockRouteAssets } from './utils/helpers';
import { AuthTestService } from './utils/services/auth-service';
import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('loginWebAuth', () => {
  test('create acc and login', async ({ page }) => {
    //await AuthService.loginWalletConnection(page, context, extensionId);
    await mockRouteAssets(page);

    const { username } = await AuthTestService.loginAuth(page);

    await hasText(page, /Welcome to Bako Safe!/);

    await getByAriaLabel(page, 'Close window').click();

    await page.goto('/home');

    await getByAriaLabel(page, 'Dropdown header').click();
    await expect(page.getByText('Disconnect')).toBeVisible();

    await getByAriaLabel(page, 'Disconnect').click();
    const welcomeText = page.locator('text=Welcome to Bako Safe');
    await expect(welcomeText).toBeVisible();

    await getByAriaLabel(page, 'Username').clear();
    await getByAriaLabel(page, 'Username').fill(username);
    await page.locator('body').click();
    await page.waitForTimeout(300);

    await getByAriaLabel(page, 'Login account')
      .filter({ has: page.locator(':visible') })
      .click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);
  });
});

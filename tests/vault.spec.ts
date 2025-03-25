import { expect, getByAriaLabel, hasText, test } from '@fuels/playwright-utils';

import { AuthTestService } from './utils/services/auth-service';
import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('Vaults', () => {
  test('create vault 1/1', async ({ page }) => {
    //await AuthTestService.loginWalletConnection(page, context, extensionId);
    await AuthTestService.loginAuth(page);

    // Check if the user is logged in and go to Home page
    await hasText(page, /Welcome to Bako Safe!/);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    // create vault 1/1
    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);

    await page.locator('#vault_name').fill('vaultName');
    await expect(page.getByText('This vault is available')).toBeVisible();
    await page.locator('#vault_name').clear();
    await page.locator('#vault_name').fill('Personal vault');
    await expect(
      page.getByText('Vault name already exists in this workspace'),
    ).toBeVisible();
    await page.locator('#vault_name').clear();
    await expect(page.getByText('Name is required')).toBeVisible();
    await page.locator('#vault_name').fill('vaultName');

    await page.locator('#vault_description').fill('vaultDescription');

    await getByAriaLabel(page, 'Create Vault Primary Action').click();

    await getByAriaLabel(page, 'Create Vault Primary Action').click();

    await page.locator('.loading-spinner').waitFor({ state: 'hidden' });

    await getByAriaLabel(page, 'Create Vault Secundary Action').click();
    await page.waitForTimeout(300);

    const hasClose = page.locator('[aria-label="Close window"]');
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }

    const elements = page.locator('text="vaultName"');
    const count = await elements.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
      await expect(elements.nth(i)).toBeVisible();
    }
    await expect.soft(page.getByText('vaultDescription')).toBeVisible();
    await expect(page).toHaveURL(/workspace/);
  });

  test('create vault 2/2', async ({ page }) => {
    //await AuthTestService.loginWalletConnection(page, context, extensionId);
    const wrongAdr = '0xe77A8531c3EEEE448B7536dD9B44cc9B841269bE';
    const adr2 =
      '0x5cD19FF270Db082663993D3D9cF6342f9869491AfB06F6DC885B1794DB261fCB';

    await AuthTestService.loginAuth(page);
    await hasText(page, /Welcome to Bako Safe!/);

    await page.locator('[aria-label="Close window"]').click();
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);
    await page.locator('#vault_name').fill('vaultName2');

    await getByAriaLabel(page, 'Create Vault Primary Action').click();
    await page.waitForTimeout(500);

    await page.getByText('Add more addresses').click();

    await page.locator('id=Address 2').fill(wrongAdr); //endereço meta mask
    await page.waitForTimeout(1000);
    await expect(page.getByText('Invalid address')).toBeVisible();
    await page.locator('#Address\\ 2').clear();

    await page.locator('#Address\\ 2').fill(adr2); //endereço meta mask

    await page
      .getByRole('textbox', { name: 'Select min signatures vault form' })
      .click({ force: true });

    await page.waitForTimeout(500);
    await page.getByText('2', { exact: true }).click();
    await page.waitForTimeout(200);

    await getByAriaLabel(page, 'Create Vault Primary Action').click();
    await page.waitForTimeout(2000);
    await page.locator('.loading-spinner').waitFor({ state: 'hidden' });

    await getByAriaLabel(page, 'Create Vault Secundary Action').click();
    await page.waitForTimeout(300);

    const hasClose = page.locator('[aria-label="Close window"]');
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }

    const vaultsTitle = await page.getByText('vaultName2');
    const number = await vaultsTitle.count();
    expect(number).toBe(3);
    for (let i = 0; i < number; i++) {
      await expect(vaultsTitle.nth(i)).toBeVisible();
    }
  });
});

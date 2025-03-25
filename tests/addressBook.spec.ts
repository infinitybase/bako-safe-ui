import { expect, getByAriaLabel, test } from '@fuels/playwright-utils';

import { modalCloseTest } from './utils/helpers';
import { AuthTestService } from './utils/services/auth-service';
import { E2ETestUtils } from './utils/setup';

await E2ETestUtils.downloadFuelExtension({ test });

test.describe('AddressBook', () => {
  test('crud address book', async ({ page }) => {
    const addressTitle = 'Novo endereço';
    const addressTitleEdited = 'Endereço editado';

    //await AuthService.loginWalletConnection(page, context, extensionId);
    await AuthTestService.loginAuth(page);

    await page.waitForSelector('text=Welcome to Bako Safe!', {
      timeout: 30000,
    });

    await getByAriaLabel(page, 'Close window').click();

    await page.goto('/home');

    await page.getByText('Address book', { exact: true }).click();
    await expect(page).toHaveURL(/address-book/);

    // add new adb
    const adresbookForm = page.getByRole('button', {
      name: 'Add new favorite',
    });
    await adresbookForm.click();
    await modalCloseTest(page, adresbookForm);

    await page.getByLabel('Name or Label').fill(addressTitle);
    await page.getByLabel('Name or Label').clear();
    await expect(page.getByText('Name is required')).toBeVisible();

    await page.getByLabel('Name or Label').fill(addressTitle);
    await page
      .getByLabel('Address', { exact: true })
      .fill(
        '0x03aAb6b3c770E134908ba0CDE7BFAD7F22b80138e90f2C0d3948aB3Ebd0659C8',
      );

    await getByAriaLabel(page, 'Create adb').click();
    await page.waitForLoadState('networkidle', { timeout: 2000 });
    await page.waitForTimeout(2000);
    await expect(page.getByText(addressTitle)).toBeVisible();

    //edit adb
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('text=Edit address')).toBeVisible();

    await page.getByLabel('Name or Label').clear();
    await page.getByLabel('Name or Label').fill(addressTitleEdited);
    await getByAriaLabel(page, 'Edit adb').click();

    await page.waitForLoadState('networkidle', { timeout: 2000 });
    await page.waitForTimeout(2000);
    await expect(page.getByText(addressTitleEdited)).toBeVisible();

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);

    // listing adb created
    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);
    await page.locator('#vault_name').fill('vaultName2');
    await getByAriaLabel(page, 'Create Vault Primary Action').click();
    await page.waitForTimeout(500);

    await page.getByText('Add more addresses').click();
    await page.waitForTimeout(200);
    await expect(page.getByText(addressTitleEdited)).toBeVisible();
    await page.locator('[aria-label="Close window"]').click();

    // delete adb
    await page.getByText('Address book', { exact: true }).click();
    await expect(page).toHaveURL(/address-book/);
    await page.getByRole('button', { name: 'Delete' }).click();
    await getByAriaLabel(page, 'Delete adb').click();
    await expect(page.getByText(addressTitleEdited)).not.toBeVisible();
  });
});

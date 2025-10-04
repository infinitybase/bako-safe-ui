import { expect, getByAriaLabel } from '@fuels/playwright-utils';
import test from '@playwright/test';

import { mockRouteAssets, modalCloseTest } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';

test.describe.parallel('AddressBook', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('crud address book', async ({ page }) => {
    const addressTitle = 'Novo endereço';
    const addressTitleEdited = 'Endereço editado';

    await mockRouteAssets(page);

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

    await page.getByLabel('Name or Label').nth(1).fill(addressTitle);
    await page.getByLabel('Name or Label').nth(1).clear();
    await expect(page.getByText('Name is required.').nth(1)).toBeVisible();

    await page.getByLabel('Name or Label').nth(1).fill(addressTitle);
    await page
      .getByLabel('Address', { exact: true })
      .nth(1)
      .fill(
        '0x03aAb6b3c770E134908ba0CDE7BFAD7F22b80138e90f2C0d3948aB3Ebd0659C8',
      );

    await page.getByLabel('Create address book').nth(1).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(addressTitle)).toBeVisible();

    //edit adb
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('text=Edit address')).toBeVisible();

    await page.getByLabel('Name or Label').nth(1).clear();
    await page.getByLabel('Name or Label').nth(1).fill(addressTitleEdited);
    await getByAriaLabel(page, 'Edit address book').click();

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

    // trying create duplicate adb
    await page.getByText('Address book', { exact: true }).click();
    await expect(page).toHaveURL(/address-book/);
    const adrFormDuplicated = page.getByRole('button', {
      name: 'Add new favorite',
    });
    await adresbookForm.click();
    await modalCloseTest(page, adrFormDuplicated);
    await page.getByLabel('Name or Label').nth(1).fill(addressTitleEdited);
    await page
      .getByLabel('Address', { exact: true })
      .nth(1)
      .fill(
        '0x03aAb6b3c770E134908ba0CDE7BFAD7F22b80138e90f2C0d3948aB3Ebd0659C8',
      );
    await page.getByLabel('Create address book').nth(1).click();
    await page.waitForLoadState('networkidle', { timeout: 2000 });
    await page.waitForTimeout(2000);
    await expect(page.getByText('Duplicated label').nth(1)).toBeVisible();
    await page.getByLabel('Name or Label').nth(1).fill('duplicated test');
    await page.getByLabel('Create address book').nth(1).click();
    await page.waitForLoadState('networkidle', { timeout: 2000 });
    await page.waitForTimeout(2000);
    await expect(
      page
        .locator('.chakra-form__helper-text')
        .getByText('Duplicated address')
        .nth(1),
    ).toBeVisible();

    // add a adb with invalid address
    await page.getByLabel('Name or Label').nth(1).fill('duplicated test');
    await page
      .getByLabel('Address', { exact: true })
      .nth(1)
      .fill('invalid address');
    await expect(
      page.getByText('This address can not receive assets from Bako.').nth(1),
    ).toBeVisible();

    await page.getByText('Cancel').nth(1).click();

    // delete adb
    // await page.getByText('Address book', { exact: true }).click();
    //await expect(page).toHaveURL(/address-book/);
    await page.getByRole('button', { name: 'Delete' }).click();
    await getByAriaLabel(page, 'Delete adb').click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(addressTitleEdited)).not.toBeVisible();
  });
});

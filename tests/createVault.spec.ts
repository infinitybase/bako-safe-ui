import {
  expect,
  FuelWalletTestHelper,
  getByAriaLabel,
  hasText,
  test,
} from '@fuels/playwright-utils';
import { aggregateInputsAmountsByAssetAndOwner, WalletUnlocked } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';

import { E2ETestUtils } from './utils/setup';
import { modalCloseTest } from './utils/helpers';

await E2ETestUtils.downloadFuelExtension({ test });

test('webauthn', async ({ page }) => {
  await E2ETestUtils.enablePasskey({ page });

  // Navegue até a página inicial
  await page.goto('/');
  await page.bringToFront();

  // select text "Welcome to Bako Safe"
  const welcomeText = page.locator('text=Welcome to Bako Safe');
  await expect(welcomeText).toBeVisible();

  // select input by id
  const usernameInput = page.locator('#fixed_id');
  console.log('Clicou no input', usernameInput.focus());
  const name = `teste${Date.now()}`;
  await usernameInput.fill(name); // type 'guilhermemr'
  await expect(usernameInput).toHaveValue(name);

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

  // Check if the user is logged in and go to Home page
  await hasText(page, /Welcome to Bako Safe!/);

  await page.locator('[aria-label="Close window"]').click();
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page).toHaveURL(/home/);

  await page.getByRole('button', { name: 'Create vault' }).click();
  await page.waitForTimeout(1000);

  await page.locator('#vault_name').fill('vaultName');
  await expect(page.getByText('This vault is available')).toBeVisible();
  await page.locator('#vault_name').clear();
  await page.locator('#vault_name').fill('Personal vault');
  await expect(
    page.getByText('Vault name already exists in this workspace')).toBeVisible();
  await page.locator('#vault_name').clear();
  await expect(page.getByText('Name is required')).toBeVisible();
  await page.locator('#vault_name').fill('vaultName');

  await page.locator('#vault_description').fill('vaultDescription');

  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Create Vault' }).click();

  await page.locator('.loading-spinner').waitFor({ state: 'hidden' });

  await page.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(300);
  await page.locator('[aria-label="Close window"]').click();



  const elements = page.locator('text="vaultName"');
  const count = await elements.count();
  expect(count).toBe(3);
  for (let i = 0; i < count; i++) {
    await expect(elements.nth(i)).toBeVisible();
  }
  //await expect.soft(page.getByText('vaultDescription')).toBeVisible();
  await expect(page).toHaveURL(/workspace/);

  //Criar vault 2/2

  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'Create vault' }).click();
  await page.waitForTimeout(1000);
  await page.locator('#vault_name').fill('vaultName2');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(500);

  await page.getByText('Add more addresses').click();
  await page
    .locator('id=Address 2')
    .fill('0xe77A8531c3EEEE448B7536dD9B44cc9B841269bE'); //endereço meta mask
  await page.waitForTimeout(1000);
  await expect(page.getByText('Invalid address')).toBeVisible();
  await page.locator('#Address\\ 2').clear();
  await page
    .locator('#Address\\ 2')
    .fill('0x5cD19FF270Db082663993D3D9cF6342f9869491AfB06F6DC885B1794DB261fCB'); //endereço meta mask
  await page.getByRole('button', { name: 'Create Vault' }).click()
  await page.waitForTimeout(2000)

  {/* const vaultsTitle = await page.getByText('vaultName2')
  const number = await vaultsTitle.count();
  expect(number).toBe(3);
  for (let i = 0; i < number ; i++){
    await expect(vaultsTitle.nth(i)).toBeVisible()
  }
 */}

});

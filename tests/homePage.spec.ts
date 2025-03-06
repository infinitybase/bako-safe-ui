import {
  expect,
  FuelWalletTestHelper,
  getButtonByText,
  getByAriaLabel,
  hasText,
  test,
} from '@fuels/playwright-utils';
import { WalletUnlocked } from 'fuels';
import { launchTestNode } from 'fuels/test-utils';

import { E2ETestUtils } from './utils/setup';
import { modalCloseTest } from './utils/helpers';
import { breadcrumbs } from './utils/helpers';
import { txFilters } from './utils/helpers';
import { createVaults } from './utils/helpers';

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
  await hasText(page, /Welcome to Bako Safe!/);
  await page.locator('[aria-label="Close window"]').click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page).toHaveURL(/home/);

  //Criar 10 vaults
  //await createVaults(page, 'vaulteste')

  // Navega pelos Vaults
  await page.getByTestId('vaultstab').click();
  await expect(page).toHaveURL(/vault/);
  await page.getByRole('button', { name: 'Back home' }).click();
  await expect(page).toHaveURL(/home/);
  await page.getByTestId('vaultstab').click();
  await expect(page).toHaveURL(/vault/);

  //await backHome(page, 'Vaults')
  //Testar breadcrumbs - ajuda nos seletore

  //Acessa Transactions
  await page.getByText('Transactions', { exact: true }).click();
  await expect(page).toHaveURL(/transaction/);
  await txFilters(page);

  // Navega pela Address Book
  await page.getByText('Address book', { exact: true }).click();
  await expect(page).toHaveURL(/address-book/);

  await page.getByRole('button', { name: 'Back home' }).click();
  await expect(page).toHaveURL(/home/);
  await page.getByText('Address book', { exact: true }).click();

  // Adicionar um novo endereço no Address Book
  const adresbookForm = page.getByRole('button', { name: 'Add new favorite' });
  await adresbookForm.click();
  await modalCloseTest(page, adresbookForm);

  await page.getByLabel('Name or Label').fill('Novo Endereço');
  await page.getByLabel('Name or Label').clear();
  await expect(page.getByText('Name is required')).toBeVisible();
  await page.getByLabel('Name or Label').fill('Novo Endereço');
  await page
    .getByLabel('Address', { exact: true })
    .fill('0x03aAb6b3c770E134908ba0CDE7BFAD7F22b80138e90f2C0d3948aB3Ebd0659C8');
  await page.getByRole('button', { name: 'Add it' }).click();
  await page.waitForLoadState('networkidle',{timeout: 2000})
  await page.waitForTimeout(2000)

  await expect(page.getByText('Novo Endereço')).toBeVisible()

  //Copiar, editar e apagar adb  
  await page.getByRole('button', {name: 'Copy'}).click()

{/*) await page.getByRole('button', {name: 'Edit'}).click()
  await expect(page.locator('text=Edit address')).toBeVisible()
  await page.getByLabel('Name or Label').clear()
  await page.getByLabel('Name or Label').fill('endereço editado');
  await page.getByRole('button', {name: 'Edit'}).click(); */}

  await page.getByRole('button',{name: 'Delete'}).click()
  await page.getByRole('button', {name: 'Yes, delete it!'}).click()

  await page.getByText(name).nth(0).click()
  await page.getByText('Settings').click()
});

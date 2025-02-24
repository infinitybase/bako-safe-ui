import { expect, getByAriaLabel, hasText, test} from '@fuels/playwright-utils';
import { E2ETestUtils } from './utils/setup';
import { modalCloseTest } from './utils/helpers';
import { txFilters } from './utils/helpers';
import { settingsButtons } from './utils/helpers';
import { newTabVerification } from './utils/helpers';

const vaultName = 'Teste123';

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

  //Meu teste
  await page.waitForTimeout(2000)
  await hasText(page, /Welcome to Bako Safe!/);
  const closeWindow = page.locator('[aria-label="Close window"]');
  await closeWindow.click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page).toHaveURL(/home/);
  await page
    .locator(
      'div[title="This is your first vault. It requires a single signer (you) to execute transactions; a pattern called 1-of-1"]',
    )
    .click();

  //Copiar endereço do vault
  await page.getByRole('button', { name: 'Copy' }).nth(0).click();

  //Criar vault dentro da tab de Vaults
  await page.getByRole('button', { name: 'Vault' }).click();
  await page.getByRole('button', { name: 'Create new vault' }).click();
  await page.waitForTimeout(1000);
  await page.locator('#vault_name').fill(vaultName);
  await page.locator('#vault_description').fill('vaultDescription');
  await page.getByRole('button', { name: 'Continue' }).click();

  {
    /*await page.getByText('Add more addresses').click()

    Copia e cola nao funciona

  await page.getByTestId("Address 2-label").click()
  await page.keyboard.press('Command + v') */
  }

  await page.getByRole('button', { name: 'Create Vault' }).click();
  await page.locator('.loading-spinner').waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Done' }).click();

  await closeWindow.nth(0).click();
  await page.waitForTimeout(1000);

  const elements = page.getByText(vaultName);
  const count = await elements.count();
  expect(count).toBe(3);
  //Cria um loop
  for (let i = 0; i < count; i++) {
    await expect(elements.nth(i)).toBeVisible();
  }

  //wait expect.soft(page.getByText('vaultDescription')).toBeVisible()
  await expect(page).toHaveURL(/workspace/);

  //Pesquisar vault
  await page.getByRole('button', { name: 'Vault' }).click();
  await page.getByText('search').fill('personal');
  await page.getByText('Personal Vault', { exact: false }).click();

  
  const explorer = page.getByRole('button',{name: 'Explorer'})
  await newTabVerification(page, explorer , 'app-mainnet.fuel.network' )

  await page.getByText('Balance', { exact: true }).click();
  await expect(page).toHaveURL(/balance/);

  await page.getByText('Transactions').click();
  await expect(page).toHaveURL(/transactions/);
  await txFilters(page);

  await page.getByText('Settings').nth(1).click();
  await expect(page).toHaveURL(/settings/);
  const addAssets = page.getByRole('button', { name: 'Add Assets' });
  await addAssets.click();
  await modalCloseTest(page, addAssets);

  const bridge = page.getByText('Bridge')
  await newTabVerification(page, bridge, "https://app-mainnet.fuel.network/bridge")
  await page.getByText('Deposit', { exact: true }).click();
  await closeWindow.nth(0).click();
  await page.waitForTimeout(1000);


  await page.getByRole('button', { name: 'Copy' }).nth(1).click();

  //add ao adressBook
  const addtoAdressBook = page.getByRole('button', {
    name: 'Add to Address Book',
  });
  await addtoAdressBook.click();
  await modalCloseTest(page, addtoAdressBook);
  await page.getByText('Name or Label').fill('Signatario1');
  await page.waitForLoadState('load')
  await page.getByRole('button', { name: 'Add it' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByText('Signatario1')).toBeVisible();

  await settingsButtons(page, 'Spend limit');
  await settingsButtons(page, 'Recovery');
  await settingsButtons(page, 'Add other tokens');

  {
    /* 
    Ajuda para selecionar o Toast
    
    await expect(page.locator('#coming-soon-toast')).toBeVisible()
  await page.locator('#coming-soon-toast').waitFor({ state: 'hidden', timeout: 10000});
  await page.locator('#coming-soon-toast').isHidden()*/
  }
});




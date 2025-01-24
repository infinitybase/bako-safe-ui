import { expect, getByAriaLabel, hasText, test } from '@fuels/playwright-utils';

import { E2ETestUtils } from './utils/setup';
import { modalCloseTest } from './utils/helpers';
import { txFilters } from './utils/helpers';

const vaultName = 'Teste123';

test.only('webauthn', async ({ page }) => {
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
  await page.waitForTimeout(1000);
  await hasText(page, /Welcome to Bako Safe!/);
  const closeWindow = page.locator('[aria-label="Close window"]');
  await closeWindow.click();
  await page.waitForTimeout(1000);
  await page.getByText('Settings').nth(1).click();
  await expect(page).toHaveURL(/settings/);

  await page.getByText('Spend limit').click();
  await page.getByRole('button', { name: 'Notify me when available' }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator('#coming-soon-toast')).toBeVisible();
  await page
    .locator('#coming-soon-toast')
    .waitFor({ state: 'hidden', timeout: 10000 });
  await page.locator('#coming-soon-toast').isHidden();
});

// helpers.js

import { expect } from '@fuels/playwright-utils';
import { Page } from '@playwright/test';

export async function modalCloseTest(page, element) {
  await page.locator('[aria-label="Close window"]').click();
  await element.click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await element.click();
}

export async function breadcrumbs(page, tab) {
  await expect(page.getByRole('li', { name: tab })).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page).toHaveURL(/home/);
}

export async function txFilters(page) {
  await page.getByText('Completed').click();
  await page.getByText('Declined').click();
  await page.getByText('Pending').click();
  //await page.getByText('Outgoing').click()
  //await page.getByText('Incoming').click()
}

export async function settingsButtons(page, text) {
  await page.getByText(text).click();
  await page.getByRole('button', { name: 'Notify me when available' }).click();
}

export async function createVaults(page, baseVaultName) {
  for (let i = 1; i <= 10; i++) {
    const vaultName = `${baseVaultName} ${i}`;
    console.log(`Criando vault: ${vaultName}`);

    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);
    await page.locator('#vault_name').fill(vaultName);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Create Vault' }).click();
    await page.locator('.loading-spinner').waitFor({ state: 'hidden' });
    await page.getByRole('button', { name: 'Done' }).click();

    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForTimeout(500);
  }
}

export async function newTabVerification(page: Page, buttonSelector, urlEsperada: string) {
  const [novaAba] = await Promise.all([
      page.context().waitForEvent('page'), // Captura a nova aba
      await buttonSelector.click()// Clica no botão que abre a nova aba
  ]);

  await novaAba.waitForLoadState(); 

  const novaURL = novaAba.url(); 
  console.log('Nova aba URL:', novaURL);

  expect(novaURL).toContain(urlEsperada);
}


// helpers.js
import { expect, getByAriaLabel } from '@fuels/playwright-utils';
import { Page } from '@playwright/test';
import fs from 'fs';

export enum TestNetworks {
  local = 'Local',
  ignition = 'Ignition',
  fuel_sepolia_testnet = 'Fuel Sepolia Testnet',
}

export enum TestAssets {
  ETH = '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
  UNK = '0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7',
}

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

export async function newTabVerification(
  page: Page,
  buttonSelector,
  urlEsperada: string,
) {
  const [novaAba] = await Promise.all([
    page.context().waitForEvent('page'), // Captura a nova aba
    await buttonSelector.click(), // Clica no botão que abre a nova aba
  ]);

  await novaAba.waitForLoadState();

  const novaURL = novaAba.url();
  console.log('Nova aba URL:', novaURL);

  expect(novaURL).toContain(urlEsperada);
}

export async function disconnect(page: Page) {
  await getByAriaLabel(page, 'Dropdown header').click();
  await page.waitForTimeout(300);
  await getByAriaLabel(page, 'Disconnect').click();
}

export async function selectNetwork(page: Page, network: TestNetworks) {
  await getByAriaLabel(page, 'Select networks').click();
  await page.getByText(network).click();
  await page.waitForTimeout(1000);
}

export async function mockRouteAssets(page: Page) {
  const mockVerifiedAssets = JSON.parse(
    fs.readFileSync('tests/utils/mocks/verified-assets.json', 'utf-8'),
  );

  await page.route(
    'https://verified-assets.fuel.network/assets.json',
    async (route) => {
      await route.fulfill({ json: mockVerifiedAssets });
    },
  );
}

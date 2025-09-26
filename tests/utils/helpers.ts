// helpers.js
import {
  expect,
  FuelWalletTestHelper,
  getByAriaLabel,
} from '@fuels/playwright-utils';
import { Locator, Page } from '@playwright/test';
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

export async function returnFundsToGenesisWallet(config: {
  fuelWalletTestHelper: FuelWalletTestHelper;
  genesisAddress: string;
}) {
  const { fuelWalletTestHelper, genesisAddress } = config;

  const extensionPage = fuelWalletTestHelper.getWalletPage();

  await extensionPage.waitForTimeout(2000);

  const isZeroBalance = await extensionPage
    .locator('p[data-account-name="Account 1"]')
    .evaluate((el) => {
      const text = el.textContent ?? '';
      const value = parseFloat(text.replace('$', '').trim());
      return value === 0;
    });

  if (isZeroBalance) {
    console.log('No ETH balance found to return to genesis wallet.');
    return;
  }

  await extensionPage.getByRole('button', { name: 'Send Button' }).click();
  await extensionPage.getByRole('combobox', { name: 'Select Asset' }).click();
  await extensionPage
    .getByRole('menuitem', { name: 'Ethereum Ethereum ETH' })
    .click();
  await extensionPage
    .getByRole('textbox', { name: 'Address Input' })
    .fill(genesisAddress);
  await extensionPage.getByRole('button', { name: 'Max' }).click();

  await extensionPage.waitForTimeout(1500);
  const reviewButton = extensionPage.getByRole('button', { name: 'Review' });
  await expect(reviewButton).toBeEnabled();
  await reviewButton.click();

  await extensionPage.waitForTimeout(1500);
  const submitButton = extensionPage.getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(
    extensionPage.getByRole('dialog').getByText('Send', { exact: true }),
  ).toBeVisible({
    timeout: 8000,
  });
  await expect(extensionPage.getByText('success')).toBeVisible();
}

export async function modalCloseTest(page: Page, element: Locator) {
  await page.getByLabel('Close window').nth(1).click();
  await element.click();
  await page.getByText('Cancel').nth(1).click();
  await element.click();
}

export async function breadcrumbs(page: Page, tab: string) {
  await expect(page.getByRole('li', { name: tab })).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page).toHaveURL(/home/);
}

export async function txFilters(page: Page) {
  await page.getByText('Completed').click();
  await page.getByText('Declined').click();
  await page.getByText('Pending').click();
  //await page.getByText('Outgoing').click()
  //await page.getByText('Incoming').click()
}

export async function settingsButtons(page: Page, text: string) {
  await page.getByText(text).click();
  await page.getByRole('button', { name: 'Notify me when available' }).click();
}

export async function createVaults(page: Page, baseVaultName: string) {
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
  buttonSelector: Locator,
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

import { expect, getByAriaLabel, hasText } from '@fuels/playwright-utils';
import test from '@playwright/test';

import { disconnect, mockRouteAssets, selectNetwork } from '../utils/helpers';
import { AuthTestService } from '../utils/services/auth-service';
import { NewHandleService } from '../utils/services/new-handle-service';
import { VaultTestService } from '../utils/services/vault-service';
import { E2ETestUtils } from '../utils/setup';

test.describe.parallel('vaults webauth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('create vault 1/1', async ({ page }) => {
    await mockRouteAssets(page);
    const { genesisWallet } = await AuthTestService.loginAuth(page);

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
      page.getByText('Vault name already exists in this workspace'),
    ).toBeVisible();
    await page.locator('#vault_name').clear();

    await page.goto('/home');
    const { vaultAddress } = await VaultTestService.createVault(page);

    await expect(page).toHaveURL(/workspace/);

    await test.step('verify balance', async () => {
      await selectNetwork(page);

      const amount = '0.00001';

      await E2ETestUtils.fundVault({
        genesisWallet,
        vaultAddress,
        amount,
      });

      await page.reload();
      await page
        .getByRole('paragraph')
        .filter({ hasText: 'Update' })
        .getByRole('img')
        .first()
        .click();
      await page.locator('.chakra-icon.css-bokek7').click();

      await expect(page.getByRole('heading', { name: 'USD' })).toBeVisible();
      await expect(page.getByText(`${amount} ETH`)).toBeVisible();
    });
  });

  test('create vault 2/2', async ({ page }) => {
    await mockRouteAssets(page);
    const adr2 =
      '0x5cD19FF270Db082663993D3D9cF6342f9869491AfB06F6DC885B1794DB261fCB';

    const { genesisWallet } = await AuthTestService.loginAuth(page);
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

    await test.step('wrong and empty address', async () => {
      await expect(page.getByText('Empty address')).toBeVisible();

      await page.locator('#Address\\ 2').fill('invalid address');
      await expect(page.getByText('Invalid address')).toBeVisible();

      await page.locator('#Address\\ 2').clear();
    });

    await page.goto('/home');
    const { vaultAddress } = await VaultTestService.createVaulMultiSigns(
      page,
      [adr2],
      2,
    );

    await test.step('verify balance', async () => {
      await selectNetwork(page);

      const amount = '0.00001';

      await E2ETestUtils.fundVault({
        genesisWallet,
        vaultAddress,
        amount,
      });

      await page.reload();
      await page
        .getByRole('paragraph')
        .filter({ hasText: 'Update' })
        .getByRole('img')
        .first()
        .click();
      await page.locator('.chakra-icon.css-bokek7').click();

      await expect(page.getByRole('heading', { name: 'USD' })).toBeVisible();
      await expect(page.getByText(`${amount} ETH`)).toBeVisible();
    });
  });

  test.only('Should prevent adding vault addresses or handles as signers when creating multisig vault', async ({
    page,
    context,
  }) => {
    await page.goto('https://safe.bako.global/');
    const { genesisWallet } = await AuthTestService.loginAuth(page);
    await getByAriaLabel(page, 'Close window').click();

    await selectNetwork(page);

    let handleAddress: string;
    const handle = `automation${Date.now()}`;
    console.log('new handle: ', handle);

    await test.step('Create handle for personal vault in Bako ID', async () => {
      const pageId = await context.newPage();
      await pageId.goto('https://app.bako.id/');
      await E2ETestUtils.setupPasskey({ page: pageId });

      await test.step('Fill handle creation form and submit', async () => {
        await pageId
          .getByRole('textbox', { name: 'Search for an available Handle' })
          .fill(handle);
        await pageId.getByRole('button', { name: 'Continue' }).click();

        await expect(pageId.getByText(handle)).toBeVisible();
        await expect(pageId.getByText('Handles0.001 ETH')).toBeVisible();

        const value = await NewHandleService.getValueNewHandle(pageId);

        await test.step('Connect with Bako Safe and fund vault', async () => {
          try {
            await pageId
              .getByRole('button', { name: 'Connect Wallet' })
              .click();
            await pageId.getByLabel('Connect to Bako Safe').click();
          } catch {
            await pageId
              .getByRole('button', { name: 'Connect Wallet' })
              .nth(1)
              .click();
            await pageId.getByLabel('Connect to Bako Safe').click();
          }

          const popupBako = await pageId.waitForEvent('popup');

          await popupBako.waitForEvent('close');
          await pageId.waitForTimeout(1500);
          handleAddress = await pageId
            .locator('input[name="resolver"]')
            .inputValue();

          await E2ETestUtils.fundVault({
            genesisWallet,
            vaultAddress: handleAddress,
            amount: value.toString(),
          });
          await pageId.reload();
          await pageId.waitForTimeout(500);
        });

        await pageId
          .getByRole('button', { name: 'Confirm Transaction' })
          .click();

        await pageId
          .getByLabel('Bako ID Terms Of Use Agreement')
          .locator('div')
          .filter({ hasText: '1. The Bako IDThe “Bako ID”' })
          .nth(2)
          .evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });

        await pageId.getByRole('button', { name: 'Accept' }).click();

        const popupBako = await pageId.waitForEvent('popup');
        await popupBako
          .getByRole('button', { name: 'Menu select mode create tx' })
          .click();
        await popupBako
          .getByRole('menuitem', { name: 'Menu item create tx' })
          .click();
        await popupBako
          .getByRole('button', { name: 'Create Transaction Primary' })
          .click();
        await popupBako.close();

        await page.reload();
        await getByAriaLabel(page, 'Sign btn tx card').click();

        await expect(page.getByLabel('BID Asset Card')).toBeVisible();
      });
    });

    await test.step('Navigate to Bako Safe and start vault creation', async () => {
      await page.goto('https://safe.bako.global/home');
      await disconnect(page);
      await AuthTestService.loginAuth(page, genesisWallet);
      await mockRouteAssets(page);

      await hasText(page, /Welcome to Bako Safe!/);

      await page.locator('[aria-label="Close window"]').click();
      await page.getByRole('button', { name: 'Home' }).click();
      await selectNetwork(page);
      await expect(page).toHaveURL(/home/);

      await page.getByRole('button', { name: 'Create vault' }).click();
      await page.waitForTimeout(1000);
      await page.locator('#vault_name').fill('vaultName2');

      await getByAriaLabel(page, 'Create Vault Primary Action').click();
      await page.waitForTimeout(500);

      await page.getByText('Add more addresses').click();

      await test.step('Attempt to add raw vault address as signer (should be blocked)', async () => {
        await expect(page.getByText('Empty address')).toBeVisible();

        await page.locator('#Address\\ 2').fill(handleAddress);
        await expect(
          page.getByText('You cannot add a vault as a signer'),
        ).toBeVisible();

        await page.locator('#Address\\ 2').clear();
        await expect(
          page.getByText('You cannot add a vault as a signer'),
        ).not.toBeVisible();
      });

      await test.step('Attempt to add vault handle as signer (should be blocked)', async () => {
        await page.locator('#Address\\ 2').fill(`@${handle}`);

        await expect(
          page.getByText('You cannot add a vault as a signer'),
        ).toBeVisible();
      });
    });
  });
});

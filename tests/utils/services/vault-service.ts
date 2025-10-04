import { getByAriaLabel } from '@fuels/playwright-utils';
import { Page } from '@playwright/test';
import { WalletUnlocked } from 'fuels';

import { TestAssets } from '../helpers';
import { E2ETestUtils } from '../setup';

interface VaultTestResponse {
  vaultName: string;
  vaultDescription: string;
  vaultAddress: string;
}

export class VaultTestService {
  static async createVault(page: Page): Promise<VaultTestResponse> {
    // create vault 1/1
    const vaultName = 'vaultName';
    const vaultDescription = 'vaultDescription';

    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);

    await page.locator('#vault_name').fill(vaultName);

    await page.locator('#vault_description').fill(vaultDescription);

    await getByAriaLabel(page, 'Create Vault Primary Action').click();
    await getByAriaLabel(page, 'Create Vault Primary Action').click();

    await getByAriaLabel(page, 'Create Vault Secundary Action').click();
    await page.waitForTimeout(500);

    const hasClose = page.locator('[aria-label="Close window"]');
    await page.waitForTimeout(500);
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }
    await page.waitForTimeout(1000);
    await page.getByText('vaultName').click();
    await page.waitForTimeout(500);
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }

    await getByAriaLabel(page, 'Sidebar Vault Address').click();
    await page.waitForTimeout(500);
    const handleAddress = await page.evaluateHandle(() =>
      navigator.clipboard.readText(),
    );

    const vaultAddress = await handleAddress.jsonValue();

    return { vaultName, vaultDescription, vaultAddress };
  }

  static async createVaulMultiSigns(
    page: Page,
    addresses: string[],
    numberSigners: number,
  ): Promise<VaultTestResponse> {
    // create vault 2/2
    const vaultName = 'vaultMultisigners';
    const vaultDescription = 'vaultDescription';

    await page.getByRole('button', { name: 'Create vault' }).click();
    await page.waitForTimeout(1000);

    await page.locator('#vault_name').fill(vaultName);

    await page.locator('#vault_description').fill(vaultDescription);

    await getByAriaLabel(page, 'Create Vault Primary Action').click();

    await getByAriaLabel(page, 'Add more addresses vault form').click();

    await addresses.map(async (adr, index) => {
      await page.locator(`id=Address ${index + 2}`).fill(adr);
      await page.waitForTimeout(500);
    });

    await page
      .getByRole('textbox', { name: 'Select min signatures vault form' })
      .click({ force: true });

    await page.waitForTimeout(500);
    await page.getByText(String(numberSigners), { exact: true }).click();
    await page.waitForTimeout(200);

    await getByAriaLabel(page, 'Create Vault Primary Action').click({
      timeout: 10000,
    });
    await page.waitForTimeout(1000);

    await getByAriaLabel(page, 'Create Vault Secundary Action').click({
      timeout: 10000,
    });
    await page.waitForTimeout(300);

    const hasClose = page.locator('[aria-label="Close window"]');
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }

    await page.reload();
    await page.waitForTimeout(1000);
    const vaultDiv = page.getByText('vvaultMultisignersSignersRoleOwner');
    if (await vaultDiv.isVisible()) {
      await vaultDiv.click();
    }
    await page.waitForTimeout(1500);
    if (await hasClose.isVisible()) {
      await hasClose.click();
    }
    await page.getByRole('button', { name: 'Sidebar Vault Address' }).click();
    const vaultAddress = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    return { vaultName, vaultDescription, vaultAddress };
  }

  static async addFundVault(
    page: Page,
    vaultAddress: string,
    wallet: WalletUnlocked,
    reload: boolean = true,
    assetId: TestAssets = TestAssets.ETH,
  ) {
    await E2ETestUtils.fundVault({
      genesisWallet: wallet,
      vaultAddress,
      amount: '0.0000499',
      assetId,
    });

    await page.waitForTimeout(1000);
    if (reload) await page.reload();
  }
}

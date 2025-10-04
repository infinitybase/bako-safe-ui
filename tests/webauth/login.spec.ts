import { getByAriaLabel, hasText } from '@fuels/playwright-utils';
import test, { expect } from '@playwright/test';

import { AuthTestService } from '../utils/services/auth-service';

test.describe.parallel('create account and login webAuth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('login WebAuth', async ({ page }) => {
    const { username } = await AuthTestService.loginAuth(page);

    await hasText(page, /Welcome to Bako Safe!/);

    await getByAriaLabel(page, 'Close window').click();

    await page.goto('/home');

    await getByAriaLabel(page, 'Dropdown header').click();
    await expect(page.getByText('Disconnect')).toBeVisible();

    await getByAriaLabel(page, 'Disconnect').click();
    const welcomeText = page.locator('text=Welcome to Bako Safe');
    await expect(welcomeText).toBeVisible();

    await getByAriaLabel(page, 'Username').clear();
    await getByAriaLabel(page, 'Username').fill(username);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(300);

    await getByAriaLabel(page, 'Close window').click();

    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL(/home/);
  });
});

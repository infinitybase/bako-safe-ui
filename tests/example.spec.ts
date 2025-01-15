import { test, expect } from '@playwright/test';

test('load page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Bako Safe/);
});

test.only('select elements', async ({ page }) => {
  // Navegue até a página inicial
  await page.goto('/');

  // select text "Welcome to Bako Safe"
  const welcomeText = page.locator('text=Welcome to Bako Safe');
  await expect(welcomeText).toBeVisible();

  // select input by id
  const usernameInput = page.locator('#fixed_id');
  console.log('Clicou no input', usernameInput.focus());
  await usernameInput.fill('guilhermemr'); // type 'guilhermemr'
  await expect(usernameInput).toHaveValue('guilhermemr');
});

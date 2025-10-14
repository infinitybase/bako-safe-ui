import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './tests/utils/global-setup.ts',
  testDir: './tests',
  workers: 2,
  timeout: 220000,
  fullyParallel: true,
  expect: {
    timeout: 8000,
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { printSteps: true }]],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'http://localhost:5173',
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on-first-retry',
    actionTimeout: 5000,
  },
  webServer: {
    command: 'pnpm vite dev --mode test --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'login',
      testMatch: ['**/login.spec.ts'],
    },
    {
      name: 'home-page',
      testMatch: ['**/home-page.spec.ts'],
      dependencies: ['login'],
    },
    {
      name: 'vault',
      testMatch: ['**/vault.spec.ts'],
      dependencies: ['home-page'],
    },
    {
      name: 'addressBook',
      testMatch: ['**/addressBook.spec.ts'],
      dependencies: ['vault'],
    },
    {
      name: 'transaction',
      testMatch: ['**/transaction.spec.ts'],
      dependencies: ['addressBook'],
    },
    {
      name: 'api-token',
      testMatch: ['**/api-token.spec.ts'],
      dependencies: ['transaction'],
    },
    {
      name: 'swap',
      testMatch: ['**/swap.spec.ts'],
      dependencies: ['api-token'],
    },
    {
      name: 'bridge',
      testMatch: ['**/bridge.spec.ts'],
      dependencies: ['swap'],
    },
  ],
});

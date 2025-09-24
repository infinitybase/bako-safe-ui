import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './tests/utils/global-setup.ts',
  testDir: './tests',
  workers: 2,
  timeout: 220000,
  expect: {
    timeout: 6000,
  },
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
});

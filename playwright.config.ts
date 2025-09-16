import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './tests/utils/global-setup.ts',
  testDir: './tests',
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
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html',{open:'never'}]],
  use: {
    trace: 'on-first-retry',
    headless: false,
    launchOptions: {
      slowMo: 100,
    },
    contextOptions: {
      screen: {
        width: 1280,
        height: 720,
      }
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],

      },
    },
  ],
});
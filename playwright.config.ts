import { defineConfig, devices } from '@playwright/test';
import { env } from 'node:process';

export default defineConfig({
  testDir: './e2e',

  fullyParallel: true,

  forbidOnly: !!env.CI,

  retries: env.CI ? 2 : 0,

  workers: env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command:
      'VITE_APP_API_URL=http://localhost:8080 VITE_APP_ENABLE_API_MOCKING=true pnpm exec vp dev --host 0.0.0.0',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !env.CI,
  },
});

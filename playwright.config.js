import { defineConfig } from '@playwright/test';

const testUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const testCommand = process.env.TEST_COMMAND || 'npm run dev -- --host 127.0.0.1 --port 4173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: testUrl,
    channel: 'chrome',
    locale: 'ar-IQ',
    colorScheme: 'dark',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: testCommand,
    url: testUrl,
    reuseExistingServer: true,
    timeout: 30000
  }
});

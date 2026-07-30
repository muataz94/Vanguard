import { defineConfig } from '@playwright/test';

const testUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4175';
const testCommand = process.env.TEST_COMMAND || 'npm run preview -- --host 127.0.0.1 --port 4175';
const shouldManageServer = !process.env.TEST_BASE_URL || Boolean(process.env.TEST_COMMAND);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'line',
  use: {
    baseURL: testUrl,
    browserName: 'chromium',
    locale: 'ar-IQ',
    colorScheme: 'dark',
    trace: 'retain-on-failure'
  },
  webServer: shouldManageServer ? {
    command: testCommand,
    url: testUrl,
    reuseExistingServer: false,
    timeout: 30000
  } : undefined
});

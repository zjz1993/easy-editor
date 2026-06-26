import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: 'test',
  webServer: {
    command: 'pnpm start',   // 或 npm run dev
    url: 'http://localhost:5173',
    timeout: 120 * 1000,
    reuseExistingServer: false, // 👈 关键
  },
});

/**
 * Playwright Configuration
 * AETHER Simulated Framework — playwright-typescript
 *
 * Traceability:
 *   Framework: playwright-typescript
 *   Profile:   frameworks/playwright-typescript/FRAMEWORK_PROFILE.json
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // FIX-002-TEW-001 (FIARA TEW-RUN-20260802-001): Serial workers prevent Firefox
  // parallel network contention. Firefox navigation against saucedemo.com (live site)
  // exceeded 60s when 7 workers compete for network bandwidth simultaneously.
  // Setting workers=1 for non-CI serialises execution, eliminating contention.
  workers: 1,
  // FIX-002 (FIARA TEW-RUN-20260730-002): Increased timeout from 30000 to 60000ms for non-CI.
  // FIX-001 (FIARA TEW-RUN-20260730-005): Increased further from 60000 to 120000ms for non-CI.
  // PST AUT page load times have increased significantly (Firefox goto consuming full 60s budget;
  // TC-3 Chromium test budget exhausted before Step 500 send-button click). 120s provides
  // sufficient headroom for slow live-site navigation without masking real failures.
  timeout: process.env.CI ? 30_000 : 120_000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    headless: false,
    viewport: { width: 1280, height: 720 },
  },

  outputDir: 'test-results/',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

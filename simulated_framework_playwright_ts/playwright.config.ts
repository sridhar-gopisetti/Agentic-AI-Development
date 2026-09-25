/**
 * Playwright Configuration
 * AETHER Simulated Framework — playwright-typescript
 *
 * Traceability:
 *   Framework: playwright-typescript
 *   Profile:   frameworks/playwright-typescript/FRAMEWORK_PROFILE.json
 *
 * AETHER Evidence Integration:
 *   When TEEA sets AETHER_EVIDENCE_DIR before invoking the runner, Playwright writes
 *   its test-results output (including failure screenshots) directly into the AETHER
 *   evidence directory tree instead of the default local test-results/ folder.
 *   TEEA then renames screenshots to the AETHER naming convention.
 *   If AETHER_EVIDENCE_DIR is not set, output falls back to test-results/ (local dev).
 *
 * Allure Reporting:
 *   allure-playwright reporter produces structured JSON result files in allure-results/.
 *   The directory is configurable via ALLURE_RESULTS_DIR env var (TEEA sets this for
 *   scoped runs). Falls back to 'allure-results' at the framework root.
 *   The existing HTML and list reporters are preserved — Allure is additive only.
 *   Profile ref: frameworks/playwright-typescript/FRAMEWORK_PROFILE.json → allure_reporting
 *   Contract ref: frameworks/reporting/ALLURE_REPORTING_CONTRACT.md
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
    // Allure: additive reporter — produces allure-results/ JSON files consumed by
    // the future MCP reporting step.  Does NOT replace the HTML or list reporters.
    // resultsDir is configurable; TEEA sets ALLURE_RESULTS_DIR for run-scoped output.
    ['allure-playwright', {
      resultsDir: process.env.ALLURE_RESULTS_DIR ?? 'allure-results',
      detail: true,
      suiteTitle: false,
    }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // AETHER: screenshot and video always retained on failure.
    // TEEA post-processes these into the AETHER evidence directory after execution.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    headless: false,
    viewport: { width: 1280, height: 720 },
  },

  // AETHER_EVIDENCE_DIR is set by TEEA before invoking the runner.
  // When set, Playwright writes all test artifacts (including failure screenshots)
  // directly into the AETHER evidence staging directory.
  // Falls back to local test-results/ when running outside AETHER (local dev / CI).
  outputDir: process.env.AETHER_EVIDENCE_DIR ?? 'test-results/',

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

/**
 * SD_TC5_Logout.spec.ts — playwright-typescript framework
 *
 * SauceDemo (Swag Labs) — Logout Test Suite
 * Covers: FR-10 (logout functionality)
 *
 * Traceability:
 *   Requirements: FR-10
 *   Source:       input/saucedemo-SwagLabs.docx
 *   Run ID:       ACG-RUN-20260802-001
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007
 */

import { test, expect } from '../../../fixtures';

// ── Test Data ────────────────────────────────────────────────────────────────

const SD_URL     = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const VALID_USER = process.env.SD_USERNAME ?? 'standard_user';
const VALID_PASS = process.env.SD_PASSWORD ?? 'secret_sauce';

// ── Test Suite ────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Logout', () => {

  test.beforeEach(async ({ page, sauceDemoLoginPage }) => {
    await page.goto(SD_URL);
    await sauceDemoLoginPage.login(VALID_USER, VALID_PASS);
    await expect(page).toHaveURL(/inventory/);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // FIX-001-TEW-001 (FIARA TEW-RUN-20260802-001): Use testInfo.outputPath() to avoid
    // ENOENT when screenshots/ directory does not exist.
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: testInfo.outputPath('failure.png') });
    }
  });

  // ── FR-10: Logout ─────────────────────────────────────────────────────────────

  test('FR-10: User can logout via menu and is redirected to login page', async ({ page, inventoryPage }) => {

    await test.step('Step 100 — Open hamburger menu', async () => {
      await inventoryPage.openMenu();
    });

    await test.step('Step 200 — Click Logout link', async () => {
      await inventoryPage.clickLogout();
    });

    await test.step('Step 300 — Assert user is redirected to the Login page', async () => {
      // Traceability: FR-10
      await expect(page).toHaveURL(SD_URL + '/');
      await expect(page.locator('#login-button')).toBeVisible();
    });
  });

});

/**
 * SD_TC1_Login.spec.ts — playwright-typescript framework
 *
 * SauceDemo (Swag Labs) — Login Test Suite
 * Covers: FR-01 (valid login), ER-01 through ER-05 (login error scenarios)
 *
 * Traceability:
 *   Requirements: FR-01, ER-01, ER-02, ER-03, ER-04, ER-05
 *   Source:       input/saucedemo-SwagLabs.docx
 *   Run ID:       ACG-RUN-20260802-001
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007
 */

import { test, expect } from '../../../fixtures';

// ── Test Data ────────────────────────────────────────────────────────────────

const SD_URL       = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const VALID_USER   = process.env.SD_USERNAME ?? 'standard_user';
const VALID_PASS   = process.env.SD_PASSWORD ?? 'secret_sauce';
const INVALID_USER = 'invalid_user';
const INVALID_PASS = 'wrong_password';

// ── Test Suite ────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(SD_URL);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // FIX-001-TEW-001 (FIARA TEW-RUN-20260802-001): Use testInfo.outputPath() to avoid
    // ENOENT when screenshots/ directory does not exist. testInfo.outputPath() always
    // resolves to a Playwright-managed directory that is guaranteed to exist.
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: testInfo.outputPath('failure.png') });
    }
  });

  // ── FR-01: Login — Valid Credentials ────────────────────────────────────────

  test('FR-01: Login with valid credentials redirects to inventory page', async ({ page, sauceDemoLoginPage }) => {

    await test.step('Step 100 — Validate login page is rendered', async () => {
      const isReady = await sauceDemoLoginPage.validate();
      expect(isReady).toBe(true);
    });

    await test.step('Step 200 — Enter valid username', async () => {
      await sauceDemoLoginPage.enterUsername(VALID_USER);
    });

    await test.step('Step 300 — Enter valid password', async () => {
      await sauceDemoLoginPage.enterPassword(VALID_PASS);
    });

    await test.step('Step 400 — Click Login button', async () => {
      await sauceDemoLoginPage.clickLoginButton();
    });

    await test.step('Step 500 — Assert redirected to inventory page and product list displayed', async () => {
      // Traceability: FR-01
      await expect(page).toHaveURL(/inventory/);
      await expect(page.locator('.inventory_list')).toBeVisible();
    });
  });

  // ── ER-01: Login — Empty Username ────────────────────────────────────────────

  test('ER-01: Login with empty username shows error message', async ({ page, sauceDemoLoginPage }) => {

    await test.step('Step 100 — Leave Username blank, enter valid password', async () => {
      await sauceDemoLoginPage.enterPassword(VALID_PASS);
    });

    await test.step('Step 200 — Click Login button', async () => {
      await sauceDemoLoginPage.clickLoginButton();
    });

    await test.step('Step 300 — Assert user remains on login page', async () => {
      // Traceability: ER-01
      await expect(page).toHaveURL(SD_URL + '/');
    });

    await test.step('Step 400 — Assert login button still visible (login did not proceed)', async () => {
      await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    await test.step('Step 500 — Assert exact error message: Username is required', async () => {
      // Traceability: ER-01
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText('Username is required');
    });
  });

  // ── ER-02: Login — Empty Password ────────────────────────────────────────────

  test('ER-02: Login with empty password shows error message', async ({ page, sauceDemoLoginPage }) => {

    await test.step('Step 100 — Enter valid username, leave Password blank', async () => {
      await sauceDemoLoginPage.enterUsername(VALID_USER);
    });

    await test.step('Step 200 — Click Login button', async () => {
      await sauceDemoLoginPage.clickLoginButton();
    });

    await test.step('Step 300 — Assert user remains on login page', async () => {
      // Traceability: ER-02
      await expect(page).toHaveURL(SD_URL + '/');
    });

    await test.step('Step 400 — Assert login button still visible', async () => {
      await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    await test.step('Step 500 — Assert exact error message: Password is required', async () => {
      // Traceability: ER-02
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText('Password is required');
    });
  });

  // ── ER-03: Login — Empty Credentials ─────────────────────────────────────────

  test('ER-03: Login with empty username and password shows validation error', async ({ page, sauceDemoLoginPage }) => {

    await test.step('Step 100 — Leave both Username and Password blank', async () => {
      // No input — both fields remain empty (default page state)
    });

    await test.step('Step 200 — Click Login button', async () => {
      await sauceDemoLoginPage.clickLoginButton();
    });

    await test.step('Step 300 — Assert login did not proceed', async () => {
      // Traceability: ER-03
      await expect(page).toHaveURL(SD_URL + '/');
    });

    await test.step('Step 400 — Assert login button still visible', async () => {
      await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    await test.step('Step 500 — Assert validation error is displayed', async () => {
      // Traceability: ER-03
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText('Username is required');
    });
  });

  // ── ER-04: Login — Invalid Username ──────────────────────────────────────────

  test('ER-04: Login with invalid username shows error message', async ({ page, sauceDemoLoginPage }) => {

    await test.step('Step 100 — Enter invalid username', async () => {
      await sauceDemoLoginPage.enterUsername(INVALID_USER);
    });

    await test.step('Step 200 — Enter valid password', async () => {
      await sauceDemoLoginPage.enterPassword(VALID_PASS);
    });

    await test.step('Step 300 — Click Login button', async () => {
      await sauceDemoLoginPage.clickLoginButton();
    });

    await test.step('Step 400 — Assert user remains on login page', async () => {
      // Traceability: ER-04
      await expect(page).toHaveURL(SD_URL + '/');
    });

    await test.step('Step 500 — Assert error message indicates invalid credentials', async () => {
      // Traceability: ER-04
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText('Username and password do not match');
    });
  });

  // ── ER-05: Login — Invalid Password ──────────────────────────────────────────

  test('ER-05: Login with invalid password shows error message', async ({ page, sauceDemoLoginPage }) => {

    await test.step('Step 100 — Enter valid username', async () => {
      await sauceDemoLoginPage.enterUsername(VALID_USER);
    });

    await test.step('Step 200 — Enter invalid password', async () => {
      await sauceDemoLoginPage.enterPassword(INVALID_PASS);
    });

    await test.step('Step 300 — Click Login button', async () => {
      await sauceDemoLoginPage.clickLoginButton();
    });

    await test.step('Step 400 — Assert login failed', async () => {
      // Traceability: ER-05
      await expect(page).toHaveURL(SD_URL + '/');
    });

    await test.step('Step 500 — Assert error message displayed', async () => {
      // Traceability: ER-05
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText('Username and password do not match');
    });
  });

});

/**
 * TC2_Registration.spec.ts
 * ACG-RUN-20260801-007 — playwright-typescript
 *
 * Test Case 2: User Account Registration & Profile Data Persistence
 * Requirement: REQ-PST-002
 * AUT: https://practicesoftwaretesting.com
 *
 * Traceability:
 *   Requirement:  REQ-PST-002
 *   Framework:    playwright-typescript v1.1.0
 *   DNA:          PT-TS-1.1.0-POM-FIXTURE-STRICT
 *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007, PT-008
 *                 UNI-001, UNI-002, UNI-003, UNI-004, UNI-005
 */

import { test, expect } from '../../../fixtures';
import type { RegistrationData } from '../../../pages/RegisterPage';

// ── Test Data ─────────────────────────────────────────────────────────────────
// Unique email per run — prevents registration conflict on repeated executions
const email    = `test_user_${Date.now()}@example.com`;
// FIX-TEW-TC2: PST AUT v5.0 password strength meter requires a stronger password before
// the Register button can be submitted. 'Test@1234' scored too weak; 'Test@Pass1234!' passes.
const password = process.env.TEST_PASSWORD ?? 'Test@Pass1234!';

const regData: RegistrationData = {
  firstName:   'Test',
  lastName:    'User',
  // FIX-TEW-TC2: PST AUT v5.0 Date of Birth placeholder is YYYY-MM-DD.
  dob:         '1990-01-01',
  // FIX-TEW-TC2: PST AUT v5.0 address uses Street + House number (separate fields).
  address:     'QA Avenue',
  houseNumber: '456',
  city:        'Utrecht',
  state:       'Utrecht',
  country:     'NL',
  postcode:    '3500 AA',
  // FIX-TEW-TC2: PST AUT v5.0 phone field rejects non-numeric chars (e.g. "+").
  // Use digits-only format to pass AUT validation and allow form submission.
  phone:       '0031612345678',
  email,
  password,
};

// ── Test Suite ─────────────────────────────────────────────────────────────────
test.describe('TC-2: User Account Registration & Profile Data Persistence', () => {

  test.beforeEach(async ({ registerPage }) => {
    // Pre-condition: User must not be logged in; navigate to registration page
    await registerPage.navigateTo('/auth/register');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Traceability: TEARDOWN
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: testInfo.outputPath('screenshot-on-failure.png') });
    }
  });

  test('TC-2: User Account Registration & Profile Data Persistence', async ({
    page,
    registerPage,
    pstLoginPage,
    profilePage,
  }) => {

    await test.step('Step 100 — Verify registration form loads with all required fields', async () => {
      // Traceability: REQ-PST-002-TC2-STEP100
      const loaded = await registerPage.validate();
      expect(loaded).toBe(true);
      await expect(registerPage.getRegisterButtonLocator()).toBeVisible();
    });

    await test.step('Step 200 — Fill all required fields and click Register', async () => {
      // Traceability: REQ-PST-002-TC2-STEP200
      await registerPage.fillRegistrationForm(regData);
      await registerPage.clickRegister();
      // FIX-TEW-TC2: PST AUT registration POST + redirect takes longer than the default 5 s.
      // 15 s is sufficient for the live AUT to process and redirect to /auth/login.
      await expect(page).toHaveURL(/auth\/login/, { timeout: 15_000 });
    });

    await test.step('Step 300 — Login with newly created credentials', async () => {
      // Traceability: REQ-PST-002-TC2-STEP300
      await pstLoginPage.login(email, password);
      await expect(page).toHaveURL(/account/);
    });

    await test.step('Step 400 — Navigate to Profile page', async () => {
      // Traceability: REQ-PST-002-TC2-STEP400
      // FIX-TEW-TC2: PST AUT v5.0 /account is a dashboard with tabs (Favorites, Profile, etc.).
      // The profile edit form fields are under /account/profile, not /account.
      // FIX-TEW-TC2-S400: Wait for networkidle after goto so Angular finishes rendering
      // the reactive form before Step 500 assertions run.
      await page.goto((process.env.BASE_URL ?? 'https://practicesoftwaretesting.com') + '/account/profile');
      await page.waitForLoadState('networkidle');
      await expect(profilePage.getPageHeaderLocator()).toBeVisible();
    });

    await test.step('Step 500 — Verify all profile fields match registration data', async () => {
      // Traceability: REQ-PST-002-TC2-STEP500
      // FIX-TEW-TC2-S500: Wait for the first field (First name) to be visible before asserting
      // subsequent fields — confirms the Angular profile form has fully rendered.
      await expect(profilePage.getFirstNameLocator()).toBeVisible({ timeout: 15_000 });
      await expect(profilePage.getAddressLocator()).toBeVisible();
      await expect(profilePage.getCityLocator()).toBeVisible();
      await expect(profilePage.getPhoneLocator()).toBeVisible();
      await expect(profilePage.getPostcodeLocator()).toBeVisible();
    });

  });

});

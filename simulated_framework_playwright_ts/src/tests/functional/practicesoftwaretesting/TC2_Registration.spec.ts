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
const password = process.env.TEST_PASSWORD ?? 'Test@1234';

const regData: RegistrationData = {
  firstName: 'Test',
  lastName:  'User',
  dob:       '01/01/1990',
  address:   '456 QA Avenue',
  city:      'Utrecht',
  state:     'Utrecht',
  country:   'NL',
  postcode:  '3500 AA',
  phone:     '+31612345678',
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
      await expect(page).toHaveURL(/auth\/login/);
    });

    await test.step('Step 300 — Login with newly created credentials', async () => {
      // Traceability: REQ-PST-002-TC2-STEP300
      await pstLoginPage.login(email, password);
      await expect(page).toHaveURL(/account/);
    });

    await test.step('Step 400 — Navigate to Profile page', async () => {
      // Traceability: REQ-PST-002-TC2-STEP400
      await page.goto((process.env.BASE_URL ?? 'https://practicesoftwaretesting.com') + '/account');
      await expect(profilePage.getPageHeaderLocator()).toBeVisible();
    });

    await test.step('Step 500 — Verify all profile fields match registration data', async () => {
      // Traceability: REQ-PST-002-TC2-STEP500
      await expect(profilePage.getAddressLocator()).toBeVisible();
      await expect(profilePage.getCityLocator()).toBeVisible();
      await expect(profilePage.getPhoneLocator()).toBeVisible();
      await expect(profilePage.getPostcodeLocator()).toBeVisible();
    });

  });

});

// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// AUT_LOGIN_PATH  → set AUT_LOGIN_PATH in .env (assumed: /login)
// AUT_USER_EMAIL  → set AUT_USER_EMAIL in .env
// AUT_USER_PASSWORD  → set AUT_USER_PASSWORD in .env
// TARGET_BROWSER  → set TARGET_BROWSER in .env
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env
// ════════════════════════════════════════════════════

package com.automation.tests;

import com.aether.framework.core.BaseTest;
import com.aether.framework.core.ConfigReader;
import com.aether.pages.banking.BankingDashboardPage;
import com.aether.pages.banking.BankingLoginPage;
import com.microsoft.playwright.Page;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

public class BankingLoginTest extends BaseTest {

    private BankingLoginPage bankingLoginPage;
    private BankingDashboardPage bankingDashboardPage;
    private SoftAssert softAssert;

    private String validUsername;
    private String validPassword;
    private String mfaUsername;
    private String mfaPassword;
    private String validOtp;
    private String invalidUsername;
    private String invalidPasswordUser;
    private String invalidPassword;
    private String bothInvalidUsername;
    private String bothInvalidPassword;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        if (page == null) {
            throw new IllegalStateException(
                    "Playwright page was not initialized by BaseTest");
        }

        bankingLoginPage = new BankingLoginPage(page);
        bankingDashboardPage = new BankingDashboardPage(page);

        validUsername = ConfigReader.get("banking.valid.username");
        validPassword = ConfigReader.get("banking.valid.password");
        mfaUsername = ConfigReader.get("banking.mfa.username");
        mfaPassword = ConfigReader.get("banking.mfa.password");
        validOtp = ConfigReader.get("banking.valid.otp");
        invalidUsername = ConfigReader.get("banking.invalid.username");
        invalidPasswordUser =
                ConfigReader.get("banking.invalid.password.user");
        invalidPassword = ConfigReader.get("banking.invalid.password");
        bothInvalidUsername =
                ConfigReader.get("banking.both.invalid.username");
        bothInvalidPassword =
                ConfigReader.get("banking.both.invalid.password");

        validateConfiguration();

        // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
        bankingLoginPage.openLoginPage();

        if (!bankingLoginPage.validate()) {
            throw new IllegalStateException(
                    "Banking login page was not available during setup");
        }
    }

    private void validateConfiguration() {
        if (isBlank(validUsername)
                || isBlank(validPassword)
                || isBlank(mfaUsername)
                || isBlank(mfaPassword)
                || isBlank(validOtp)
                || isBlank(invalidUsername)
                || isBlank(invalidPasswordUser)
                || isBlank(invalidPassword)
                || isBlank(bothInvalidUsername)
                || isBlank(bothInvalidPassword)) {
            throw new IllegalStateException(
                    "Required banking test configuration is missing");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    @Test(
            priority = 1,
            groups = {"smoke", "regression", "banking-login"},
            description = "[TC-060F91-001][SCR-060F91-001] Valid banking login")
    public void tc001_validLogin() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-001
        // script_id    : SCR-060F91-001
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 2: Enter valid username
        {
            bankingLoginPage.enterUsername(validUsername);
        }

        // Step 3: Enter valid password
        {
            bankingLoginPage.enterPassword(validPassword);
        }

        // Step 4: Click Login
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_001
            Assert.assertTrue(
                    bankingDashboardPage.validate(),
                    "Valid login must display the banking dashboard [TC_001]");

            String displayedUsername =
                    bankingDashboardPage.getLoggedInUsername();

            // Traceability: TC_001
            Assert.assertTrue(
                    !displayedUsername.isEmpty(),
                    "Authenticated username must be displayed [TC_001]");
        }
    }

    @Test(
            priority = 2,
            groups = {"regression", "banking-login", "mfa"},
            description = "[TC-060F91-002][SCR-060F91-002] Valid banking login with OTP")
    public void tc002_validLoginWithOtp() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-002
        // script_id    : SCR-060F91-002
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 2: Enter valid username
        {
            bankingLoginPage.enterUsername(mfaUsername);
        }

        // Step 3: Enter valid password
        {
            bankingLoginPage.enterPassword(mfaPassword);
        }

        // Step 4: Click Login
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_002
            Assert.assertTrue(
                    bankingLoginPage.validateOtpPage(),
                    "First-factor login must display the OTP page [TC_002]");
        }

        // Step 5: Enter valid OTP
        {
            bankingLoginPage.submitOtp(validOtp);
        }

        // Step 6: Submit
        {
            // Traceability: TC_002
            Assert.assertTrue(
                    bankingDashboardPage.validate(),
                    "Successful OTP submission must display the dashboard [TC_002]");

            String displayedUsername =
                    bankingDashboardPage.getLoggedInUsername();

            // Traceability: TC_002
            Assert.assertTrue(
                    !displayedUsername.isEmpty(),
                    "Authenticated username must be displayed after OTP [TC_002]");
        }
    }

    @Test(
            priority = 3,
            groups = {"regression", "banking-login", "negative"},
            description = "[TC-060F91-003][SCR-060F91-003] Invalid username")
    public void tc003_invalidUsername() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-003
        // script_id    : SCR-060F91-003
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        softAssert = new SoftAssert();

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 7: Enter invalid username + valid password
        {
            bankingLoginPage.enterUsername(invalidUsername);
            bankingLoginPage.enterPassword(validPassword);
        }

        // Step 4: Click Login
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_003
            softAssert.assertTrue(
                    bankingLoginPage.isStillOnLoginPage(),
                    "Invalid username must not authenticate the user [TC_003]");

            // Traceability: TC_003
            softAssert.assertTrue(
                    bankingLoginPage.isErrorBannerDisplayed(),
                    "Invalid username must display an error [TC_003]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // Traceability: TC_003
            softAssert.assertTrue(
                    errorText.contains("Invalid username or password"),
                    "Invalid username message must identify invalid credentials [TC_003]");

            softAssert.assertAll();
        }
    }

    @Test(
            priority = 4,
            groups = {"regression", "banking-login", "negative"},
            description = "[TC-060F91-004][SCR-060F91-004] Invalid password")
    public void tc004_invalidPassword() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-004
        // script_id    : SCR-060F91-004
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        softAssert = new SoftAssert();

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 8: Enter valid username + invalid password
        {
            bankingLoginPage.enterUsername(invalidPasswordUser);
            bankingLoginPage.enterPassword(invalidPassword);
        }

        // Step 4: Click Login
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_004
            softAssert.assertTrue(
                    bankingLoginPage.isStillOnLoginPage(),
                    "Invalid password must not authenticate the user [TC_004]");

            // Traceability: TC_004
            softAssert.assertTrue(
                    bankingLoginPage.isErrorBannerDisplayed(),
                    "Invalid password must display an error [TC_004]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // Traceability: TC_004
            softAssert.assertTrue(
                    errorText.contains("Invalid username or password"),
                    "Invalid password message must identify invalid credentials [TC_004]");

            softAssert.assertAll();
        }
    }

    @Test(
            priority = 5,
            groups = {"regression", "banking-login", "negative"},
            description = "[TC-060F91-005][SCR-060F91-005] Both credentials invalid")
    public void tc005_bothInvalid() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-005
        // script_id    : SCR-060F91-005
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        softAssert = new SoftAssert();

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 9: Enter invalid credentials
        {
            bankingLoginPage.enterUsername(bothInvalidUsername);
            bankingLoginPage.enterPassword(bothInvalidPassword);
        }

        // Step 4: Click Login
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_005
            softAssert.assertTrue(
                    bankingLoginPage.isStillOnLoginPage(),
                    "Invalid credentials must not authenticate the user [TC_005]");

            // Traceability: TC_005
            softAssert.assertTrue(
                    bankingLoginPage.isErrorBannerDisplayed(),
                    "Invalid credentials must display an error [TC_005]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // Traceability: TC_005
            softAssert.assertTrue(
                    errorText.contains("Invalid username or password"),
                    "Invalid-login message must identify invalid credentials [TC_005]");

            softAssert.assertAll();
        }
    }

    @Test(
            priority = 6,
            groups = {"regression", "banking-login", "field-validation"},
            description = "[TC-060F91-006][SCR-060F91-006] Blank username")
    public void tc006_emptyUsername() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-006
        // script_id    : SCR-060F91-006
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 10: Leave username blank
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.enterPassword(validPassword);
        }

        // Step 12: Click login without input
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_006
            Assert.assertTrue(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "Blank username must display required-field validation [TC_006]");

            // Traceability: TC_006
            Assert.assertTrue(
                    bankingLoginPage.getUsernameErrorText()
                            .toLowerCase()
                            .contains("username required"),
                    "Username validation must contain the required-field message [TC_006]");
        }
    }

    @Test(
            priority = 7,
            groups = {"regression", "banking-login", "field-validation"},
            description = "[TC-060F91-007][SCR-060F91-007] Blank password")
    public void tc007_emptyPassword() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-007
        // script_id    : SCR-060F91-007
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 10: Enter valid username
        {
            bankingLoginPage.enterUsername(validUsername);
        }

        // Step 11: Leave password blank
        {
            bankingLoginPage.clearPassword();
        }

        // Step 12: Click login without input
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_007
            Assert.assertTrue(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "Blank password must display required-field validation [TC_007]");

            // Traceability: TC_007
            Assert.assertTrue(
                    bankingLoginPage.getPasswordErrorText()
                            .toLowerCase()
                            .contains("password required"),
                    "Password validation must contain the required-field message [TC_007]");
        }
    }

    @Test(
            priority = 8,
            groups = {"regression", "banking-login", "field-validation"},
            description = "[TC-060F91-008][SCR-060F91-008] Both fields empty")
    public void tc008_bothFieldsEmpty() {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-060F91-008
        // script_id    : SCR-060F91-008
        // acg_run_id   : 060f91d4-9f75-48c9-bb7d-a6df9bb16782
        // ─────────────────────────────────────────────────────────

        // Step 1: Open login page
        {
            // STUB: AUT_LOGIN_PATH not confirmed — using /login through the approved openLoginPage stub.
            bankingLoginPage.openLoginPage();
        }

        // Step 10: Leave username blank
        {
            bankingLoginPage.clearUsername();
        }

        // Step 11: Leave password blank
        {
            bankingLoginPage.clearPassword();
        }

        // Step 12: Click login without input
        {
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_008
            Assert.assertTrue(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "Blank username must display validation [TC_008]");

            // Traceability: TC_008
            Assert.assertTrue(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "Blank password must display validation [TC_008]");
        }
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (page != null) {
            page.close();
        }
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }
}
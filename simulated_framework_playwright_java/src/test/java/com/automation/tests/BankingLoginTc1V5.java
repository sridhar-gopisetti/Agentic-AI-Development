package com.automation.tests;

import com.aether.framework.core.BaseTest;
import com.aether.framework.core.ConfigReader;
import com.aether.framework.core.TestReporter;
import com.aether.pages.banking.BankingDashboardPage;
import com.aether.pages.banking.BankingLoginPage;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

public class BankingLoginTc1V5 extends BaseTest {

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

        page.navigate(ConfigReader.getBaseUrl());

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

    @Test(priority = 1,
            groups = {"smoke", "regression", "banking-login"})
    public void tc001_validLogin() {
        TestReporter.startTest(
                "TC_001: Valid banking login",
                "Requirement: REQ-BANK-AUTH-001");

        // Step 1: Open login page
        {
            page.navigate(ConfigReader.getBaseUrl());

            if (!bankingLoginPage.validate()) {
                throw new IllegalStateException(
                        "Login page was not available [TC_001]");
            }
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

            // TC_001
            org.testng.Assert.assertTrue(
                    bankingDashboardPage.validate(),
                    "Valid login must display the banking dashboard [TC_001]");

            String displayedUsername =
                    bankingDashboardPage.getLoggedInUsername();

            // TC_001
            org.testng.Assert.assertTrue(
                    !displayedUsername.isEmpty(),
                    "The authenticated username must be displayed [TC_001]");
        }
    }

    @Test(priority = 2,
            groups = {"regression", "banking-login", "mfa"})
    public void tc002_validLoginWithOtp() {
        TestReporter.startTest(
                "TC_002: Valid banking login with OTP",
                "Requirement: REQ-BANK-AUTH-001");

        // Step 5: Enter valid credentials
        {
            page.navigate(ConfigReader.getBaseUrl());
            bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);
        }

        // Step 6: Click Login
        {
            // TC_002
            org.testng.Assert.assertTrue(
                    bankingLoginPage.validateOtpPage(),
                    "First-factor login must display the OTP page [TC_002]");
        }

        // Step 7: Enter valid OTP
        {
            bankingLoginPage.submitOtp(validOtp);
        }

        // Step 8: Submit
        {
            // TC_002
            org.testng.Assert.assertTrue(
                    bankingDashboardPage.validate(),
                    "Successful OTP submission must display the dashboard "
                            + "[TC_002]");

            String displayedUsername =
                    bankingDashboardPage.getLoggedInUsername();

            // TC_002
            org.testng.Assert.assertTrue(
                    !displayedUsername.isEmpty(),
                    "The authenticated username must be displayed after OTP "
                            + "[TC_002]");
        }
    }

    @Test(priority = 3,
            groups = {"regression", "banking-login", "negative"})
    public void tc003_invalidUsername() {
        TestReporter.startTest(
                "TC_003: Invalid username",
                "Requirement: REQ-BANK-AUTH-001");

        softAssert = new SoftAssert();
        page.navigate(ConfigReader.getBaseUrl());

        // Step 9: Enter invalid username and valid password
        {
            bankingLoginPage.enterUsername(invalidUsername);
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            boolean remainsOnLoginPage =
                    bankingLoginPage.isStillOnLoginPage();

            // TC_003
            softAssert.assertTrue(
                    remainsOnLoginPage,
                    "Invalid username must not authenticate the user "
                            + "[TC_003]");

            boolean errorDisplayed =
                    bankingLoginPage.isErrorBannerDisplayed();

            // TC_003
            softAssert.assertTrue(
                    errorDisplayed,
                    "Invalid username must display an error [TC_003]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // TC_003
            softAssert.assertTrue(
                    errorText.contains("Invalid username or password"),
                    "The invalid-username message must identify invalid "
                            + "credentials [TC_003]");

            softAssert.assertAll();
        }
    }

    @Test(priority = 4,
            groups = {"regression", "banking-login", "negative"})
    public void tc004_invalidPassword() {
        TestReporter.startTest(
                "TC_004: Invalid password",
                "Requirement: REQ-BANK-AUTH-001");

        softAssert = new SoftAssert();
        page.navigate(ConfigReader.getBaseUrl());

        // Step 10: Enter valid username and invalid password
        {
            bankingLoginPage.enterUsername(invalidPasswordUser);
            bankingLoginPage.enterPassword(invalidPassword);
            bankingLoginPage.clickLoginButton();

            boolean remainsOnLoginPage =
                    bankingLoginPage.isStillOnLoginPage();

            // TC_004
            softAssert.assertTrue(
                    remainsOnLoginPage,
                    "Invalid password must not authenticate the user "
                            + "[TC_004]");

            boolean errorDisplayed =
                    bankingLoginPage.isErrorBannerDisplayed();

            // TC_004
            softAssert.assertTrue(
                    errorDisplayed,
                    "An invalid password must display an error [TC_004]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // TC_004
            softAssert.assertTrue(
                    errorText.contains("Invalid username or password"),
                    "The invalid-password message must identify invalid "
                            + "credentials [TC_004]");

            softAssert.assertAll();
        }
    }

    @Test(priority = 5,
            groups = {"regression", "banking-login", "negative"})
    public void tc005_bothInvalid() {
        TestReporter.startTest(
                "TC_005: Both credentials invalid",
                "Requirement: REQ-BANK-AUTH-001");

        softAssert = new SoftAssert();
        page.navigate(ConfigReader.getBaseUrl());

        // Step 11: Enter invalid credentials
        {
            bankingLoginPage.enterUsername(bothInvalidUsername);
            bankingLoginPage.enterPassword(bothInvalidPassword);
            bankingLoginPage.clickLoginButton();

            boolean remainsOnLoginPage =
                    bankingLoginPage.isStillOnLoginPage();

            // TC_005
            softAssert.assertTrue(
                    remainsOnLoginPage,
                    "Both invalid credentials must not authenticate the user "
                            + "[TC_005]");

            boolean errorDisplayed =
                    bankingLoginPage.isErrorBannerDisplayed();

            // TC_005
            softAssert.assertTrue(
                    errorDisplayed,
                    "Both invalid credentials must display an error "
                            + "[TC_005]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // TC_005
            softAssert.assertTrue(
                    errorText.contains("Invalid username or password"),
                    "The invalid-login message must identify invalid "
                            + "credentials [TC_005]");

            softAssert.assertAll();
        }
    }

    @Test(priority = 6,
            groups = {"regression", "banking-login", "field-validation"})
    public void tc006_emptyUsername() {
        TestReporter.startTest(
                "TC_006: Blank username",
                "Requirement: REQ-BANK-AUTH-001");

        page.navigate(ConfigReader.getBaseUrl());

        // Step 12: Leave username blank and click Login
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            // TC_006
            org.testng.Assert.assertTrue(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "Blank username must display required-field validation "
                            + "[TC_006]");

            // TC_006
            org.testng.Assert.assertTrue(
                    bankingLoginPage.getUsernameErrorText()
                            .toLowerCase()
                            .contains("username required"),
                    "Username validation must contain the required-field "
                            + "message [TC_006]");
        }
    }

    @Test(priority = 7,
            groups = {"regression", "banking-login", "field-validation"})
    public void tc007_emptyPassword() {
        TestReporter.startTest(
                "TC_007: Blank password",
                "Requirement: REQ-BANK-AUTH-001");

        page.navigate(ConfigReader.getBaseUrl());

        // Step 13: Leave password blank and click Login
        {
            bankingLoginPage.enterUsername(validUsername);
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // TC_007
            org.testng.Assert.assertTrue(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "Blank password must display required-field validation "
                            + "[TC_007]");

            // TC_007
            org.testng.Assert.assertTrue(
                    bankingLoginPage.getPasswordErrorText()
                            .toLowerCase()
                            .contains("password required"),
                    "Password validation must contain the required-field "
                            + "message [TC_007]");
        }
    }

    @Test(priority = 8,
            groups = {"regression", "banking-login", "field-validation"})
    public void tc008_bothFieldsEmpty() {
        TestReporter.startTest(
                "TC_008: Login without input",
                "Requirement: REQ-BANK-AUTH-001");

        page.navigate(ConfigReader.getBaseUrl());

        // Step 14: Click Login without entering username or password
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // TC_008
            org.testng.Assert.assertTrue(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "Blank username must display required-field validation "
                            + "[TC_008]");

            // TC_008
            org.testng.Assert.assertTrue(
                    bankingLoginPage.getUsernameErrorText()
                            .toLowerCase()
                            .contains("username required"),
                    "Username validation must contain the required-field "
                            + "message [TC_008]");

            // TC_008
            org.testng.Assert.assertTrue(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "Blank password must display required-field validation "
                            + "[TC_008]");

            // TC_008
            org.testng.Assert.assertTrue(
                    bankingLoginPage.getPasswordErrorText()
                            .toLowerCase()
                            .contains("password required"),
                    "Password validation must contain the required-field "
                            + "message [TC_008]");
        }
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        /*
         * Browser and Playwright resource disposal remain owned by the
         * BaseTest lifecycle contract.
         */
    }
}
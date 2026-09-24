package com.automation.tests;

import java.nio.file.Paths;

import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import com.microsoft.playwright.Page;

import com.aether.framework.core.BaseTest;
import com.aether.framework.core.ConfigReader;
import com.aether.framework.core.TestReporter;
import com.aether.pages.banking.BankingDashboardPage;
import com.aether.pages.banking.BankingLoginPage;

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

    @BeforeMethod(alwaysRun = true)
    public void initializeTestState() {
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

            // Traceability: TC_001
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingDashboardPage.validate(),
                            "Valid login displayed the banking dashboard [TC_001]",
                            "Valid login did not display the banking dashboard [TC_001]"),
                    "Valid login must display the banking dashboard [TC_001]");

            String displayedUsername =
                    bankingDashboardPage.getLoggedInUsername();

            // Traceability: TC_001
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            !displayedUsername.isEmpty(),
                            "Authenticated username was displayed [TC_001]",
                            "Authenticated username was not displayed [TC_001]"),
                    "The authenticated username must be displayed [TC_001]");
        }
    }

    @Test(priority = 2,
            groups = {"regression", "banking-login", "mfa"})
    public void tc002_validLoginWithOtp() {
        TestReporter.startTest(
                "TC_002: Valid banking login with OTP",
                "Requirement: REQ-BANK-AUTH-001");

        page.navigate(ConfigReader.getBaseUrl());

        // Step 5: Enter valid credentials
        {
            bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);
        }

        // Step 6: Click Login
        {
            // Traceability: TC_002
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.validateOtpPage(),
                            "OTP page was displayed [TC_002]",
                            "OTP page was not displayed [TC_002]"),
                    "First-factor login must display the OTP page [TC_002]");
        }

        // Step 7: Enter valid OTP
        {
            bankingLoginPage.submitOtp(validOtp);
        }

        // Step 8: Submit
        {
            // Traceability: TC_002
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingDashboardPage.validate(),
                            "Dashboard was displayed after OTP [TC_002]",
                            "Dashboard was not displayed after OTP [TC_002]"),
                    "Successful OTP submission must display the dashboard [TC_002]");

            String displayedUsername =
                    bankingDashboardPage.getLoggedInUsername();

            // Traceability: TC_002
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            !displayedUsername.isEmpty(),
                            "Authenticated username was displayed after OTP [TC_002]",
                            "Authenticated username was not displayed after OTP [TC_002]"),
                    "The authenticated username must be displayed after OTP [TC_002]");
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

        // Step 9: Enter invalid username + valid password
        {
            bankingLoginPage.enterUsername(invalidUsername);
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            boolean remainsOnLoginPage =
                    bankingLoginPage.isStillOnLoginPage();

            // Traceability: TC_003
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            remainsOnLoginPage,
                            "Invalid username was rejected [TC_003]",
                            "Invalid username established a session [TC_003]"),
                    "Invalid username must not authenticate the user [TC_003]");

            boolean errorDisplayed =
                    bankingLoginPage.isErrorBannerDisplayed();

            // Traceability: TC_003
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            errorDisplayed,
                            "Invalid username error was displayed [TC_003]",
                            "Invalid username error was not displayed [TC_003]"),
                    "Invalid username must display an error [TC_003]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // Traceability: TC_003
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            errorText.contains("Invalid username or password"),
                            "Invalid credential text was displayed [TC_003]",
                            "Expected invalid credential text was not displayed [TC_003]"),
                    "The invalid-username message must identify invalid credentials [TC_003]");

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

        // Step 10: Enter valid username + invalid password
        {
            bankingLoginPage.enterUsername(invalidPasswordUser);
            bankingLoginPage.enterPassword(invalidPassword);
            bankingLoginPage.clickLoginButton();

            boolean remainsOnLoginPage =
                    bankingLoginPage.isStillOnLoginPage();

            // Traceability: TC_004
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            remainsOnLoginPage,
                            "Invalid password was rejected [TC_004]",
                            "Invalid password established a session [TC_004]"),
                    "Invalid password must not authenticate the user [TC_004]");

            boolean errorDisplayed =
                    bankingLoginPage.isErrorBannerDisplayed();

            // Traceability: TC_004
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            errorDisplayed,
                            "Invalid password error was displayed [TC_004]",
                            "Invalid password error was not displayed [TC_004]"),
                    "An invalid password must display an error [TC_004]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // Traceability: TC_004
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            errorText.contains("Invalid username or password"),
                            "Invalid credential text was displayed [TC_004]",
                            "Expected invalid credential text was not displayed [TC_004]"),
                    "The invalid-password message must identify invalid credentials [TC_004]");

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

            // Traceability: TC_005
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            remainsOnLoginPage,
                            "Both invalid credentials were rejected [TC_005]",
                            "Both invalid credentials established a session [TC_005]"),
                    "Both invalid credentials must not authenticate the user [TC_005]");

            boolean errorDisplayed =
                    bankingLoginPage.isErrorBannerDisplayed();

            // Traceability: TC_005
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            errorDisplayed,
                            "Both-invalid error was displayed [TC_005]",
                            "Both-invalid error was not displayed [TC_005]"),
                    "Both invalid credentials must display an error [TC_005]");

            String errorText = bankingLoginPage.getErrorBannerText();

            // Traceability: TC_005
            softAssert.assertTrue(
                    TestReporter.assertCondition(
                            errorText.contains("Invalid username or password"),
                            "Invalid credential text was displayed [TC_005]",
                            "Expected invalid credential text was not displayed [TC_005]"),
                    "The invalid-login message must identify invalid credentials [TC_005]");

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

        // Step 12: Leave username blank, click Login
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_006
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.isUsernameErrorDisplayed(),
                            "Username required validation was displayed [TC_006]",
                            "Username required validation was not displayed [TC_006]"),
                    "Blank username must display required-field validation [TC_006]");

            // Traceability: TC_006
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.getUsernameErrorText()
                                    .toLowerCase()
                                    .contains("username required"),
                            "Username validation text was correct [TC_006]",
                            "Username validation text was incorrect [TC_006]"),
                    "Username validation must contain the required-field message [TC_006]");
        }
    }

    @Test(priority = 7,
            groups = {"regression", "banking-login", "field-validation"})
    public void tc007_emptyPassword() {
        TestReporter.startTest(
                "TC_007: Blank password",
                "Requirement: REQ-BANK-AUTH-001");

        page.navigate(ConfigReader.getBaseUrl());

        // Step 13: Leave password blank, click Login
        {
            bankingLoginPage.enterUsername(validUsername);
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_007
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.isPasswordErrorDisplayed(),
                            "Password required validation was displayed [TC_007]",
                            "Password required validation was not displayed [TC_007]"),
                    "Blank password must display required-field validation [TC_007]");

            // Traceability: TC_007
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.getPasswordErrorText()
                                    .toLowerCase()
                                    .contains("password required"),
                            "Password validation text was correct [TC_007]",
                            "Password validation text was incorrect [TC_007]"),
                    "Password validation must contain the required-field message [TC_007]");
        }
    }

    @Test(priority = 8,
            groups = {"regression", "banking-login", "field-validation"})
    public void tc008_bothFieldsEmpty() {
        TestReporter.startTest(
                "TC_008: Login without input",
                "Requirement: REQ-BANK-AUTH-001");

        page.navigate(ConfigReader.getBaseUrl());

        // Step 14: Click login without entering username or password
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // Traceability: TC_008
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.isUsernameErrorDisplayed(),
                            "Username required validation was displayed [TC_008]",
                            "Username required validation was not displayed [TC_008]"),
                    "Blank username must display required-field validation [TC_008]");

            // Traceability: TC_008
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.getUsernameErrorText()
                                    .toLowerCase()
                                    .contains("username required"),
                            "Username validation text was correct [TC_008]",
                            "Username validation text was incorrect [TC_008]"),
                    "Username validation must contain the required-field message [TC_008]");

            // Traceability: TC_008
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.isPasswordErrorDisplayed(),
                            "Password required validation was displayed [TC_008]",
                            "Password required validation was not displayed [TC_008]"),
                    "Blank password must display required-field validation [TC_008]");

            // Traceability: TC_008
            Assert.assertTrue(
                    TestReporter.assertCondition(
                            bankingLoginPage.getPasswordErrorText()
                                    .toLowerCase()
                                    .contains("password required"),
                            "Password validation text was correct [TC_008]",
                            "Password validation text was incorrect [TC_008]"),
                    "Password validation must contain the required-field message [TC_008]");
        }
    }

    @AfterClass(alwaysRun = true)
    public void tearDown(ITestResult result) {
        if (result != null
                && result.getStatus() == ITestResult.FAILURE
                && page != null
                && ConfigReader.screenshotOnFailure()) {
            TestReporter.captureScreenshot(page, result.getName());
        }
    }
}
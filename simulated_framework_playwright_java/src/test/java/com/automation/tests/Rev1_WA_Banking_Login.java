package com.aether.tests.functional.banking;

import com.aether.framework.core.BaseTest;
import com.aether.framework.core.ConfigReader;
import com.aether.framework.core.TestReporter;
import com.aether.pages.banking.BankingDashboardPage;
import com.aether.pages.banking.BankingLoginPage;
import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class Rev1_WA_Banking_Login extends BaseTest {

    private BankingLoginPage bankingLoginPage;
    private BankingDashboardPage bankingDashboardPage;
    private BankingLoginSupportPage bankingLoginSupportPage;

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
    public void setUp() {
        bankingLoginPage = new BankingLoginPage(page);
        bankingDashboardPage = new BankingDashboardPage(page);
        bankingLoginSupportPage = new BankingLoginSupportPage(page);

        validUsername = ConfigReader.get("banking.valid.username");
        validPassword = ConfigReader.get("banking.valid.password");
        mfaUsername = ConfigReader.get("banking.mfa.username");
        mfaPassword = ConfigReader.get("banking.mfa.password");
        validOtp = ConfigReader.get("banking.valid.otp");
        invalidUsername = ConfigReader.get("banking.invalid.username");
        invalidPasswordUser = ConfigReader.get("banking.invalid.password.user");
        invalidPassword = ConfigReader.get("banking.invalid.password");
        bothInvalidUsername = ConfigReader.get("banking.both.invalid.username");
        bothInvalidPassword = ConfigReader.get("banking.both.invalid.password");

        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
    }

    @AfterMethod(alwaysRun = true, dependsOnMethods = {})
    public void reportStatus(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            TestReporter.fail("TEST FAILED: " + result.getName());
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            TestReporter.pass("TEST PASSED: " + result.getName());
        }
    }

    @Test(
        description = "TC_001: Valid login",
        priority = 1,
        groups = {"smoke", "regression", "banking-login"}
    )
    public void tc001_validLogin() {
        TestReporter.startTest(
            "TC_001: Valid login",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        {
            page.navigate(ConfigReader.getBaseUrl());
            // TC_001
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.validate(),
                    "SUCCESS: Login page displayed [TC_001]",
                    "FAILURE: Login page not displayed [TC_001]"
                ),
                "Login page must be displayed [TC_001]"
            );
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
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingDashboardPage.validate(),
                    "SUCCESS: Dashboard displayed [TC_001]",
                    "FAILURE: Dashboard not displayed [TC_001]"
                ),
                "Dashboard must be displayed after valid login [TC_001]"
            );

            boolean authenticatedRoute = page.url().contains("dashboard")
                || page.url().contains("home")
                || page.url().contains("account");

            // TC_001
            Assert.assertTrue(
                TestReporter.assertCondition(
                    authenticatedRoute,
                    "SUCCESS: Authenticated route displayed [TC_001]",
                    "FAILURE: Authenticated route not displayed [TC_001]"
                ),
                "Authenticated route must be displayed [TC_001]"
            );

            // TC_001
            Assert.assertFalse(
                TestReporter.assertCondition(
                    bankingDashboardPage.getLoggedInUsername().isEmpty(),
                    "FAILURE: Dashboard username is empty [TC_001]",
                    "SUCCESS: Dashboard username is displayed [TC_001]"
                ),
                "Dashboard username must be displayed [TC_001]"
            );
        }
    }

    @Test(
        description = "TC_002: Valid login with OTP",
        priority = 2,
        groups = {"regression", "banking-login", "mfa"}
    )
    public void tc002_validLoginWithOtp() {
        TestReporter.startTest(
            "TC_002: Valid login with OTP",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 5: Enter valid credentials
        {
            bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);
        }

        // Step 6: Click Login
        {
            // loginFirstFactor performs the first-factor submission.
            // TC_002
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.validateOtpPage(),
                    "SUCCESS: OTP page displayed [TC_002]",
                    "FAILURE: OTP page not displayed [TC_002]"
                ),
                "OTP page must be displayed after first-factor login [TC_002]"
            );
        }

        // Step 7: Enter valid OTP
        {
            bankingLoginPage.submitOtp(validOtp);
        }

        // Step 8: Submit
        {
            // submitOtp performs the OTP submission.
            // TC_002
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingDashboardPage.validate(),
                    "SUCCESS: Dashboard displayed after MFA [TC_002]",
                    "FAILURE: Dashboard not displayed after MFA [TC_002]"
                ),
                "Dashboard must be displayed after OTP submission [TC_002]"
            );

            boolean authenticatedRoute = page.url().contains("dashboard")
                || page.url().contains("home")
                || page.url().contains("account");

            // TC_002
            Assert.assertTrue(
                TestReporter.assertCondition(
                    authenticatedRoute,
                    "SUCCESS: Authenticated route displayed after MFA [TC_002]",
                    "FAILURE: Authenticated route not displayed after MFA [TC_002]"
                ),
                "Authenticated route must be displayed after MFA [TC_002]"
            );

            // TC_002
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginSupportPage.isSecureRedirect(),
                    "SUCCESS: Secure redirect verified [TC_002]",
                    "FAILURE: Secure redirect could not be verified [TC_002]"
                ),
                "Secure redirect must be verified after MFA [TC_002]"
            );
        }
    }

    @Test(
        description = "TC_003: Invalid username with valid password",
        priority = 3,
        groups = {"regression", "banking-login", "negative"}
    )
    public void tc003_invalidUsername() {
        TestReporter.startTest(
            "TC_003: Invalid username",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 9: Enter invalid username
        {
            bankingLoginPage.enterUsername(invalidUsername);
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            // TC_003
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isErrorBannerDisplayed(),
                    "SUCCESS: Error banner displayed [TC_003]",
                    "FAILURE: Error banner not displayed [TC_003]"
                ),
                "Error banner must be displayed [TC_003]"
            );

            // TC_003
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getErrorBannerText()
                        .contains("Invalid username or password"),
                    "SUCCESS: Expected error text displayed [TC_003]",
                    "FAILURE: Expected error text missing [TC_003]"
                ),
                "Invalid username or password message must be displayed [TC_003]"
            );

            // TC_003
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.validate(),
                    "SUCCESS: User remains on login page [TC_003]",
                    "FAILURE: User left login page [TC_003]"
                ),
                "User must remain on login page [TC_003]"
            );
        }
    }

    @Test(
        description = "TC_004: Valid username with invalid password",
        priority = 4,
        groups = {"regression", "banking-login", "negative"}
    )
    public void tc004_invalidPassword() {
        TestReporter.startTest(
            "TC_004: Invalid password",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 10: Enter valid username
        {
            bankingLoginPage.enterUsername(invalidPasswordUser);
            bankingLoginPage.enterPassword(invalidPassword);
            bankingLoginPage.clickLoginButton();

            // TC_004
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isErrorBannerDisplayed(),
                    "SUCCESS: Error banner displayed [TC_004]",
                    "FAILURE: Error banner not displayed [TC_004]"
                ),
                "Error banner must be displayed [TC_004]"
            );
        }

        // Step 11: Enter invalid password
        {
            // The invalid password was submitted with the username in Step 10.
            TestReporter.step(11, "Enter invalid password");
        }
    }

    @Test(
        description = "TC_005: Both credentials invalid",
        priority = 5,
        groups = {"regression", "banking-login", "negative"}
    )
    public void tc005_bothInvalid() {
        TestReporter.startTest(
            "TC_005: Both credentials invalid",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 12: Enter invalid credentials
        {
            bankingLoginPage.enterUsername(bothInvalidUsername);
            bankingLoginPage.enterPassword(bothInvalidPassword);
            bankingLoginPage.clickLoginButton();

            // TC_005
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isErrorBannerDisplayed(),
                    "SUCCESS: Login denied with error banner [TC_005]",
                    "FAILURE: Error banner not displayed [TC_005]"
                ),
                "Invalid credentials must be rejected [TC_005]"
            );

            // TC_005
            Assert.assertFalse(
                TestReporter.assertCondition(
                    bankingLoginPage.getErrorBannerText().isEmpty(),
                    "FAILURE: Error message is empty [TC_005]",
                    "SUCCESS: Error message is non-empty [TC_005]"
                ),
                "Error message must be non-empty [TC_005]"
            );
        }
    }

    @Test(
        description = "TC_006: Empty username",
        priority = 6,
        groups = {"regression", "banking-login", "field-validation"}
    )
    public void tc006_emptyUsername() {
        TestReporter.startTest(
            "TC_006: Empty username",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 13: Leave username blank
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            // TC_006
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "SUCCESS: Username validation displayed [TC_006]",
                    "FAILURE: Username validation not displayed [TC_006]"
                ),
                "Username required validation must be displayed [TC_006]"
            );

            // TC_006
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getUsernameErrorText()
                        .toLowerCase()
                        .contains("username required"),
                    "SUCCESS: Username required text displayed [TC_006]",
                    "FAILURE: Username required text missing [TC_006]"
                ),
                "Username validation text must contain username required [TC_006]"
            );

            // TC_006
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.validate(),
                    "SUCCESS: User remains on login page [TC_006]",
                    "FAILURE: User left login page [TC_006]"
                ),
                "User must remain on login page [TC_006]"
            );
        }
    }

    @Test(
        description = "TC_007: Empty password",
        priority = 7,
        groups = {"regression", "banking-login", "field-validation"}
    )
    public void tc007_emptyPassword() {
        TestReporter.startTest(
            "TC_007: Empty password",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 14: Leave password blank
        {
            bankingLoginPage.enterUsername(validUsername);
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // TC_007
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "SUCCESS: Password validation displayed [TC_007]",
                    "FAILURE: Password validation not displayed [TC_007]"
                ),
                "Password required validation must be displayed [TC_007]"
            );

            // TC_007
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getPasswordErrorText()
                        .toLowerCase()
                        .contains("password required"),
                    "SUCCESS: Password required text displayed [TC_007]",
                    "FAILURE: Password required text missing [TC_007]"
                ),
                "Password validation text must contain password required [TC_007]"
            );

            // TC_007
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.validate(),
                    "SUCCESS: User remains on login page [TC_007]",
                    "FAILURE: User left login page [TC_007]"
                ),
                "User must remain on login page [TC_007]"
            );
        }
    }

    @Test(
        description = "TC_008: Both fields empty",
        priority = 8,
        groups = {"regression", "banking-login", "field-validation"}
    )
    public void tc008_bothFieldsEmpty() {
        TestReporter.startTest(
            "TC_008: Both fields empty",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 15: Click login without input
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "SUCCESS: Username validation displayed [TC_008]",
                    "FAILURE: Username validation not displayed [TC_008]"
                ),
                "Username required validation must be displayed [TC_008]"
            );

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getUsernameErrorText()
                        .toLowerCase()
                        .contains("username required"),
                    "SUCCESS: Username required text displayed [TC_008]",
                    "FAILURE: Username required text missing [TC_008]"
                ),
                "Username validation text must contain username required [TC_008]"
            );

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "SUCCESS: Password validation displayed [TC_008]",
                    "FAILURE: Password validation not displayed [TC_008]"
                ),
                "Password required validation must be displayed [TC_008]"
            );

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getPasswordErrorText()
                        .toLowerCase()
                        .contains("password required"),
                    "SUCCESS: Password required text displayed [TC_008]",
                    "FAILURE: Password required text missing [TC_008]"
                ),
                "Password validation text must contain password required [TC_008]"
            );

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginSupportPage.areRequiredFieldErrorsDisplayed(),
                    "SUCCESS: Both required-field validations displayed [TC_008]",
                    "FAILURE: Both required-field validations were not displayed [TC_008]"
                ),
                "Both required-field validations must be displayed [TC_008]"
            );
        }
    }
}
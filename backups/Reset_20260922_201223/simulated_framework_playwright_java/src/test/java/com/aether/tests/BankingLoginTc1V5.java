package com.aether.tests;

import com.aether.framework.core.BaseTest;
import com.aether.framework.core.ConfigReader;
import com.aether.framework.core.TestReporter;
import com.aether.pages.banking.BankingDashboardPage;
import com.aether.pages.banking.BankingLoginPage;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
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

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        bankingLoginPage = new BankingLoginPage(page);
        bankingDashboardPage = new BankingDashboardPage(page);

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

    @Test(
        description = "TC_001: Valid banking login",
        priority = 1,
        groups = {"smoke", "regression", "banking-login"}
    )
    public void tc001_validLogin() {
        TestReporter.startTest(
            "TC_001: Valid banking login",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        {
            page.navigate(ConfigReader.getBaseUrl());

            // TC_001
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.validate(),
                    "SUCCESS: Banking login page displayed [TC_001]",
                    "FAILURE: Banking login page was not displayed [TC_001]"
                ),
                "The banking login page must be displayed [TC_001]"
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
                    "SUCCESS: Banking dashboard displayed [TC_001]",
                    "FAILURE: Banking dashboard was not displayed [TC_001]"
                ),
                "Valid login must display the banking dashboard [TC_001]"
            );

            String displayedUsername = bankingDashboardPage.getLoggedInUsername();

            // TC_001
            Assert.assertTrue(
                TestReporter.assertCondition(
                    !displayedUsername.isEmpty(),
                    "SUCCESS: Logged-in username displayed [TC_001]",
                    "FAILURE: Logged-in username was not displayed [TC_001]"
                ),
                "The authenticated username must be displayed [TC_001]"
            );
        }
    }

    @Test(
        description = "TC_002: Valid banking login with OTP",
        priority = 2,
        groups = {"regression", "banking-login", "mfa"}
    )
    public void tc002_validLoginWithOtp() {
        TestReporter.startTest(
            "TC_002: Valid banking login with OTP",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 5: Enter valid OTP
        {
            bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);

            // TC_002
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.validateOtpPage(),
                    "SUCCESS: OTP verification page displayed [TC_002]",
                    "FAILURE: OTP verification page was not displayed [TC_002]"
                ),
                "First-factor login must display the OTP verification page [TC_002]"
            );
        }

        // Step 6: Submit
        {
            bankingLoginPage.submitOtp(validOtp);

            // TC_002
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingDashboardPage.validate(),
                    "SUCCESS: Dashboard displayed after OTP [TC_002]",
                    "FAILURE: Dashboard was not displayed after OTP [TC_002]"
                ),
                "Successful OTP submission must display the dashboard [TC_002]"
            );

            String displayedUsername = bankingDashboardPage.getLoggedInUsername();

            // TC_002
            Assert.assertTrue(
                TestReporter.assertCondition(
                    !displayedUsername.isEmpty(),
                    "SUCCESS: Logged-in username displayed after OTP [TC_002]",
                    "FAILURE: Logged-in username was not displayed after OTP [TC_002]"
                ),
                "The authenticated username must be displayed after OTP [TC_002]"
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
        softAssert = new SoftAssert();

        // Step 7: Enter invalid username + valid password
        {
            bankingLoginPage.enterUsername(invalidUsername);
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            String currentUrl = bankingLoginPage.getCurrentUrl();
            boolean remainsOnLoginRoute =
                currentUrl.equals(ConfigReader.getBaseUrl() + "/");
            boolean errorDisplayed = bankingLoginPage.isErrorBannerDisplayed();
            String errorText = errorDisplayed
                ? bankingLoginPage.getErrorBannerText()
                : "";

            // TC_003
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    remainsOnLoginRoute,
                    "SUCCESS: Invalid username did not create a session [TC_003]",
                    "FAILURE: Invalid username changed the login route [TC_003]"
                ),
                "Invalid username must not authenticate the user [TC_003]"
            );

            // TC_003
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    errorDisplayed,
                    "SUCCESS: Invalid-username error displayed [TC_003]",
                    "FAILURE: Invalid-username error was not displayed [TC_003]"
                ),
                "Invalid username must display an error [TC_003]"
            );

            // TC_003
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    errorText.contains("Invalid username or password"),
                    "SUCCESS: Invalid-username message is correct [TC_003]",
                    "FAILURE: Invalid-username message is incorrect [TC_003]"
                ),
                "The invalid-username message must identify invalid credentials [TC_003]"
            );

            softAssert.assertAll();
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
        softAssert = new SoftAssert();

        // Step 8: Enter valid username + invalid password
        {
            bankingLoginPage.enterUsername(invalidPasswordUser);
            bankingLoginPage.enterPassword(invalidPassword);
            bankingLoginPage.clickLoginButton();

            String currentUrl = bankingLoginPage.getCurrentUrl();
            boolean remainsOnLoginRoute =
                currentUrl.equals(ConfigReader.getBaseUrl() + "/");
            boolean errorDisplayed = bankingLoginPage.isErrorBannerDisplayed();
            String errorText = errorDisplayed
                ? bankingLoginPage.getErrorBannerText()
                : "";

            // TC_004
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    remainsOnLoginRoute,
                    "SUCCESS: Invalid password did not create a session [TC_004]",
                    "FAILURE: Invalid password changed the login route [TC_004]"
                ),
                "Invalid password must not authenticate the user [TC_004]"
            );

            // TC_004
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    errorDisplayed,
                    "SUCCESS: Invalid-password error displayed [TC_004]",
                    "FAILURE: Invalid-password error was not displayed [TC_004]"
                ),
                "An invalid password must display an error [TC_004]"
            );

            // TC_004
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    errorText.contains("Invalid username or password"),
                    "SUCCESS: Invalid-password message is correct [TC_004]",
                    "FAILURE: Invalid-password message is incorrect [TC_004]"
                ),
                "The invalid-password message must identify invalid credentials [TC_004]"
            );

            softAssert.assertAll();
        }
    }

    @Test(
        description = "TC_005: Invalid username and password",
        priority = 5,
        groups = {"regression", "banking-login", "negative"}
    )
    public void tc005_bothInvalid() {
        TestReporter.startTest(
            "TC_005: Both credentials invalid",
            "Requirement: REQ-BANK-AUTH-001"
        );
        softAssert = new SoftAssert();

        // Step 9: Enter invalid credentials
        {
            bankingLoginPage.enterUsername(bothInvalidUsername);
            bankingLoginPage.enterPassword(bothInvalidPassword);
            bankingLoginPage.clickLoginButton();

            String currentUrl = bankingLoginPage.getCurrentUrl();
            boolean remainsOnLoginRoute =
                currentUrl.equals(ConfigReader.getBaseUrl() + "/");
            boolean errorDisplayed = bankingLoginPage.isErrorBannerDisplayed();
            String errorText = errorDisplayed
                ? bankingLoginPage.getErrorBannerText()
                : "";

            // TC_005
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    remainsOnLoginRoute,
                    "SUCCESS: Both invalid credentials did not create a session [TC_005]",
                    "FAILURE: Both invalid credentials changed the login route [TC_005]"
                ),
                "Both invalid credentials must not authenticate the user [TC_005]"
            );

            // TC_005
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    errorDisplayed,
                    "SUCCESS: Login-denial error displayed [TC_005]",
                    "FAILURE: Login-denial error was not displayed [TC_005]"
                ),
                "Both invalid credentials must display an error [TC_005]"
            );

            // TC_005
            softAssert.assertTrue(
                TestReporter.assertCondition(
                    errorText.contains("Invalid username or password"),
                    "SUCCESS: Invalid-login message is correct [TC_005]",
                    "FAILURE: Invalid-login message is incorrect [TC_005]"
                ),
                "The invalid-login message must identify invalid credentials [TC_005]"
            );

            softAssert.assertAll();
        }
    }

    @Test(
        description = "TC_006: Blank username",
        priority = 6,
        groups = {"regression", "banking-login", "field-validation"}
    )
    public void tc006_emptyUsername() {
        TestReporter.startTest(
            "TC_006: Blank username",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 10: Leave username blank, click Login
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.enterPassword(validPassword);
            bankingLoginPage.clickLoginButton();

            // TC_006
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "SUCCESS: Username-required validation displayed [TC_006]",
                    "FAILURE: Username-required validation was not displayed [TC_006]"
                ),
                "Blank username must display required-field validation [TC_006]"
            );

            // TC_006
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getUsernameErrorText()
                        .toLowerCase()
                        .contains("username required"),
                    "SUCCESS: Username-required message is correct [TC_006]",
                    "FAILURE: Username-required message is incorrect [TC_006]"
                ),
                "Username validation must contain the required-field message [TC_006]"
            );
        }
    }

    @Test(
        description = "TC_007: Blank password",
        priority = 7,
        groups = {"regression", "banking-login", "field-validation"}
    )
    public void tc007_emptyPassword() {
        TestReporter.startTest(
            "TC_007: Blank password",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 11: Leave password blank, click Login
        {
            bankingLoginPage.enterUsername(validUsername);
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // TC_007
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "SUCCESS: Password-required validation displayed [TC_007]",
                    "FAILURE: Password-required validation was not displayed [TC_007]"
                ),
                "Blank password must display required-field validation [TC_007]"
            );

            // TC_007
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getPasswordErrorText()
                        .toLowerCase()
                        .contains("password required"),
                    "SUCCESS: Password-required message is correct [TC_007]",
                    "FAILURE: Password-required message is incorrect [TC_007]"
                ),
                "Password validation must contain the required-field message [TC_007]"
            );
        }
    }

    @Test(
        description = "TC_008: Login without input",
        priority = 8,
        groups = {"regression", "banking-login", "field-validation"}
    )
    public void tc008_bothFieldsEmpty() {
        TestReporter.startTest(
            "TC_008: Login without input",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 12: Click login without entering username or password
        {
            bankingLoginPage.clearUsername();
            bankingLoginPage.clearPassword();
            bankingLoginPage.clickLoginButton();

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isUsernameErrorDisplayed(),
                    "SUCCESS: Username-required validation displayed [TC_008]",
                    "FAILURE: Username-required validation was not displayed [TC_008]"
                ),
                "Blank username must display required-field validation [TC_008]"
            );

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getUsernameErrorText()
                        .toLowerCase()
                        .contains("username required"),
                    "SUCCESS: Username-required message is correct [TC_008]",
                    "FAILURE: Username-required message is incorrect [TC_008]"
                ),
                "Username validation must contain the required-field message [TC_008]"
            );

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.isPasswordErrorDisplayed(),
                    "SUCCESS: Password-required validation displayed [TC_008]",
                    "FAILURE: Password-required validation was not displayed [TC_008]"
                ),
                "Blank password must display required-field validation [TC_008]"
            );

            // TC_008
            Assert.assertTrue(
                TestReporter.assertCondition(
                    bankingLoginPage.getPasswordErrorText()
                        .toLowerCase()
                        .contains("password required"),
                    "SUCCESS: Password-required message is correct [TC_008]",
                    "FAILURE: Password-required message was incorrect [TC_008]"
                ),
                "Password validation must contain the required-field message [TC_008]"
            );
        }
    }
}
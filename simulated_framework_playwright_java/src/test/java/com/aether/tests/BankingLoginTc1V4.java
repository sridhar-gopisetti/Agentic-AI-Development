package com.aether.tests;

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

public class BankingLoginTc1V4 extends BaseTest {

    private BankingLoginPage bankingLoginPage;
    private BankingDashboardPage bankingDashboardPage;

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

    @AfterMethod(alwaysRun = true, dependsOnMethods = {})
    public void reportStatus(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            TestReporter.fail("TEST FAILED: " + result.getName());
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            TestReporter.pass("TEST PASSED: " + result.getName());
        }
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
        page.navigate(ConfigReader.getBaseUrl());
        boolean loginPageAvailable = bankingLoginPage.validate();
        // TC_001
        Assert.assertTrue(
            TestReporter.assertCondition(
                loginPageAvailable,
                "SUCCESS: Login page is available [TC_001]",
                "FAILURE: Login page is not available [TC_001]"
            ),
            "The login page must be available before authentication [TC_001]"
        );

        String loginPageUrl = bankingLoginPage.getCurrentUrl();
        boolean loginPageUsesHttps = loginPageUrl.startsWith("https://");
        // TC_001
        Assert.assertTrue(
            TestReporter.assertCondition(
                loginPageUsesHttps,
                "SUCCESS: HTTPS URL verified [TC_001]",
                "FAILURE: URL is not HTTPS [TC_001]"
            ),
            "The login page URL must use HTTPS [TC_001]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(validUsername);

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(validPassword);

        // Step 4: Click Login
        bankingLoginPage.clickLoginButton();

        boolean dashboardDisplayed = bankingDashboardPage.validate();
        // TC_001
        Assert.assertTrue(
            TestReporter.assertCondition(
                dashboardDisplayed,
                "SUCCESS: Banking dashboard displayed [TC_001]",
                "FAILURE: Banking dashboard was not displayed [TC_001]"
            ),
            "Valid login must display the banking dashboard [TC_001]"
        );

        String authenticatedUrl = bankingDashboardPage.getCurrentUrl();
        boolean authenticatedRoute = authenticatedUrl.contains("dashboard")
            || authenticatedUrl.contains("home")
            || authenticatedUrl.contains("account");
        // TC_001
        Assert.assertTrue(
            TestReporter.assertCondition(
                authenticatedRoute,
                "SUCCESS: Authenticated route detected [TC_001]",
                "FAILURE: Authenticated route not detected [TC_001]"
            ),
            "Valid login must navigate to an authenticated route [TC_001]"
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

        // Step 5: Enter valid credentials
        bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);

        // Step 6: Click Login
        boolean otpPageDisplayed = bankingLoginPage.validateOtpPage();
        // TC_002
        Assert.assertTrue(
            TestReporter.assertCondition(
                otpPageDisplayed,
                "SUCCESS: OTP page displayed [TC_002]",
                "FAILURE: OTP page was not displayed [TC_002]"
            ),
            "Valid MFA credentials must display the OTP page [TC_002]"
        );

        String otpPageUrl = bankingLoginPage.getCurrentUrl();
        boolean otpPageUsesHttps = otpPageUrl.startsWith("https://");
        // TC_002
        Assert.assertTrue(
            TestReporter.assertCondition(
                otpPageUsesHttps,
                "SUCCESS: HTTPS MFA URL verified [TC_002]",
                "FAILURE: MFA URL is not HTTPS [TC_002]"
            ),
            "The MFA flow URL must use HTTPS [TC_002]"
        );

        // Step 7: Enter valid OTP
        bankingLoginPage.submitOtp(validOtp);

        // Step 8: Submit
        boolean dashboardDisplayed = bankingDashboardPage.validate();
        // TC_002
        Assert.assertTrue(
            TestReporter.assertCondition(
                dashboardDisplayed,
                "SUCCESS: Dashboard displayed after OTP [TC_002]",
                "FAILURE: Dashboard was not displayed after OTP [TC_002]"
            ),
            "Successful OTP submission must display the dashboard [TC_002]"
        );

        String authenticatedUrl = bankingDashboardPage.getCurrentUrl();
        boolean authenticatedRoute = authenticatedUrl.contains("dashboard")
            || authenticatedUrl.contains("home")
            || authenticatedUrl.contains("account");
        // TC_002
        Assert.assertTrue(
            TestReporter.assertCondition(
                authenticatedRoute,
                "SUCCESS: Authenticated route detected after OTP [TC_002]",
                "FAILURE: Authenticated route not detected after OTP [TC_002]"
            ),
            "OTP completion must navigate to an authenticated route [TC_002]"
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

        // Step 9: Enter invalid username + valid password
        bankingLoginPage.login(invalidUsername, validPassword);

        boolean errorDisplayed = bankingLoginPage.isErrorBannerDisplayed();
        // TC_003
        Assert.assertTrue(
            TestReporter.assertCondition(
                errorDisplayed,
                "SUCCESS: Invalid-login error displayed [TC_003]",
                "FAILURE: Invalid-login error was not displayed [TC_003]"
            ),
            "An invalid username must display an error [TC_003]"
        );

        String errorText = bankingLoginPage.getErrorBannerText();
        // TC_003
        Assert.assertTrue(
            TestReporter.assertCondition(
                errorText.contains("Invalid username or password"),
                "SUCCESS: Expected invalid-credentials message displayed [TC_003]",
                "FAILURE: Unexpected invalid-credentials message [TC_003]"
            ),
            "The invalid-login message must identify invalid credentials [TC_003]"
        );

        // TC_003
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.validate(),
                "SUCCESS: User remains on login page [TC_003]",
                "FAILURE: User left the login page [TC_003]"
            ),
            "Failed authentication must keep the user on the login page [TC_003]"
        );
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

        // Step 10: Enter valid username + invalid password
        bankingLoginPage.login(invalidPasswordUser, invalidPassword);

        boolean errorDisplayed = bankingLoginPage.isErrorBannerDisplayed();
        // TC_004
        Assert.assertTrue(
            TestReporter.assertCondition(
                errorDisplayed,
                "SUCCESS: Invalid-password error displayed [TC_004]",
                "FAILURE: Invalid-password error was not displayed [TC_004]"
            ),
            "An invalid password must display an error [TC_004]"
        );

        String errorText = bankingLoginPage.getErrorBannerText();
        // TC_004
        Assert.assertTrue(
            TestReporter.assertCondition(
                errorText.contains("Invalid username or password"),
                "SUCCESS: Expected invalid-credentials message displayed [TC_004]",
                "FAILURE: Unexpected invalid-credentials message [TC_004]"
            ),
            "The invalid-password message must identify invalid credentials [TC_004]"
        );

        // TC_004
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.validate(),
                "SUCCESS: User remains on login page [TC_004]",
                "FAILURE: User left the login page [TC_004]"
            ),
            "Failed authentication must keep the user on the login page [TC_004]"
        );
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

        // Step 11: Enter invalid credentials
        bankingLoginPage.login(bothInvalidUsername, bothInvalidPassword);

        boolean errorDisplayed = bankingLoginPage.isErrorBannerDisplayed();
        // TC_005
        Assert.assertTrue(
            TestReporter.assertCondition(
                errorDisplayed,
                "SUCCESS: Login denied with error banner [TC_005]",
                "FAILURE: Login-denial error was not displayed [TC_005]"
            ),
            "Both invalid credentials must be rejected [TC_005]"
        );

        String errorText = bankingLoginPage.getErrorBannerText();
        // TC_005
        Assert.assertFalse(
            TestReporter.assertCondition(
                errorText.isEmpty(),
                "SUCCESS: Login-denial message is non-empty [TC_005]",
                "FAILURE: Login-denial message is empty [TC_005]"
            ),
            "A denied login must provide an error message [TC_005]"
        );

        // TC_005
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.validate(),
                "SUCCESS: User remains on login page [TC_005]",
                "FAILURE: User left the login page [TC_005]"
            ),
            "Failed authentication must keep the user on the login page [TC_005]"
        );
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

        // Step 12: Leave username blank, click Login
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

        String usernameError = bankingLoginPage.getUsernameErrorText().toLowerCase();
        // TC_006
        Assert.assertTrue(
            TestReporter.assertCondition(
                usernameError.contains("username required"),
                "SUCCESS: Username-required message is correct [TC_006]",
                "FAILURE: Username-required message is incorrect [TC_006]"
            ),
            "Username validation must contain the required-field message [TC_006]"
        );

        // TC_006
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.validate(),
                "SUCCESS: User remains on login page [TC_006]",
                "FAILURE: User left the login page [TC_006]"
            ),
            "Client-side validation must keep the user on the login page [TC_006]"
        );
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

        // Step 13: Leave password blank, click Login
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

        String passwordError = bankingLoginPage.getPasswordErrorText().toLowerCase();
        // TC_007
        Assert.assertTrue(
            TestReporter.assertCondition(
                passwordError.contains("password required"),
                "SUCCESS: Password-required message is correct [TC_007]",
                "FAILURE: Password-required message is incorrect [TC_007]"
            ),
            "Password validation must contain the required-field message [TC_007]"
        );

        // TC_007
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.validate(),
                "SUCCESS: User remains on login page [TC_007]",
                "FAILURE: User left the login page [TC_007]"
            ),
            "Client-side validation must keep the user on the login page [TC_007]"
        );
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

        // Step 14: Click login without entering username or password
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

        String usernameError = bankingLoginPage.getUsernameErrorText().toLowerCase();
        // TC_008
        Assert.assertTrue(
            TestReporter.assertCondition(
                usernameError.contains("username required"),
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

        String passwordError = bankingLoginPage.getPasswordErrorText().toLowerCase();
        // TC_008
        Assert.assertTrue(
            TestReporter.assertCondition(
                passwordError.contains("password required"),
                "SUCCESS: Password-required message is correct [TC_008]",
                "FAILURE: Password-required message is incorrect [TC_008]"
            ),
            "Password validation must contain the required-field message [TC_008]"
        );

        // TC_008
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.validate(),
                "SUCCESS: User remains on login page [TC_008]",
                "FAILURE: User left the login page [TC_008]"
            ),
            "Validation must keep the user on the login page [TC_008]"
        );
    }
}
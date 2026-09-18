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

public class BankingLoginTc1V3 extends BaseTest {

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
    private String lockedUsername;
    private String lockedPassword;
    private String disabledUsername;
    private String disabledPassword;
    private String expiredOtp;
    private String incorrectOtp;
    private String previouslyUsedOtp;

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
        lockedUsername = ConfigReader.get("banking.locked.username");
        lockedPassword = ConfigReader.get("banking.locked.password");
        disabledUsername = ConfigReader.get("banking.disabled.username");
        disabledPassword = ConfigReader.get("banking.disabled.password");
        expiredOtp = ConfigReader.get("banking.expired.otp");
        incorrectOtp = ConfigReader.get("banking.incorrect.otp");
        previouslyUsedOtp = ConfigReader.get("banking.previously.used.otp");

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
        bankingLoginPage.validate();
        // TC_001
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_001]",
                "FAILURE: Login page was not loaded over HTTPS [TC_001]"
            ),
            "The login page must load over HTTPS [TC_001]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(validUsername);

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(validPassword);

        // Step 4: Click Login
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

        String currentUrl = page.url();
        boolean authenticatedRoute = currentUrl.contains("dashboard")
            || currentUrl.contains("home")
            || currentUrl.contains("account");
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
        // TC_002
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS MFA page loaded [TC_002]",
                "FAILURE: MFA page was not loaded over HTTPS [TC_002]"
            ),
            "The MFA flow must load over HTTPS [TC_002]"
        );

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

        // Step 7: Enter valid OTP
        bankingLoginPage.submitOtp(validOtp);

        // Step 8: Submit
        // TC_002
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingDashboardPage.validate(),
                "SUCCESS: Dashboard displayed after OTP [TC_002]",
                "FAILURE: Dashboard was not displayed after OTP [TC_002]"
            ),
            "Successful OTP submission must display the dashboard [TC_002]"
        );

        String currentUrl = page.url();
        boolean authenticatedRoute = currentUrl.contains("dashboard")
            || currentUrl.contains("home")
            || currentUrl.contains("account");
        // TC_002
        Assert.assertTrue(
            TestReporter.assertCondition(
                authenticatedRoute,
                "SUCCESS: Authenticated route detected after OTP [TC_002]",
                "FAILURE: Authenticated route not detected after OTP [TC_002]"
            ),
            "OTP completion must navigate to an authenticated route [TC_002]"
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

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_003
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_003]",
                "FAILURE: Login page was not loaded over HTTPS [TC_003]"
            ),
            "The login page must load over HTTPS [TC_003]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(invalidUsername);

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(validPassword);

        // Step 4: Click Login
        bankingLoginPage.clickLoginButton();

        // TC_003
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.isErrorBannerDisplayed(),
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

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_004
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_004]",
                "FAILURE: Login page was not loaded over HTTPS [TC_004]"
            ),
            "The login page must load over HTTPS [TC_004]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(invalidPasswordUser);

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(invalidPassword);

        // Step 4: Click Login
        bankingLoginPage.clickLoginButton();

        // TC_004
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.isErrorBannerDisplayed(),
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

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_005
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_005]",
                "FAILURE: Login page was not loaded over HTTPS [TC_005]"
            ),
            "The login page must load over HTTPS [TC_005]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(bothInvalidUsername);

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(bothInvalidPassword);

        // Step 4: Click Login
        bankingLoginPage.clickLoginButton();

        // TC_005
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.isErrorBannerDisplayed(),
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

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_006
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_006]",
                "FAILURE: Login page was not loaded over HTTPS [TC_006]"
            ),
            "The login page must load over HTTPS [TC_006]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.clearUsername();

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(validPassword);

        // Step 4: Click Login
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

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_007
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_007]",
                "FAILURE: Login page was not loaded over HTTPS [TC_007]"
            ),
            "The login page must load over HTTPS [TC_007]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(validUsername);

        // Step 3: Enter valid password
        bankingLoginPage.clearPassword();

        // Step 4: Click Login
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

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_008
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_008]",
                "FAILURE: Login page was not loaded over HTTPS [TC_008]"
            ),
            "The login page must load over HTTPS [TC_008]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.clearUsername();

        // Step 3: Enter valid password
        bankingLoginPage.clearPassword();

        // Step 4: Click Login
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

    @Test(
        description = "TC_009: Locked account",
        priority = 9,
        groups = {"regression", "banking-login", "account-state"}
    )
    public void tc009_lockedAccount() {
        TestReporter.startTest(
            "TC_009: Locked account",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_009
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_009]",
                "FAILURE: Login page was not loaded over HTTPS [TC_009]"
            ),
            "The login page must load over HTTPS [TC_009]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(lockedUsername);

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(lockedPassword);

        // Step 4: Click Login
        bankingLoginPage.clickLoginButton();

        // TC_009
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertLockedAccountMessage(),
                "SUCCESS: Locked-account message verified [TC_009]",
                "FAILURE: Locked-account message was not verified [TC_009]"
            ),
            "Locked accounts must display the locked-account support message [TC_009]"
        );
    }

    @Test(
        description = "TC_010: Disabled account",
        priority = 10,
        groups = {"regression", "banking-login", "account-state"}
    )
    public void tc010_disabledAccount() {
        TestReporter.startTest(
            "TC_010: Disabled account",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_010
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_010]",
                "FAILURE: Login page was not loaded over HTTPS [TC_010]"
            ),
            "The login page must load over HTTPS [TC_010]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.enterUsername(disabledUsername);

        // Step 3: Enter valid password
        bankingLoginPage.enterPassword(disabledPassword);

        // Step 4: Click Login
        bankingLoginPage.clickLoginButton();

        // TC_010
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertDisabledAccountMessage(),
                "SUCCESS: Disabled-account message verified [TC_010]",
                "FAILURE: Disabled-account message was not verified [TC_010]"
            ),
            "Disabled accounts must display the disabled-account support message [TC_010]"
        );
    }

    @Test(
        description = "TC_011: Expired OTP rejected",
        priority = 11,
        groups = {"regression", "banking-login", "otp"}
    )
    public void tc011_expiredOtpRejected() {
        TestReporter.startTest(
            "TC_011: Expired OTP rejected",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_011
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_011]",
                "FAILURE: Login page was not loaded over HTTPS [TC_011]"
            ),
            "The login page must load over HTTPS [TC_011]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);

        // Step 3: Enter valid password
        bankingLoginPage.validateOtpPage();

        // Step 4: Click Login
        bankingLoginPage.submitExpiredOtp(expiredOtp);

        // Step 5: Enter valid OTP
        bankingLoginPage.submitOtp(expiredOtp);

        // TC_011
        Assert.assertTrue(
            TestReporter.assertCondition(
                !bankingDashboardPage.validate(),
                "SUCCESS: Expired OTP was rejected [TC_011]",
                "FAILURE: Expired OTP unexpectedly reached the dashboard [TC_011]"
            ),
            "An expired OTP must be rejected [TC_011]"
        );
    }

    @Test(
        description = "TC_012: OTP retry limit locks account",
        priority = 12,
        groups = {"regression", "banking-login", "otp"}
    )
    public void tc012_otpRetryLimitLocksAccount() {
        TestReporter.startTest(
            "TC_012: OTP retry limit locks account",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_012
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_012]",
                "FAILURE: Login page was not loaded over HTTPS [TC_012]"
            ),
            "The login page must load over HTTPS [TC_012]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);

        // Step 3: Enter valid password
        bankingLoginPage.validateOtpPage();

        // Step 4: Click Login
        bankingLoginPage.submitIncorrectOtpAttempts(incorrectOtp);

        // Step 5: Enter valid OTP
        bankingLoginPage.submitIncorrectOtpAttempts(incorrectOtp);

        // Step 6: Click Login
        // TC_012
        Assert.assertTrue(
            TestReporter.assertCondition(
                !bankingDashboardPage.validate(),
                "SUCCESS: Third incorrect OTP attempt did not authenticate [TC_012]",
                "FAILURE: Incorrect OTP attempts unexpectedly reached the dashboard [TC_012]"
            ),
            "Three incorrect OTP attempts must prevent successful authentication [TC_012]"
        );
    }

    @Test(
        description = "TC_013: Reused OTP rejected",
        priority = 13,
        groups = {"regression", "banking-login", "otp"}
    )
    public void tc013_reusedOtpRejected() {
        TestReporter.startTest(
            "TC_013: Reused OTP rejected",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_013
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_013]",
                "FAILURE: Login page was not loaded over HTTPS [TC_013]"
            ),
            "The login page must load over HTTPS [TC_013]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);

        // Step 3: Enter valid password
        bankingLoginPage.validateOtpPage();

        // Step 4: Click Login
        bankingLoginPage.submitOtp(validOtp);

        // Step 5: Enter valid OTP
        bankingDashboardPage.validate();

        // Step 6: Submit
        bankingDashboardPage.logout();

        // Step 7: Wait 5+ minutes
        bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);

        // Step 8: Enter the issued OTP
        bankingLoginPage.validateOtpPage();

        // Step 9: Enter an incorrect OTP 3 times in a row
        bankingLoginPage.providePreviouslyUsedOtp(previouslyUsedOtp);

        // Step 10: Complete a successful OTP login
        bankingLoginPage.submitOtp(previouslyUsedOtp);

        // TC_013
        Assert.assertTrue(
            TestReporter.assertCondition(
                !bankingDashboardPage.validate(),
                "SUCCESS: Previously-used OTP was rejected [TC_013]",
                "FAILURE: Previously-used OTP unexpectedly authenticated [TC_013]"
            ),
            "A previously-used OTP must be rejected [TC_013]"
        );
    }

    @Test(
        description = "TC_014: Valid six-digit OTP accepted",
        priority = 14,
        groups = {"regression", "banking-login", "otp"}
    )
    public void tc014_validOtpFormatAccepted() {
        TestReporter.startTest(
            "TC_014: Valid six-digit OTP accepted",
            "Requirement: REQ-BANK-AUTH-001"
        );

        // Step 1: Open login page
        page.navigate(ConfigReader.getBaseUrl());
        bankingLoginPage.validate();
        // TC_014
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertHttpsPageLoad(),
                "SUCCESS: HTTPS login page loaded [TC_014]",
                "FAILURE: Login page was not loaded over HTTPS [TC_014]"
            ),
            "The login page must load over HTTPS [TC_014]"
        );

        // Step 2: Enter valid username
        bankingLoginPage.loginFirstFactor(mfaUsername, mfaPassword);

        // Step 3: Enter valid password
        bankingLoginPage.validateOtpPage();

        // Step 4: Click Login
        // TC_014
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingLoginPage.assertOtpFormat(validOtp),
                "SUCCESS: OTP has six numeric digits [TC_014]",
                "FAILURE: OTP is not six numeric digits [TC_014]"
            ),
            "The OTP must contain exactly six numeric digits [TC_014]"
        );

        // Step 5: Enter valid OTP
        bankingLoginPage.submitOtp(validOtp);

        // Step 6: Submit
        // TC_014
        Assert.assertTrue(
            TestReporter.assertCondition(
                bankingDashboardPage.validate(),
                "SUCCESS: Dashboard displayed after valid OTP [TC_014]",
                "FAILURE: Dashboard was not displayed after valid OTP [TC_014]"
            ),
            "A valid OTP must complete authentication [TC_014]"
        );
    }
}
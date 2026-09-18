package com.automation.tests;

import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.automation.pages.LoginPage;
import com.automation.utils.ScreenshotUtils;

import static org.testng.Assert.assertTrue;

public class ValidLoginTest extends BaseTest {

    private LoginPage loginPage;

    @Override
    @BeforeClass
    public void setUp() {
        super.setUp();
        loginPage = new LoginPage(driver);
    }

    @Test
    public void testValidLoginShowsDashboard() {
        // ── Step 1: Open the login page ───────────────────────────────────────
        loginPage.navigateToLoginPage();

        // ── Step 2: Enter a valid username ────────────────────────────────────
        // ── Step 3: Enter a valid password ────────────────────────────────────
        // ── Step 4: Submit the form ───────────────────────────────────────────
        loginPage.loginAsValidUser();

        // ── Step 5: Confirm the dashboard is shown ────────────────────────────
        // @TC-001 / REQ-LOGIN-001
        assertTrue(loginPage.isDashboardDisplayed(), "Dashboard should be visible after login");
    }

    @Override
    @AfterMethod
    public void tearDown(ITestResult result) {
        if (!result.isSuccess()) {
            ScreenshotUtils.captureScreenshot(driver, result.getName());
        }
        super.tearDown(result);
    }
}
package com.aether.framework.core;

import com.microsoft.playwright.*;

/**
 * PlaywrightManager — manages Playwright Browser lifecycle per test thread.
 *
 * Provides:
 *  - Thread-safe Playwright / Browser / BrowserContext / Page instances
 *  - Chromium-first with optional Firefox/WebKit via config
 *  - Headless mode controlled by config.properties
 *
 * Rule compliance:
 *   PJ-001  Single Playwright instance per thread
 *   PJ-002  BrowserContext per test class (clean cookie/storage state)
 *   PJ-003  Page per test method
 */
public class PlaywrightManager {

    private static final ThreadLocal<Playwright>       playwright       = new ThreadLocal<>();
    private static final ThreadLocal<Browser>          browser          = new ThreadLocal<>();
    private static final ThreadLocal<BrowserContext>   browserContext   = new ThreadLocal<>();
    private static final ThreadLocal<Page>             page             = new ThreadLocal<>();

    // ── Initialisation ────────────────────────────────────────────────────────

    /**
     * Creates a new Playwright + Browser instance for the current thread.
     * Call once per test class in @BeforeClass.
     */
    public static void initBrowser() {
        Playwright pw = Playwright.create();
        playwright.set(pw);

        String browserName = ConfigReader.get("playwright.browser", "chromium").toLowerCase();
        boolean headless   = Boolean.parseBoolean(ConfigReader.get("playwright.headless", "true"));

        BrowserType.LaunchOptions opts = new BrowserType.LaunchOptions()
                .setHeadless(headless)
                .setSlowMo(Double.parseDouble(ConfigReader.get("playwright.slow_mo", "0")));

        Browser br = switch (browserName) {
            case "firefox" -> pw.firefox().launch(opts);
            case "webkit"  -> pw.webkit().launch(opts);
            default        -> pw.chromium().launch(opts);
        };
        browser.set(br);
    }

    /**
     * Opens a fresh BrowserContext (isolated cookies/storage).
     * Call in @BeforeMethod.
     */
    public static void openContext() {
        BrowserContext ctx = browser.get().newContext(
                new Browser.NewContextOptions()
                        .setViewportSize(1280, 720)
                        .setIgnoreHTTPSErrors(true)
        );
        browserContext.set(ctx);
        page.set(ctx.newPage());
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    /** Returns the current test's Page. */
    public static Page getPage() {
        return page.get();
    }

    /** Returns the current BrowserContext. */
    public static BrowserContext getContext() {
        return browserContext.get();
    }

    // ── Teardown ──────────────────────────────────────────────────────────────

    /**
     * Closes the BrowserContext (and its Page).
     * Call in @AfterMethod.
     */
    public static void closeContext() {
        BrowserContext ctx = browserContext.get();
        if (ctx != null) {
            ctx.close();
            browserContext.remove();
            page.remove();
        }
    }

    /**
     * Quits the Browser and Playwright runtime.
     * Call in @AfterClass.
     */
    public static void quitBrowser() {
        Browser br = browser.get();
        if (br != null) { br.close(); browser.remove(); }

        Playwright pw = playwright.get();
        if (pw != null) { pw.close(); playwright.remove(); }
    }
}

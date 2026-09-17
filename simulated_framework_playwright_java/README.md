# AETHER Playwright-Java Framework

**AETHER-Generated** automation framework using **Microsoft Playwright for Java** + **TestNG** + **ExtentReports**.

---

## Overview

| Property | Value |
|---|---|
| **Framework** | playwright-java |
| **Source Input** | `input/Banking_Login_TC_1.pdf` |
| **Requirement** | REQ-BANK-AUTH-001 |
| **Test Suite** | Banking Login — TC_001 to TC_008 |
| **Target AUT** | `http://localhost:3000` (mock_aut/server.js) |
| **Java Version** | 11+ |
| **Build Tool** | Maven 3.8+ |
| **Test Runner** | TestNG 7.8.0 |
| **Browser API** | Microsoft Playwright for Java 1.44.0 |

---

## Project Structure

```
simulated_framework_playwright_java/
├── pom.xml                                           # Maven build descriptor
├── testng.xml                                        # TestNG suite configuration
├── src/
│   ├── main/
│   │   ├── java/com/aether/framework/core/
│   │   │   ├── BasePage.java                        # Abstract base for all POMs
│   │   │   ├── BaseTest.java                        # Abstract base for all tests
│   │   │   ├── ConfigReader.java                    # Config/property access
│   │   │   ├── PlaywrightManager.java               # Browser lifecycle manager
│   │   │   └── TestReporter.java                    # ExtentReports wrapper
│   │   └── resources/
│   │       └── config.properties                    # Runtime configuration
│   └── test/
│       ├── java/com/aether/
│       │   ├── pages/banking/
│       │   │   ├── BankingLoginPage.java            # POM — Login page
│       │   │   └── BankingDashboardPage.java        # POM — Dashboard page
│       │   └── tests/functional/banking/
│       │       └── Rev1_WA_Banking_Login.java       # TC_001 – TC_008 test class
│       └── resources/fixtures/
│           └── banking-users.json                   # Test data fixtures
```

---

## Test Cases

| TC ID | Scenario | Priority | Groups |
|---|---|---|---|
| TC_001 | Valid Login (username + password) | 1 | smoke, regression |
| TC_002 | Valid Login with OTP (MFA) | 2 | regression, mfa |
| TC_003 | Invalid username | 3 | regression, negative |
| TC_004 | Invalid password | 4 | regression, negative |
| TC_005 | Both credentials invalid | 5 | regression, negative |
| TC_006 | Empty username validation | 6 | regression, field-validation |
| TC_007 | Empty password validation | 7 | regression, field-validation |
| TC_008 | Both fields empty validation | 8 | regression, field-validation |

---

## Prerequisites

1. **Java 11+** — `java --version`
2. **Maven 3.8+** — `mvn --version`
3. **Node.js 18+** — required for `mock_aut/server.js`
4. **Playwright browsers** — installed automatically on first `mvn test` run via `playwright install`

---

## Running Tests

### Start the Mock AUT (required)
```bash
cd mock_aut
node server.js
# AUT running at http://localhost:3000
```

Inside the AETHER compose stack you do not do this by hand: the `mock-aut` service in the
`services` profile runs the same file, svc-runner waits for its healthcheck, and the address
arrives as the `BASE_URL` environment variable. See [ADR §6.27](../docs/ADR_accepted_deviations.md).

**The credentials in `config.properties` must match `mock_aut/server.js`'s store.** The
banking form (`#bankingUsername` → `/banking/login`) knows `john.doe@bank.com`;
`mfa.user@bank.com` is the one enrolled in the second factor, which is why TC_001 and TC_002
use different users. The `admin`/`password` pair belongs to the *system* login form further
down the same page and is not this suite's. `tests/test_mock_aut_wiring.py` asserts the
agreement, because a wrong username and an absent AUT produce the same red.

### Run full suite
```bash
cd simulated_framework_playwright_java
mvn test
```

### Run smoke tests only
```bash
mvn test -Dgroups=smoke
```

### Run with custom URL
```bash
mvn test -Dbase.url=http://localhost:4000
```

This said `-DBASE_URL=…` and that never worked. `ConfigReader` looks up the *key*
`base.url` as a system property and only then the environment variable `BASE_URL`
(dots to underscores, upper-cased), so a system property named `BASE_URL` matches
neither step and the value from `config.properties` won every time. The other working
form is the environment variable, which is how the container sets it:

```bash
BASE_URL=http://mock-aut:3000 mvn test
```

### Headful (headed) mode for debugging
```bash
mvn test -Dplaywright.headless=false
```

---

## Reports

After execution, reports are generated in:

- **ExtentReports HTML** → `target/surefire-reports/AETHER-Playwright-Java-Report-*.html`
- **Screenshots** (on failure) → `target/surefire-reports/screenshots/`
- **TestNG XML reports** → `target/surefire-reports/`

---

## Design Decisions

| Decision | Rationale |
|---|---|
| Playwright over Selenium | Native async auto-waiting, no explicit `WebDriverWait` boilerplate |
| `BrowserContext` per test | Isolated cookie/storage state — no test-to-test leakage |
| `ConfigReader` for all config | Zero hardcoded credentials; supports -D system properties, env vars, properties file |
| ExtentReports | Rich HTML report with screenshots, step logs, traceability tags |
| TestNG priority + groups | Smoke/regression/negative/field-validation separation |

---

## Compliance Rules Satisfied

| Rule | Description |
|---|---|
| PJ-001 | Single Playwright instance per thread (ThreadLocal) |
| PJ-002 | BrowserContext per test method |
| PJ-003 | Page per test method |
| PJ-004 | Page Object Model throughout |
| PJ-005 | CSS / ID locators only |
| PJ-006 | Explicit waits — zero Thread.sleep |
| PJ-007 | No hardcoded credentials |
| PJ-008 | validate() guard in every POM |
| PJ-009 | Every test class extends BaseTest |
| PJ-010 | BeforeMethod / AfterMethod lifecycle |
| PJ-011 | All assertions via TestNG Assert + TestReporter |
| PJ-012 | Traceability tags on every assertion |
| PJ-013 | 1:1:1 manual step → test step → traceability comment |

---

*Generated by AETHER Automation Code Generator — Stage 4*

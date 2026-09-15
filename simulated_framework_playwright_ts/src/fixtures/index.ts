/**
 * Custom Playwright fixtures
 * AETHER Simulated Framework — playwright-typescript
 *
 * Extends the base `test` object with typed page-object fixtures,
 * following the @playwright/test fixture model (PT-001, PT-002).
 *
 * Traceability:
 *   Framework: playwright-typescript
 *   Rule refs:  PT-001, PT-002, PT-004
 *
 * Updated: ACG-RUN-20260729-001 — added PracticeSoftwareTesting.com page objects
 * Updated: ACG-RUN-20260802-001 — added SauceDemo (Swag Labs) page objects
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CustomerListPage } from '../pages/CustomerListPage';
import { CustomerProfilePage } from '../pages/CustomerProfilePage';
import { BankingLoginPage } from '../pages/BankingLoginPage';
import { BankingDashboardPage } from '../pages/BankingDashboardPage';
// PracticeSoftwareTesting.com page objects (ACG-RUN-20260729-001)
import { PSTLoginPage } from '../pages/PSTLoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ContactPage } from '../pages/ContactPage';
import { WishlistPage } from '../pages/WishlistPage';
// SauceDemo (Swag Labs) page objects (ACG-RUN-20260802-001)
import { SauceDemoLoginPage } from '../pages/SauceDemoLoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SauceDemoCartPage } from '../pages/SauceDemoCartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

// ── Fixture type declarations ─────────────────────────────────────────────────

type AetherFixtures = {
  // Existing fixtures
  loginPage: LoginPage;
  customerListPage: CustomerListPage;
  customerProfilePage: CustomerProfilePage;
  bankingLoginPage: BankingLoginPage;
  bankingDashboardPage: BankingDashboardPage;
  // PracticeSoftwareTesting.com fixtures
  pstLoginPage: PSTLoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  registerPage: RegisterPage;
  profilePage: ProfilePage;
  contactPage: ContactPage;
  wishlistPage: WishlistPage;
  // SauceDemo (Swag Labs) fixtures (ACG-RUN-20260802-001)
  sauceDemoLoginPage: SauceDemoLoginPage;
  inventoryPage: InventoryPage;
  productDetailPage: ProductDetailPage;
  sauceDemoCartPage: SauceDemoCartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

// ── Extended test object ──────────────────────────────────────────────────────

export const test = base.extend<AetherFixtures>({
  // ── Existing fixtures ──────────────────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  customerListPage: async ({ page }, use) => {
    await use(new CustomerListPage(page));
  },
  customerProfilePage: async ({ page }, use) => {
    await use(new CustomerProfilePage(page));
  },
  bankingLoginPage: async ({ page }, use) => {
    await use(new BankingLoginPage(page));
  },
  bankingDashboardPage: async ({ page }, use) => {
    await use(new BankingDashboardPage(page));
  },
  // ── PracticeSoftwareTesting.com fixtures (ACG-RUN-20260729-001) ────────────
  pstLoginPage: async ({ page }, use) => {
    await use(new PSTLoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },
  // ── SauceDemo (Swag Labs) fixtures (ACG-RUN-20260802-001) ─────────────────
  sauceDemoLoginPage: async ({ page }, use) => {
    await use(new SauceDemoLoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  sauceDemoCartPage: async ({ page }, use) => {
    await use(new SauceDemoCartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect } from '@playwright/test';

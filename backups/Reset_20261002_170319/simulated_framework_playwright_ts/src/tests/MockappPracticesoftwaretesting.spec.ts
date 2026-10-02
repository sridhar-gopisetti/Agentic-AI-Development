// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: four PST workflows)
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// PST_EMAIL  → set PST_EMAIL in .env
// PST_PASSWORD  → set PST_PASSWORD in .env
// PST_BILLING_*  → set billing fields in .env
// PST_CARD_*  → set mock card fields in .env
// PST_REG_*  → set registration fields in .env
// PST_CONTACT_EMAIL  → set PST_CONTACT_EMAIL in .env
// PST_CONTACT_MESSAGE  → set PST_CONTACT_MESSAGE in .env
// PST_CONTACT_ATTACHMENT_PATH  → set PST_CONTACT_ATTACHMENT_PATH in .env
// PST_HAMMER_SELECTOR  → set PST_HAMMER_SELECTOR in .env
// PST_SANDER_SELECTOR  → set PST_SANDER_SELECTOR in .env
// PST_CART_NAV_SELECTOR  → set PST_CART_NAV_SELECTOR in .env
// PST_PROFILE_NAV_SELECTOR  → set PST_PROFILE_NAV_SELECTOR in .env
// PST_CONTACT_NAV_SELECTOR  → set PST_CONTACT_NAV_SELECTOR in .env
// PST_FAVORITES_PATH  → set PST_FAVORITES_PATH in .env
// PST_SORT_PRICE_ASC_VALUE  → set PST_SORT_PRICE_ASC_VALUE in .env
// PST_CONTACT_CONFIRMATION_TIMEOUT  → set PST_CONTACT_CONFIRMATION_TIMEOUT in .env
// CheckoutPage.enterPromoCode()  → implement the approved Page Object stub
// CheckoutPage.applyPromoCode()  → implement the approved Page Object stub
// CheckoutPage.getDiscountLocator()  → implement the approved Page Object stub
// CheckoutPage.getOrderId()  → implement the approved Page Object stub
// WishlistPage.getWishlistCount()  → implement the approved Page Object stub
// ════════════════════════════════════════════════════

import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';
import type { BillingAddress, CardDetails } from '../pages/CheckoutPage';
import type { RegistrationData } from '../pages/RegisterPage';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

// STUB: PST_EMAIL not confirmed — using empty value
const pstEmail = process.env.PST_EMAIL ?? '';

// STUB: PST_PASSWORD not confirmed — using empty value
const pstPassword = process.env.PST_PASSWORD ?? '';

const billingAddress: BillingAddress = {
  // STUB: PST_BILLING_STREET not confirmed — using empty value
  street: process.env.PST_BILLING_STREET ?? '',
  // STUB: PST_BILLING_CITY not confirmed — using empty value
  city: process.env.PST_BILLING_CITY ?? '',
  // STUB: PST_BILLING_STATE not confirmed — using empty value
  state: process.env.PST_BILLING_STATE ?? '',
  // STUB: PST_BILLING_COUNTRY not confirmed — using empty value
  country: process.env.PST_BILLING_COUNTRY ?? '',
  // STUB: PST_BILLING_POSTCODE not confirmed — using empty value
  postcode: process.env.PST_BILLING_POSTCODE ?? '',
  // STUB: PST_BILLING_HOUSE_NUMBER not confirmed — using empty value
  houseNumber: process.env.PST_BILLING_HOUSE_NUMBER ?? '',
};

const cardDetails: CardDetails = {
  // STUB: PST_CARD_NUMBER not confirmed — using empty value
  number: process.env.PST_CARD_NUMBER ?? '',
  // STUB: PST_CARD_EXPIRY not confirmed — using empty value
  expiry: process.env.PST_CARD_EXPIRY ?? '',
  // STUB: PST_CARD_CVV not confirmed — using empty value
  cvv: process.env.PST_CARD_CVV ?? '',
  // STUB: PST_CARD_HOLDER not confirmed — using empty value
  holder: process.env.PST_CARD_HOLDER ?? '',
};

const registrationData: RegistrationData = {
  // STUB: PST_REG_FIRST_NAME not confirmed — using empty value
  firstName: process.env.PST_REG_FIRST_NAME ?? '',
  // STUB: PST_REG_LAST_NAME not confirmed — using empty value
  lastName: process.env.PST_REG_LAST_NAME ?? '',
  // STUB: PST_REG_DOB not confirmed — using empty value
  dob: process.env.PST_REG_DOB ?? '',
  // STUB: PST_REG_ADDRESS not confirmed — using empty value
  address: process.env.PST_REG_ADDRESS ?? '',
  // STUB: PST_REG_HOUSE_NUMBER not confirmed — using empty value
  houseNumber: process.env.PST_REG_HOUSE_NUMBER ?? '',
  // STUB: PST_REG_CITY not confirmed — using empty value
  city: process.env.PST_REG_CITY ?? '',
  // STUB: PST_REG_STATE not confirmed — using empty value
  state: process.env.PST_REG_STATE ?? '',
  // STUB: PST_REG_COUNTRY not confirmed — using empty value
  country: process.env.PST_REG_COUNTRY ?? '',
  // STUB: PST_REG_POSTCODE not confirmed — using empty value
  postcode: process.env.PST_REG_POSTCODE ?? '',
  // STUB: PST_REG_PHONE not confirmed — using empty value
  phone: process.env.PST_REG_PHONE ?? '',
  // STUB: PST_REG_EMAIL not confirmed — using empty value
  email: process.env.PST_REG_EMAIL ?? `test_user_${Date.now()}@example.com`,
  // STUB: PST_REG_PASSWORD not confirmed — using empty value
  password: process.env.PST_REG_PASSWORD ?? '',
};

const contactName = process.env.PST_CONTACT_NAME ?? 'QA Tester';
// STUB: PST_CONTACT_EMAIL not confirmed — using empty value
const contactEmail = process.env.PST_CONTACT_EMAIL ?? '';
// STUB: PST_CONTACT_MESSAGE not confirmed — using empty value
const contactMessage = process.env.PST_CONTACT_MESSAGE ?? '';
// STUB: PST_CONTACT_ATTACHMENT_PATH not confirmed — using empty value
const attachmentPath = process.env.PST_CONTACT_ATTACHMENT_PATH ?? '';

const searchTerm = process.env.PST_SEARCH_TERM ?? 'Drill';
const promoCode = process.env.PST_PROMO_CODE ?? 'SPRING20';

test.describe('PracticeSoftwareTesting.com — Automated Functional Coverage', () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: testInfo.outputPath('screenshot-on-failure.png'),
      });
    }
  });

  test.describe('TC-ACG-RU-001 — Complex Multi-Item Checkout', () => {
    test.beforeEach(async ({ pstLoginPage }) => {
      await pstLoginPage.navigateTo('/auth/login');
      await pstLoginPage.login(pstEmail, pstPassword);
    });

    test(
      '[TC-ACG-RU-001][SCR-ACG-RU-001] Complex Multi-Item Checkout with Promo Code Validation',
      async ({ page, homePage, productPage, cartPage, checkoutPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-001
        // script_id    : SCR-ACG-RU-001
        // acg_run_id   : ACG-RUN-20261002-018
        // ─────────────────────────────────────────────────────────

        // Step 1 — Navigate to the homepage and select the "Hand Tools" category from the sidebar menu practicesoftwaretesting.com.
        await test.step('Step 1 — Navigate to the homepage and select the "Hand Tools" category', async () => {
          await homePage.navigateTo('/');
          await homePage.clickCategory('Hand Tools');
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(homePage.getCategoryPageTitleLocator()).toBeVisible();
        });

        // Step 2 — Locate the "Hammer" product, click on it to open the product details page, change the quantity to "2", and click "Add to cart".
        await test.step('Step 2 — Open Hammer, set quantity to 2, and add it to cart', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const hammerSelector = process.env.PST_HAMMER_SELECTOR ?? '';
          const hammerProduct: Locator = page.locator(hammerSelector);
          await hammerProduct.waitFor({ state: 'visible' });
          await hammerProduct.click();
          await productPage.setQuantity(2);
          await productPage.clickAddToCart();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(productPage.getSuccessToastLocator()).toBeVisible();
        });

        // Step 3 — Return to the homepage, select "Power Tools", click on the "Sander" product, and click "Add to cart" (quantity 1).
        await test.step('Step 3 — Return home, select Power Tools, open Sander, and add it to cart', async () => {
          await homePage.navigateTo('/');
          await homePage.clickCategory('Power Tools');
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const sanderSelector = process.env.PST_SANDER_SELECTOR ?? '';
          const sanderProduct: Locator = page.locator(sanderSelector);
          await sanderProduct.waitFor({ state: 'visible' });
          await sanderProduct.click();
          await productPage.clickAddToCart();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(productPage.getSuccessToastLocator()).toBeVisible();
        });

        // Step 4 — Click on the shopping cart icon in the top right corner to open the shopping cart overview page.
        await test.step('Step 4 — Open the shopping cart overview page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const cartSelector = process.env.PST_CART_NAV_SELECTOR ?? '';
          const cartNavigation: Locator = page.locator(cartSelector);
          await cartNavigation.waitFor({ state: 'visible' });
          await cartNavigation.click();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(cartPage.getCartTableLocator()).toBeVisible();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(cartPage.getProductRowLocator('Hammer')).toBeVisible();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(cartPage.getProductRowLocator('Sander')).toBeVisible();
        });

        // Step 5 — Proceed to checkout, fill out the billing address information, navigate to the Payment step, enter promo code SPRING20, and click "Apply".
        await test.step('Step 5 — Complete billing navigation and apply promo code SPRING20', async () => {
          await cartPage.clickProceedToCheckout();
          await checkoutPage.clickProceedStep2();
          await checkoutPage.fillBillingAddress(billingAddress);
          await checkoutPage.clickProceedCheckout();
          await checkoutPage.enterPromoCode(promoCode);
          await checkoutPage.applyPromoCode();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(checkoutPage.getDiscountLocator()).toBeVisible();
        });

        // Step 6 — Select "Credit Card" as the payment method, enter valid mock card details, and click "Confirm".
        await test.step('Step 6 — Select Credit Card, enter card details, and confirm payment', async () => {
          await checkoutPage.selectCreditCard();
          await checkoutPage.fillCardDetails(cardDetails);
          await checkoutPage.clickConfirm();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(checkoutPage.getOrderSuccessLocator()).toBeVisible();
          const orderId = await checkoutPage.getOrderId();
          // Traceability: TC-ACG-RU-001 | RIARA-TC-01
          await expect(orderId).not.toBe('');
        });
      },
    );
  });

  test.describe('TC-ACG-RU-002 — User Account Registration & Profile Data Persistence', () => {
    test.beforeEach(async ({ registerPage }) => {
      await registerPage.navigateTo('/auth/register');
    });

    test(
      '[TC-ACG-RU-002][SCR-ACG-RU-002] User Account Registration & Profile Data Persistence',
      async ({ page, registerPage, pstLoginPage, profilePage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-002
        // script_id    : SCR-ACG-RU-002
        // acg_run_id   : ACG-RUN-20261002-018
        // ─────────────────────────────────────────────────────────

        // Step 7 — Navigate directly to the registration interface: practicesoftwaretesting.com.
        await test.step('Step 7 — Navigate to the registration interface', async () => {
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(registerPage.getRegisterButtonLocator()).toBeVisible();
        });

        // Step 8 — Enter valid data into all required fields and click "Register".
        await test.step('Step 8 — Fill all required registration fields and click Register', async () => {
          await registerPage.fillRegistrationForm(registrationData);
          await registerPage.clickRegister();
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(page).toHaveURL(/auth\/login/);
        });

        // Step 9 — On the login screen, enter the newly created email address and password credentials, then click "Login".
        await test.step('Step 9 — Log in with the newly created credentials', async () => {
          await pstLoginPage.login(
            registrationData.email,
            registrationData.password,
          );
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(page).toHaveURL(/account/);
        });

        // Step 10 — Click on the "Profile" link or user icon located in the main navigation header.
        await test.step('Step 10 — Navigate to the Profile page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const profileSelector = process.env.PST_PROFILE_NAV_SELECTOR ?? '';
          const profileNavigation: Locator = page.locator(profileSelector);
          await profileNavigation.waitFor({ state: 'visible' });
          await profileNavigation.click();
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(profilePage.getPageHeaderLocator()).toBeVisible();
        });

        // Step 11 — Verify that every text field on the screen exactly matches the strings entered during registration.
        await test.step('Step 11 — Verify profile fields match registration data', async () => {
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(profilePage.getAddressLocator()).toHaveValue(registrationData.address);
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(profilePage.getPhoneLocator()).toHaveValue(registrationData.phone);
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(profilePage.getCityLocator()).toHaveValue(registrationData.city);
          // Traceability: TC-ACG-RU-002 | RIARA-TC-02
          await expect(profilePage.getPostcodeLocator()).toHaveValue(registrationData.postcode);
        });
      },
    );
  });

  test.describe('TC-ACG-RU-003 — Contact Form Customer Support Attachment Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(baseUrl);
    });

    test(
      '[TC-ACG-RU-003][SCR-ACG-RU-003] Contact Form Customer Support Attachment Flow',
      async ({ page, contactPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-003
        // script_id    : SCR-ACG-RU-003
        // acg_run_id   : ACG-RUN-20261002-018
        // ─────────────────────────────────────────────────────────

        // Step 12 — Click on the "Contact" option in the top navigation menu bar.
        await test.step('Step 12 — Open the Contact page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const contactSelector = process.env.PST_CONTACT_NAV_SELECTOR ?? '';
          const contactNavigation: Locator = page.locator(contactSelector);
          await contactNavigation.waitFor({ state: 'visible' });
          await contactNavigation.click();
          // Traceability: TC-ACG-RU-003 | RIARA-TC-03
          await expect(contactPage.getSendButtonLocator()).toBeVisible();
        });

        // Step 13 — Select "Customer Service" from the Subject dropdown menu list.
        await test.step('Step 13 — Select Customer Service from Subject', async () => {
          await contactPage.selectSubject('Customer Service');
          // Traceability: TC-ACG-RU-003 | RIARA-TC-03
          await expect(contactPage.getSendButtonLocator()).toBeVisible();
        });

        // Step 14 — Populate the Name field with "QA Tester", enter a valid format email address, and type a detailed description into the Message field.
        await test.step('Step 14 — Fill Name, Email, and Message', async () => {
          await contactPage.fillName(contactName);
          await contactPage.fillEmail(contactEmail);
          await contactPage.fillMessage(contactMessage);
        });

        // Step 15 — Click the "Choose File" button, select a standard text log file (test_log.txt), and attach it.
        await test.step('Step 15 — Attach the test log file', async () => {
          await contactPage.attachFile(attachmentPath);
          // Traceability: TC-ACG-RU-003 | RIARA-TC-03
          await expect(contactPage.getSendButtonLocator()).toBeVisible();
        });

        // Step 16 — Click the "Send" button to dispatch the support request ticket.
        await test.step('Step 16 — Send the support request ticket', async () => {
          await contactPage.clickSend();
          // STUB: PST_CONTACT_CONFIRMATION_TIMEOUT not confirmed — using environment value or 5000
          const confirmationTimeout = Number(
            process.env.PST_CONTACT_CONFIRMATION_TIMEOUT ?? '5000',
          );
          // Traceability: TC-ACG-RU-003 | RIARA-TC-03
          await expect(contactPage.getConfirmationLocator()).toBeVisible({
            timeout: confirmationTimeout,
          });
        });
      },
    );
  });

  test.describe('TC-ACG-RU-004 — Product Search, Sorting & Wishlist Functionality', () => {
    test.beforeEach(async ({ pstLoginPage }) => {
      await pstLoginPage.navigateTo('/auth/login');
      await pstLoginPage.login(pstEmail, pstPassword);
    });

    test(
      '[TC-ACG-RU-004][SCR-ACG-RU-004] Product Search, Sorting & Wishlist Functionality',
      async ({ page, homePage, productPage, wishlistPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-004
        // script_id    : SCR-ACG-RU-004
        // acg_run_id   : ACG-RUN-20261002-018
        // ─────────────────────────────────────────────────────────

        let selectedProductName = '';

        // Step 17 — Navigate to the homepage and enter "Drill" in the search box. Click the search icon.
        await test.step('Step 17 — Search for Drill from the homepage', async () => {
          await homePage.navigateTo('/');
          await homePage.searchProduct(searchTerm);
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
        });

        // Step 18 — Select the Sort By Price (Low to High) option.
        await test.step('Step 18 — Sort results by Price Low to High', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const priceAscendingValue = process.env.PST_SORT_PRICE_ASC_VALUE ?? '';
          await homePage.getSortDropdownLocator().selectOption(priceAscendingValue);
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
        });

        // Step 19 — Open the first product from the search results.
        await test.step('Step 19 — Open the first product from search results', async () => {
          selectedProductName =
            (await homePage.getSearchResultsLocator().first().textContent())?.trim() ??
            '';
          await homePage.clickFirstProduct();
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(productPage.getProductTitleLocator()).toBeVisible();
        });

        // Step 20 — Click on the "Add to Favorites" or wishlist icon.
        await test.step('Step 20 — Add the product to Favorites', async () => {
          await productPage.clickAddToFavorites();
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(productPage.getSuccessToastLocator()).toBeVisible();
        });

        // Step 21 — Navigate to the Wishlist/Favorites page from the user account menu.
        await test.step('Step 21 — Open the Wishlist/Favorites page', async () => {
          // STUB: PST_FAVORITES_PATH not confirmed — using empty path
          const favoritesPath = process.env.PST_FAVORITES_PATH ?? '';
          await page.goto(`${baseUrl}${favoritesPath}`);
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(wishlistPage.getWishlistContainerLocator()).toBeVisible();
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(wishlistPage.getProductLocator(selectedProductName)).toBeVisible();
        });

        // Step 22 — Remove the product from the wishlist.
        await test.step('Step 22 — Remove the product from the wishlist', async () => {
          await wishlistPage.removeProduct(selectedProductName);
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(wishlistPage.getProductLocator(selectedProductName)).not.toBeVisible();
          const wishlistCount = await wishlistPage.getWishlistCount();
          // Traceability: TC-ACG-RU-004 | RIARA-TC-04
          await expect(wishlistCount).toBe('');
        });
      },
    );
  });
});
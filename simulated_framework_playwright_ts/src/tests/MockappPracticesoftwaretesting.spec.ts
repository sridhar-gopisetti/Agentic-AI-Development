// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred from test case document titles/tags)
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// PST_EMAIL  → set PST_EMAIL in .env
// PST_PASSWORD  → set PST_PASSWORD in .env
// PST_HAMMER_SELECTOR  → set PST_HAMMER_SELECTOR in .env
// PST_SANDER_SELECTOR  → set PST_SANDER_SELECTOR in .env
// PST_CART_NAV_SELECTOR  → set PST_CART_NAV_SELECTOR in .env
// PST_PROFILE_PATH  → set PST_PROFILE_PATH in .env
// PST_CONTACT_NAV_SELECTOR  → set PST_CONTACT_NAV_SELECTOR in .env
// PST_CONTACT_ATTACHMENT_PATH  → set PST_CONTACT_ATTACHMENT_PATH in .env
// PST_SORT_PRICE_ASC_VALUE  → set PST_SORT_PRICE_ASC_VALUE in .env
// PST_FAVORITES_PATH  → set PST_FAVORITES_PATH in .env
// PST_CONTACT_CONFIRMATION_TIMEOUT  → set PST_CONTACT_CONFIRMATION_TIMEOUT in .env
// CheckoutPage.enterPromoCode()  → implement the approved Page Object stub
// CheckoutPage.applyPromoCode()  → implement the approved Page Object stub
// CheckoutPage.getDiscountLocator()  → implement the approved Page Object stub
// CheckoutPage.getOrderId()  → implement the approved Page Object stub
// WishlistPage.getWishlistCount()  → implement the approved Page Object stub
// ════════════════════════════════════════════════════

import { test, expect } from '../fixtures';

import type {
  BillingAddress,
  CardDetails,
} from '../pages/CheckoutPage';

import type { RegistrationData } from '../pages/RegisterPage';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

const pstEmail =
  process.env.PST_EMAIL ??
  // STUB: PST_EMAIL not confirmed — using an empty environment fallback
  '';

const pstPassword =
  process.env.PST_PASSWORD ??
  // STUB: PST_PASSWORD not confirmed — using an empty environment fallback
  '';

const billingAddress: BillingAddress = {
  street: process.env.PST_BILLING_STREET ?? '',
  city: process.env.PST_BILLING_CITY ?? '',
  state: process.env.PST_BILLING_STATE ?? '',
  country: process.env.PST_BILLING_COUNTRY ?? '',
  postcode: process.env.PST_BILLING_POSTCODE ?? '',
  houseNumber: process.env.PST_BILLING_HOUSE_NUMBER ?? '',
};

const cardDetails: CardDetails = {
  number: process.env.PST_CARD_NUMBER ?? '',
  expiry: process.env.PST_CARD_EXPIRY ?? '',
  cvv: process.env.PST_CARD_CVV ?? '',
  holder: process.env.PST_CARD_HOLDER ?? '',
};

const registrationData: RegistrationData = {
  firstName: process.env.PST_REG_FIRST_NAME ?? '',
  lastName: process.env.PST_REG_LAST_NAME ?? '',
  dob: process.env.PST_REG_DOB ?? '',
  address: process.env.PST_REG_ADDRESS ?? '',
  houseNumber: process.env.PST_REG_HOUSE_NUMBER ?? '',
  city: process.env.PST_REG_CITY ?? '',
  state: process.env.PST_REG_STATE ?? '',
  country: process.env.PST_REG_COUNTRY ?? '',
  postcode: process.env.PST_REG_POSTCODE ?? '',
  phone: process.env.PST_REG_PHONE ?? '',
  email: process.env.PST_REG_EMAIL ?? `test_user_${Date.now()}@example.com`,
  password: process.env.PST_REG_PASSWORD ?? '',
};

const contactName = process.env.PST_CONTACT_NAME ?? 'QA Tester';
const contactEmail = process.env.PST_CONTACT_EMAIL ?? '';
const contactMessage = process.env.PST_CONTACT_MESSAGE ?? '';
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
        // acg_run_id   : ACG-RUN-20261002-020
        // ─────────────────────────────────────────────────────────

        // Step 1 — Navigate to the homepage and select the "Hand Tools" category
        await test.step('Step 1 — Navigate to the homepage and select the "Hand Tools" category', async () => {
          await homePage.navigateTo('/');
          await homePage.clickCategory('Hand Tools');

          // Traceability: TC-ACG-RU-001
          await expect(homePage.getCategoryPageTitleLocator()).toBeVisible();
        });

        // Step 2 — Locate the "Hammer" product, set quantity to "2", and click "Add to cart"
        await test.step('Step 2 — Locate the "Hammer" product, set quantity to "2", and click "Add to cart"', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const hammerSelector =
            process.env.PST_HAMMER_SELECTOR ??
            // STUB: PST_HAMMER_SELECTOR not confirmed — using an empty selector
            '';

          const hammerProduct = page.locator(hammerSelector);
          await hammerProduct.waitFor({ state: 'visible' });
          await hammerProduct.click();
          await productPage.setQuantity(2);
          await productPage.clickAddToCart();

          // Traceability: TC-ACG-RU-001
          await expect(productPage.getSuccessToastLocator()).toBeVisible();
        });

        // Step 3 — Return to the homepage, select "Power Tools", open "Sander", and click "Add to cart"
        await test.step('Step 3 — Return to the homepage, select "Power Tools", open "Sander", and click "Add to cart"', async () => {
          await homePage.navigateTo('/');
          await homePage.clickCategory('Power Tools');

          // LOCATOR_UNCONFIRMED — not in AUT KB
          const sanderSelector =
            process.env.PST_SANDER_SELECTOR ??
            // STUB: PST_SANDER_SELECTOR not confirmed — using an empty selector
            '';

          const sanderProduct = page.locator(sanderSelector);
          await sanderProduct.waitFor({ state: 'visible' });
          await sanderProduct.click();
          await productPage.clickAddToCart();

          // Traceability: TC-ACG-RU-001
          await expect(productPage.getSuccessToastLocator()).toBeVisible();
        });

        // Step 4 — Click on the shopping cart icon in the top right corner to open the shopping cart overview page
        await test.step('Step 4 — Click on the shopping cart icon in the top right corner to open the shopping cart overview page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const cartSelector =
            process.env.PST_CART_NAV_SELECTOR ??
            // STUB: PST_CART_NAV_SELECTOR not confirmed — using an empty selector
            '';

          const cartNavigation = page.locator(cartSelector);
          await cartNavigation.waitFor({ state: 'visible' });
          await cartNavigation.click();

          // Traceability: TC-ACG-RU-001
          await expect(cartPage.getCartTableLocator()).toBeVisible();
          // Traceability: TC-ACG-RU-001
          await expect(cartPage.getProductRowLocator('Hammer')).toBeVisible();
          // Traceability: TC-ACG-RU-001
          await expect(cartPage.getProductRowLocator('Sander')).toBeVisible();
        });

        // Step 5 — Proceed to checkout, fill out billing information, navigate to Payment, enter promo code SPRING20, and click Apply
        await test.step('Step 5 — Proceed to checkout, fill out billing information, navigate to Payment, enter promo code SPRING20, and click Apply', async () => {
          await cartPage.clickProceedToCheckout();
          await checkoutPage.clickProceedStep2();
          await checkoutPage.fillBillingAddress(billingAddress);
          await checkoutPage.clickProceedCheckout();

          // STUB: enterPromoCode not implemented — stubbed on stub_and_continue
          await checkoutPage.enterPromoCode(promoCode);
          // STUB: applyPromoCode not implemented — stubbed on stub_and_continue
          await checkoutPage.applyPromoCode();

          // Traceability: TC-ACG-RU-001
          await expect(checkoutPage.getDiscountLocator()).toBeVisible();
        });

        // Step 6 — Select "Credit Card", enter valid mock card details, and click "Confirm"
        await test.step('Step 6 — Select "Credit Card", enter valid mock card details, and click "Confirm"', async () => {
          await checkoutPage.selectCreditCard();
          await checkoutPage.fillCardDetails(cardDetails);
          await checkoutPage.clickConfirm();

          // Traceability: TC-ACG-RU-001
          await expect(checkoutPage.getOrderSuccessLocator()).toBeVisible();

          // STUB: getOrderId not implemented — stubbed on stub_and_continue
          const orderId = await checkoutPage.getOrderId();

          // Traceability: TC-ACG-RU-001
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
        // acg_run_id   : ACG-RUN-20261002-020
        // ─────────────────────────────────────────────────────────

        // Step 7 — Navigate directly to the registration interface
        await test.step('Step 7 — Navigate directly to the registration interface', async () => {
          // Traceability: TC-ACG-RU-002
          await expect(registerPage.getRegisterButtonLocator()).toBeVisible();
        });

        // Step 8 — Enter valid data into all required fields and click "Register"
        await test.step('Step 8 — Enter valid data into all required fields and click "Register"', async () => {
          await registerPage.fillRegistrationForm(registrationData);
          await registerPage.clickRegister();

          // Traceability: TC-ACG-RU-002
          await expect(page).toHaveURL(/auth\/login/);
        });

        // Step 9 — Enter the newly created email address and password, then click "Login"
        await test.step('Step 9 — Enter the newly created email address and password, then click "Login"', async () => {
          await pstLoginPage.login(
            registrationData.email,
            registrationData.password,
          );

          // Traceability: TC-ACG-RU-002
          await expect(page).toHaveURL(/account/);
        });

        // Step 10 — Click on the "Profile" link or user icon in the main navigation header
        await test.step('Step 10 — Click on the "Profile" link or user icon in the main navigation header', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const profilePath =
            process.env.PST_PROFILE_PATH ??
            // STUB: PST_PROFILE_PATH not confirmed — using an empty path
            '';

          await page.goto(`${baseUrl}${profilePath}`);

          // Traceability: TC-ACG-RU-002
          await expect(profilePage.getPageHeaderLocator()).toBeVisible();
        });

        // Step 11 — Verify that Address, Phone, City, and Postal Code exactly match the entered strings
        await test.step('Step 11 — Verify that Address, Phone, City, and Postal Code exactly match the entered strings', async () => {
          // Traceability: TC-ACG-RU-002
          await expect(profilePage.getAddressLocator()).toHaveValue(
            registrationData.address,
          );
          // Traceability: TC-ACG-RU-002
          await expect(profilePage.getPhoneLocator()).toHaveValue(
            registrationData.phone,
          );
          // Traceability: TC-ACG-RU-002
          await expect(profilePage.getCityLocator()).toHaveValue(
            registrationData.city,
          );
          // Traceability: TC-ACG-RU-002
          await expect(profilePage.getPostcodeLocator()).toHaveValue(
            registrationData.postcode,
          );
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
        // acg_run_id   : ACG-RUN-20261002-020
        // ─────────────────────────────────────────────────────────

        // Step 12 — Click on the "Contact" option in the top navigation menu bar
        await test.step('Step 12 — Click on the "Contact" option in the top navigation menu bar', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const contactSelector =
            process.env.PST_CONTACT_NAV_SELECTOR ??
            // STUB: PST_CONTACT_NAV_SELECTOR not confirmed — using an empty selector
            '';

          const contactNavigation = page.locator(contactSelector);
          await contactNavigation.waitFor({ state: 'visible' });
          await contactNavigation.click();

          // Traceability: TC-ACG-RU-003
          await expect(contactPage.getSendButtonLocator()).toBeVisible();
        });

        // Step 13 — Select "Customer Service" from the Subject dropdown menu list
        await test.step('Step 13 — Select "Customer Service" from the Subject dropdown menu list', async () => {
          await contactPage.selectSubject('Customer Service');

          // Traceability: TC-ACG-RU-003
          await expect(contactPage.getSendButtonLocator()).toBeVisible();
        });

        // Step 14 — Populate Name with "QA Tester", enter a valid email address, and type a detailed message
        await test.step('Step 14 — Populate Name with "QA Tester", enter a valid email address, and type a detailed message', async () => {
          await contactPage.fillName(contactName);
          await contactPage.fillEmail(contactEmail);
          await contactPage.fillMessage(contactMessage);
        });

        // Step 15 — Click "Choose File", select test_log.txt, and attach it
        await test.step('Step 15 — Click "Choose File", select test_log.txt, and attach it', async () => {
          await contactPage.attachFile(attachmentPath);

          // Traceability: TC-ACG-RU-003
          await expect(contactPage.getSendButtonLocator()).toBeVisible();
        });

        // Step 16 — Click the "Send" button to dispatch the support request ticket
        await test.step('Step 16 — Click the "Send" button to dispatch the support request ticket', async () => {
          await contactPage.clickSend();

          const confirmationTimeout = Number(
            process.env.PST_CONTACT_CONFIRMATION_TIMEOUT ??
              // STUB: PST_CONTACT_CONFIRMATION_TIMEOUT not confirmed — using 5000
              '5000',
          );

          // Traceability: TC-ACG-RU-003
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
        // acg_run_id   : ACG-RUN-20261002-020
        // ─────────────────────────────────────────────────────────

        let selectedProductName = '';

        // Step 17 — Navigate to the homepage, enter "Drill" in the search box, and click the search icon
        await test.step('Step 17 — Navigate to the homepage, enter "Drill" in the search box, and click the search icon', async () => {
          await homePage.navigateTo('/');
          await homePage.searchProduct(searchTerm);

          // Traceability: TC-ACG-RU-004
          await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
        });

        // Step 18 — Select the Sort By Price (Low to High) option
        await test.step('Step 18 — Select the Sort By Price (Low to High) option', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const priceAscendingValue =
            process.env.PST_SORT_PRICE_ASC_VALUE ??
            // STUB: PST_SORT_PRICE_ASC_VALUE not confirmed — using an empty value
            '';

          await homePage
            .getSortDropdownLocator()
            .selectOption(priceAscendingValue);

          // Traceability: TC-ACG-RU-004
          await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
        });

        // Step 19 — Open the first product from the search results
        await test.step('Step 19 — Open the first product from the search results', async () => {
          selectedProductName =
            (await homePage.getSearchResultsLocator().first().textContent())?.trim() ?? '';

          await homePage.clickFirstProduct();

          // Traceability: TC-ACG-RU-004
          await expect(productPage.getProductTitleLocator()).toBeVisible();
        });

        // Step 20 — Click the "Add to Favorites" or wishlist icon
        await test.step('Step 20 — Click the "Add to Favorites" or wishlist icon', async () => {
          await productPage.clickAddToFavorites();

          // Traceability: TC-ACG-RU-004
          await expect(productPage.getSuccessToastLocator()).toBeVisible();
        });

        // Step 21 — Navigate to the Wishlist/Favorites page from the user account menu
        await test.step('Step 21 — Navigate to the Wishlist/Favorites page from the user account menu', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const favoritesPath =
            process.env.PST_FAVORITES_PATH ??
            // STUB: PST_FAVORITES_PATH not confirmed — using an empty path
            '';

          await page.goto(`${baseUrl}${favoritesPath}`);

          // Traceability: TC-ACG-RU-004
          await expect(wishlistPage.getWishlistContainerLocator()).toBeVisible();
          // Traceability: TC-ACG-RU-004
          await expect(
            wishlistPage.getProductLocator(selectedProductName),
          ).toBeVisible();
        });

        // Step 22 — Remove the product from the wishlist
        await test.step('Step 22 — Remove the product from the wishlist', async () => {
          await wishlistPage.removeProduct(selectedProductName);

          // Traceability: TC-ACG-RU-004
          await expect(
            wishlistPage.getProductLocator(selectedProductName),
          ).not.toBeVisible();

          // STUB: getWishlistCount not implemented — stubbed on stub_and_continue
          const wishlistCount = await wishlistPage.getWishlistCount();

          // Traceability: TC-ACG-RU-004
          await expect(wishlistCount).not.toBe('');
        });
      },
    );
  });
});
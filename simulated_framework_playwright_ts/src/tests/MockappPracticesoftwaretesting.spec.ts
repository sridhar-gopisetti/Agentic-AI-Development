import { test, expect } from '../../../fixtures';
import type {
  BillingAddress,
  CardDetails,
} from '../../../pages/CheckoutPage';
import type { RegistrationData } from '../../../pages/RegisterPage';
import * as path from 'path';

const pstEmail = process.env.PST_EMAIL as string;
const pstPassword = process.env.PST_PASSWORD as string;

const billingAddress: BillingAddress = {
  street: process.env.PST_BILLING_STREET as string,
  city: process.env.PST_BILLING_CITY as string,
  state: process.env.PST_BILLING_STATE as string,
  country: process.env.PST_BILLING_COUNTRY as string,
  postcode: process.env.PST_BILLING_POSTCODE as string,
  houseNumber: process.env.PST_BILLING_HOUSE_NUMBER as string,
};

const cardDetails: CardDetails = {
  number: process.env.PST_CARD_NUMBER as string,
  expiry: process.env.PST_CARD_EXPIRY as string,
  cvv: process.env.PST_CARD_CVV as string,
  holder: process.env.PST_CARD_HOLDER as string,
};

const registrationData: RegistrationData = {
  firstName: 'Test',
  lastName: 'User',
  dob: '01/01/1990',
  address: '456 QA Avenue',
  city: 'Utrecht',
  state: 'Utrecht',
  country: 'NL',
  postcode: '3500 AA',
  phone: '+31612345678',
  email: `test_user_${Date.now()}@example.com`,
  password: process.env.TEST_PASSWORD as string,
};

const contactEmail = process.env.PST_CONTACT_EMAIL as string;
const contactMessage =
  'This is a diagnostic support request with attachment for defect detection testing.';
const attachmentPath = path.resolve(process.env.PST_ATTACHMENT_PATH as string);

test.describe('PracticeSoftwareTesting.com Functional Workflows', () => {
  test.describe('TC-1: Complex Multi-Item Checkout with Promo Code Validation', () => {
    test.beforeEach(async ({ pstLoginPage }) => {
      await pstLoginPage.navigateTo('/auth/login');
      await pstLoginPage.login(pstEmail, pstPassword);
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
          path: testInfo.outputPath('screenshot-on-failure.png'),
        });
      }
    });

    test('TC-1: Complex Multi-Item Checkout with Promo Code Validation', async ({
      page,
      homePage,
      productPage,
      cartPage,
      checkoutPage,
    }) => {
      await test.step('Step 100 — Navigate to homepage and select Hand Tools category', async () => {
        // Traceability: REQ-PST-001-TC1-STEP100
        await homePage.navigateTo('/');
        await homePage.clickCategory('Hand Tools');
        // REQ-PST-001-TC1-STEP100
        await expect(homePage.getCategoryPageTitleLocator()).toBeVisible();
      });

      await test.step('Step 200 — Open Hammer, set quantity 2, and add to cart', async () => {
        // Traceability: REQ-PST-001-TC1-STEP200
        const hammerLink = page.locator('[data-test^="product-"]:has-text("Hammer")').first();
        await hammerLink.click();
        await productPage.setQuantity(2);
        await productPage.clickAddToCart();
        // REQ-PST-001-TC1-STEP200
        await expect(
          page.locator('[role="alert"]').filter({ hasText: 'Product added to shopping cart' }),
        ).toBeVisible();
      });

      await test.step('Step 300 — Return home, select Power Tools, and add Sander', async () => {
        // Traceability: REQ-PST-001-TC1-STEP300
        await homePage.navigateTo('/');
        await homePage.clickCategory('Power Tools');
        const sanderLink = page.locator('[data-test^="product-"]:has-text("Sander")').first();
        await sanderLink.click();
        await productPage.clickAddToCart();
        // REQ-PST-001-TC1-STEP300
        await expect(
          page.locator('[role="alert"]').filter({ hasText: 'Product added to shopping cart' }),
        ).toBeVisible();
      });

      await test.step('Step 400 — Open the shopping cart overview page', async () => {
        // Traceability: REQ-PST-001-TC1-STEP400
        await page.locator('[data-test="nav-cart"]').click();
        // REQ-PST-001-TC1-STEP400
        await expect(cartPage.getCartTableLocator()).toBeVisible();
        await page.locator('[data-test="product-title"]').first().waitFor({ state: 'visible' });
        // REQ-PST-001-TC1-STEP400
        await expect(cartPage.getProductRowLocator('Hammer')).toBeVisible();
        // REQ-PST-001-TC1-STEP400
        await expect(cartPage.getProductRowLocator('Sander')).toBeVisible();
      });

      await test.step('Step 500 — Proceed to checkout, fill billing, apply promo code SPRING20', async () => {
        // Traceability: REQ-PST-001-TC1-STEP500
        await cartPage.clickProceedToCheckout();
        await checkoutPage.clickProceedStep2();
        await checkoutPage.fillBillingAddress(billingAddress);
        await checkoutPage.clickProceedCheckout();
        await checkoutPage.enterPromoCode('SPRING20');
        await checkoutPage.applyPromoCode();
        // REQ-PST-001-TC1-STEP500
        await expect(checkoutPage.getDiscountMessageLocator()).toBeVisible();
      });

      await test.step('Step 600 — Select Credit Card, enter details, and confirm payment', async () => {
        // Traceability: REQ-PST-001-TC1-STEP600
        await checkoutPage.selectCreditCard();
        await checkoutPage.fillCardDetails(cardDetails);
        await checkoutPage.clickConfirm();
        // REQ-PST-001-TC1-STEP600
        await expect(checkoutPage.getOrderSuccessLocator()).toBeVisible();
      });
    });
  });

  test.describe('TC-2: User Account Registration and Profile Data Persistence', () => {
    test.beforeEach(async ({ registerPage }) => {
      await registerPage.navigateTo('/auth/register');
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
          path: testInfo.outputPath('screenshot-on-failure.png'),
        });
      }
    });

    test('TC-2: User Account Registration and Profile Data Persistence', async ({
      page,
      registerPage,
      pstLoginPage,
      profilePage,
    }) => {
      await test.step('Step 700 — Navigate directly to the registration interface', async () => {
        // Traceability: REQ-PST-002-TC2-STEP100
        await registerPage.navigateTo('/auth/register');
        // REQ-PST-002-TC2-STEP100
        await expect(registerPage.getRegisterButtonLocator()).toBeVisible();
      });

      await test.step('Step 800 — Fill required fields and click Register', async () => {
        // Traceability: REQ-PST-002-TC2-STEP200
        await registerPage.fillRegistrationForm(registrationData);
        await registerPage.clickRegister();
        // REQ-PST-002-TC2-STEP200
        await expect(page).toHaveURL(/auth\/login/);
      });

      await test.step('Step 900 — Login with the newly created credentials', async () => {
        // Traceability: REQ-PST-002-TC2-STEP300
        await pstLoginPage.login(
          registrationData.email,
          registrationData.password,
        );
        // REQ-PST-002-TC2-STEP300
        await expect(page).toHaveURL(/account/);
      });

      await test.step('Step 1000 — Navigate to the Profile page', async () => {
        // Traceability: REQ-PST-002-TC2-STEP400
        await profilePage.navigateTo('/account');
        // REQ-PST-002-TC2-STEP400
        await expect(profilePage.getPageHeaderLocator()).toBeVisible();
      });

      await test.step('Step 1100 — Verify profile fields match registration data', async () => {
        // Traceability: REQ-PST-002-TC2-STEP500
        await profilePage.assertPersistedValues(registrationData);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getAddressLocator()).toHaveValue(registrationData.address);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getCityLocator()).toHaveValue(registrationData.city);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getPhoneLocator()).toHaveValue(registrationData.phone);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getPostcodeLocator()).toHaveValue(registrationData.postcode);
      });
    });
  });

  test.describe('TC-3: Contact Form Customer Support Attachment Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.BASE_URL as string);
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
          path: testInfo.outputPath('screenshot-on-failure.png'),
        });
      }
    });

    test('TC-3: Contact Form Customer Support Attachment Flow', async ({
      page,
      contactPage,
    }) => {
      await test.step('Step 1200 — Open Contact from the top navigation', async () => {
        // Traceability: REQ-PST-003-TC3-STEP100
        await page.locator('[data-test="nav-contact"]').click();
        const loaded = await contactPage.validate();
        // REQ-PST-003-TC3-STEP100
        await expect(page).toHaveURL(/contact/);
        // REQ-PST-003-TC3-STEP100
        expect(loaded).toBe(true);
      });

      await test.step('Step 1300 — Select Customer Service from Subject', async () => {
        // Traceability: REQ-PST-003-TC3-STEP200
        await contactPage.selectSubject('Customer Service');
        // REQ-PST-003-TC3-STEP200
        await expect(contactPage.getSendButtonLocator()).toBeVisible();
      });

      await test.step('Step 1400 — Fill Name, Email, and Message', async () => {
        // Traceability: REQ-PST-003-TC3-STEP300
        await contactPage.fillName('QA Tester');
        await contactPage.fillEmail(contactEmail);
        await contactPage.fillMessage(contactMessage);
      });

      await test.step('Step 1500 — Attach test_log.txt', async () => {
        // Traceability: REQ-PST-003-TC3-STEP400
        await contactPage.attachFile(attachmentPath);
        // REQ-PST-003-TC3-STEP400
        await expect(contactPage.getSendButtonLocator()).toBeVisible();
      });

      await test.step('Step 1600 — Click Send and assert confirmation message', async () => {
        // Traceability: REQ-PST-003-TC3-STEP500
        await contactPage.clickSend();
        // REQ-PST-003-TC3-STEP500
        await expect(contactPage.getConfirmationLocator()).toBeVisible({
          timeout: 5_000,
        });
      });
    });
  });

  test.describe('TC-4: Product Search, Sorting, and Wishlist Functionality', () => {
    test.beforeEach(async ({ pstLoginPage }) => {
      await pstLoginPage.navigateTo('/auth/login');
      await pstLoginPage.login(pstEmail, pstPassword);
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
          path: testInfo.outputPath('screenshot-on-failure.png'),
        });
      }
    });

    test('TC-4: Product Search, Sorting, and Wishlist Functionality', async ({
      page,
      homePage,
      productPage,
      wishlistPage,
    }) => {
      let addedProductName = '';

      await test.step('Step 1700 — Search for Drill from the homepage', async () => {
        // Traceability: REQ-PST-004-TC4-STEP100
        await homePage.navigateTo('/');
        await homePage.searchProduct('Drill');
        // REQ-PST-004-TC4-STEP100
        await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
      });

      await test.step('Step 1800 — Sort results by Price Low to High', async () => {
        // Traceability: REQ-PST-004-TC4-STEP200
        await homePage.getSortDropdownLocator().selectOption('price,asc');
        await homePage.assertAscendingPrices();
        // REQ-PST-004-TC4-STEP200
        await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
      });

      await test.step('Step 1900 — Open the first search result', async () => {
        // Traceability: REQ-PST-004-TC4-STEP300
        const firstProductName = await homePage.getSearchResultsLocator().first().textContent();
        addedProductName = firstProductName?.trim() ?? 'Drill';
        await homePage.clickFirstProduct();
        // REQ-PST-004-TC4-STEP300
        await expect(productPage.getProductTitleLocator()).toBeVisible();
      });

      await test.step('Step 2000 — Add the product to Favorites or Wishlist', async () => {
        // Traceability: REQ-PST-004-TC4-STEP400
        await productPage.clickAddToFavorites();
        // REQ-PST-004-TC4-STEP400
        await expect(productPage.getSuccessToastLocator()).toBeVisible();
      });

      await test.step('Step 2100 — Navigate to Wishlist and verify the product', async () => {
        // Traceability: REQ-PST-004-TC4-STEP500
        await wishlistPage.navigateTo('/account/favorites');
        // REQ-PST-004-TC4-STEP500
        await expect(wishlistPage.getWishlistContainerLocator()).toBeVisible();
        // REQ-PST-004-TC4-STEP500
        await expect(wishlistPage.getProductLocator(addedProductName)).toBeVisible();
      });

      await test.step('Step 2200 — Remove the product from the wishlist', async () => {
        // Traceability: REQ-PST-004-TC4-STEP600
        await wishlistPage.removeProduct(addedProductName);
        // REQ-PST-004-TC4-STEP600
        await expect(wishlistPage.getProductLocator(addedProductName)).not.toBeVisible();
        // REQ-PST-004-TC4-STEP600
        await expect(wishlistPage.getWishlistCountLocator()).toHaveText('0');
      });
    });
  });
});
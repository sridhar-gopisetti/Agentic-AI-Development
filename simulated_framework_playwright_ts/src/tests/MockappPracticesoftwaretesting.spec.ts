import { test, expect } from '../../../fixtures';
import type {
  BillingAddress,
  CardDetails,
} from '../../../pages/CheckoutPage';
import type { RegistrationData } from '../../../pages/RegisterPage';
import * as path from 'path';

const baseUrl = process.env.BASE_URL as string;
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
  firstName: process.env.PST_REG_FIRST_NAME as string,
  lastName: process.env.PST_REG_LAST_NAME as string,
  dob: process.env.PST_REG_DOB as string,
  address: process.env.PST_REG_ADDRESS as string,
  city: process.env.PST_REG_CITY as string,
  state: process.env.PST_REG_STATE as string,
  country: process.env.PST_REG_COUNTRY as string,
  postcode: process.env.PST_REG_POSTCODE as string,
  phone: process.env.PST_REG_PHONE as string,
  email: `pst_${Date.now()}@${process.env.PST_EMAIL_DOMAIN as string}`,
  password: process.env.TEST_PASSWORD as string,
};

const contactEmail = process.env.PST_CONTACT_EMAIL as string;
const contactMessage = process.env.PST_CONTACT_MESSAGE as string;
const attachmentPath = path.resolve(process.env.PST_ATTACHMENT_PATH as string);

test.describe('PracticeSoftwareTesting.com Functional Workflows', () => {
  test.afterEach(async ({ page }, testInfo) => {
    // TEARDOWN
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: testInfo.outputPath('screenshot-on-failure.png'),
      });
    }
  });

  test.describe('TC-1: Complex Multi-Item Checkout with Promo Code Validation', () => {
    test.beforeEach(async ({ page, pstLoginPage }) => {
      await page.goto(`${baseUrl}/auth/login`);
      await pstLoginPage.login(pstEmail, pstPassword);
    });

    test('TC-1: Complex Multi-Item Checkout with Promo Code Validation', async ({
      page,
      homePage,
      productPage,
      cartPage,
      checkoutPage,
    }) => {
      await test.step('Step 1 — Navigate to homepage and select Hand Tools category', async () => {
        // Step 1
        await page.goto(baseUrl);
        await homePage.clickCategory('Hand Tools');
        // REQ-PST-001-TC1-STEP100
        await expect(homePage.getCategoryPageTitleLocator()).toBeVisible();
      });

      await test.step('Step 2 — Open Hammer, set quantity to 2, and add to cart', async () => {
        // Step 2
        const hammerLink = page.locator('[data-test^="product-"]:has-text("Hammer")').first();
        await hammerLink.click();
        await productPage.setQuantity(2);
        await productPage.clickAddToCart();
        // REQ-PST-001-TC1-STEP200
        await expect(page.locator('[role="alert"]').filter({ hasText: 'Product added to shopping cart' })).toBeVisible();
      });

      await test.step('Step 3 — Return home, select Power Tools, and add Sander', async () => {
        // Step 3
        await page.goto(baseUrl);
        await homePage.clickCategory('Power Tools');
        const sanderLink = page.locator('[data-test^="product-"]:has-text("Sander")').first();
        await sanderLink.click();
        await productPage.clickAddToCart();
        // REQ-PST-001-TC1-STEP300
        await expect(page.locator('[role="alert"]').filter({ hasText: 'Product added to shopping cart' })).toBeVisible();
      });

      await test.step('Step 4 — Open the shopping cart overview page', async () => {
        // Step 4
        await page.locator('[data-test="nav-cart"]').click();
        // REQ-PST-001-TC1-STEP400
        await expect(cartPage.getCartTableLocator()).toBeVisible();
        // REQ-PST-001-TC1-STEP400
        await expect(cartPage.getProductRowLocator('Hammer')).toBeVisible();
        // REQ-PST-001-TC1-STEP400
        await expect(cartPage.getProductRowLocator('Sander')).toBeVisible();
      });

      await test.step('Step 5 — Proceed to checkout, fill billing, and apply SPRING20', async () => {
        // Step 5
        await cartPage.clickProceedToCheckout();
        await checkoutPage.clickProceedStep2();
        await checkoutPage.fillBillingAddress(billingAddress);
        await checkoutPage.clickProceedCheckout();
        await checkoutPage.enterPromoCode('SPRING20');
        await checkoutPage.applyPromoCode();
        // REQ-PST-001-TC1-STEP500
        await expect(checkoutPage.getDiscountMessageLocator()).toBeVisible();
      });

      await test.step('Step 6 — Select Credit Card, enter details, and confirm payment', async () => {
        // Step 6
        await checkoutPage.selectCreditCard();
        await checkoutPage.fillCardDetails(cardDetails);
        await checkoutPage.clickConfirm();
        // REQ-PST-001-TC1-STEP600
        await expect(checkoutPage.getOrderSuccessLocator()).toBeVisible();
      });
    });
  });

  test.describe('TC-2: User Account Registration & Profile Data Persistence', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${baseUrl}/auth/register`);
    });

    test('TC-2: User Account Registration & Profile Data Persistence', async ({
      page,
      registerPage,
      pstLoginPage,
      profilePage,
    }) => {
      await test.step('Step 7 — Navigate directly to the registration interface', async () => {
        // Step 7
        await page.goto(`${baseUrl}/auth/register`);
        // REQ-PST-002-TC2-STEP100
        await expect(registerPage.getRegisterButtonLocator()).toBeVisible();
      });

      await test.step('Step 8 — Fill all required fields and click Register', async () => {
        // Step 8
        await registerPage.fillRegistrationForm(registrationData);
        await registerPage.clickRegister();
        // REQ-PST-002-TC2-STEP200
        await expect(page).toHaveURL(/auth\/login/);
      });

      await test.step('Step 9 — Login with the newly created credentials', async () => {
        // Step 9
        await pstLoginPage.login(registrationData.email, registrationData.password);
        // REQ-PST-002-TC2-STEP300
        await expect(page).toHaveURL(/account/);
      });

      await test.step('Step 10 — Open the Profile page from the account area', async () => {
        // Step 10
        await page.goto(`${baseUrl}/account`);
        // REQ-PST-002-TC2-STEP400
        await expect(profilePage.getPageHeaderLocator()).toBeVisible();
      });

      await test.step('Step 11 — Verify profile fields match the submitted registration data', async () => {
        // Step 11
        await profilePage.assertPersistedValues(registrationData);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getAddressLocator()).toHaveValue(registrationData.address);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getPhoneLocator()).toHaveValue(registrationData.phone);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getCityLocator()).toHaveValue(registrationData.city);
        // REQ-PST-002-TC2-STEP500
        await expect(profilePage.getPostcodeLocator()).toHaveValue(registrationData.postcode);
      });
    });
  });

  test.describe('TC-3: Contact Form Customer Support Attachment Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(baseUrl);
    });

    test('TC-3: Contact Form Customer Support Attachment Flow', async ({
      page,
      contactPage,
    }) => {
      await test.step('Step 12 — Open Contact from the top navigation', async () => {
        // Step 12
        await page.locator('[data-test="nav-contact"]').click();
        const loaded = await contactPage.validate();
        // REQ-PST-003-TC3-STEP100
        await expect(page).toHaveURL(/contact/);
        // REQ-PST-003-TC3-STEP100
        await expect(contactPage.getSendButtonLocator()).toBeVisible();
        // REQ-PST-003-TC3-STEP100
        await expect.poll(async () => loaded).toBe(true);
      });

      await test.step('Step 13 — Select Customer Service from the Subject dropdown', async () => {
        // Step 13
        await contactPage.selectSubject('Customer Service');
        // REQ-PST-003-TC3-STEP200
        await expect(contactPage.getSendButtonLocator()).toBeVisible();
      });

      await test.step('Step 14 — Fill Name, Email, and Message fields', async () => {
        // Step 14
        await contactPage.fillName('QA Tester');
        await contactPage.fillEmail(contactEmail);
        await contactPage.fillMessage(contactMessage);
      });

      await test.step('Step 15 — Attach test_log.txt to the support request', async () => {
        // Step 15
        await contactPage.attachFile(attachmentPath);
        // REQ-PST-003-TC3-STEP400
        await expect(contactPage.getSendButtonLocator()).toBeVisible();
      });

      await test.step('Step 16 — Click Send and verify the confirmation response', async () => {
        // Step 16
        await contactPage.clickSend();
        // REQ-PST-003-TC3-STEP500
        await expect(contactPage.getConfirmationLocator()).toBeVisible({ timeout: 5_000 });
      });
    });
  });

  test.describe('TC-4: Product Search, Sorting & Wishlist Functionality', () => {
    test.beforeEach(async ({ page, pstLoginPage }) => {
      await page.goto(`${baseUrl}/auth/login`);
      await pstLoginPage.login(pstEmail, pstPassword);
    });

    test('TC-4: Product Search, Sorting & Wishlist Functionality', async ({
      page,
      homePage,
      productPage,
      wishlistPage,
    }) => {
      let addedProductName = '';

      await test.step('Step 17 — Search for Drill from the homepage', async () => {
        // Step 17
        await page.goto(baseUrl);
        await homePage.searchProduct('Drill');
        // REQ-PST-004-TC4-STEP100
        await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
      });

      await test.step('Step 18 — Sort results by Price Low to High', async () => {
        // Step 18
        await homePage.getSortDropdownLocator().selectOption('price,asc');
        await homePage.assertAscendingPrices();
        // REQ-PST-004-TC4-STEP200
        await expect(homePage.getSortDropdownLocator()).toBeVisible();
      });

      await test.step('Step 19 — Open the first product from the search results', async () => {
        // Step 19
        const firstProductName = await homePage.getSearchResultsLocator().first().textContent();
        addedProductName = firstProductName?.trim() ?? 'Drill';
        await homePage.clickFirstProduct();
        // REQ-PST-004-TC4-STEP300
        await expect(productPage.getProductTitleLocator()).toBeVisible();
      });

      await test.step('Step 20 — Add the product to Favorites or Wishlist', async () => {
        // Step 20
        await productPage.clickAddToFavorites();
        // REQ-PST-004-TC4-STEP400
        await expect(productPage.getSuccessToastLocator()).toBeVisible();
      });

      await test.step('Step 21 — Open the Wishlist/Favorites page', async () => {
        // Step 21
        await page.goto(`${baseUrl}/account/favorites`);
        // REQ-PST-004-TC4-STEP500
        await expect(wishlistPage.getWishlistContainerLocator()).toBeVisible();
        // REQ-PST-004-TC4-STEP500
        await expect(wishlistPage.getProductLocator(addedProductName)).toBeVisible();
      });

      await test.step('Step 22 — Remove the product from the wishlist', async () => {
        // Step 22
        await wishlistPage.removeProduct(addedProductName);
        // REQ-PST-004-TC4-STEP600
        await expect(wishlistPage.getProductLocator(addedProductName)).not.toBeVisible();
        // REQ-PST-004-TC4-STEP600
        await expect(wishlistPage.getWishlistCountLocator()).toHaveText('0');
      });
    });
  });
});
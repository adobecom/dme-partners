import { test, expect } from '@playwright/test';
import smokeSpec from './smoke.spec.js';
import SmokeTest from './smoke.page.js';
import SignInPage from '../signin/signin.page.js';
import ProfileDropdownPage from '../profile-dropdown/profile-dropdown.page.js';

let smokeTest;
let signInSmokeTest;
let profileDropdownPage;

const { features } = smokeSpec;

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    smokeTest = new SmokeTest(page);
    signInSmokeTest = new SignInPage(page);
    profileDropdownPage = new ProfileDropdownPage(page);

    const { path } = features[0];
    await test.step('Go to Landing page', async () => {
      await page.goto(new URL(path, baseURL).href);
    });
  });
  // @lending-page-validation-smoke-test
  test(`${features[0].name}, ${features[0].tags}`, async () => {
    await test.step('Validate Join Now and Sign In Buttons', async () => {
      // checking if there are buttons on the page
      await smokeTest.verifyButtonExist();
    });
  });
  // @home-page-validation-smoke-test
  test(`${features[1].name}, ${features[1].tags}`, async ({ page, baseURL }) => {
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[1].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In, enter user email and password', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[1].data.partnerLevel}`);
    });
    await test.step('Verify protected Gnav exists', async () => {
      await smokeTest.verifyProtectedGnav();
    });
    await test.step('Verify Profile Icon exists', async () => {
      await smokeTest.verifyProfileIcon();
    });
  });
  // @price-list-validation-smoke-test
  test(`${features[2].name}, ${features[2].tags}`, async ({ page, baseURL }) => {
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[2].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In, enter user email and password', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[2].data.partnerLevel}`);
    });
    await test.step('Go to Price List from GNav and verify redirection', async () => {
      // cliking on price list from gnav
      await smokeTest.priceList.click();
      await page.waitForTimeout(3000);
      // checking url
      const currentURL = await page.evaluate(() => window.location.href);
      await expect(currentURL).toContain(
        features[2].data.expectedPublicPageURL,
      );
    });
    await test.step('Find a row in price list and click on download', async () => {
      await smokeTest.clickDownloadButtonInFirstRow();
    });
  });
  // @search-page-validation-smoke-test
  test(`${features[3].name}, ${features[3].tags}`, async ({ page, baseURL }) => {
    const { data } = features[3];
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[3].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In, enter user email and password', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[2].data.partnerLevel}`);
    });
    await test.step('Click rearch from GNav', async () => {
      // cliking on search from gnav
      await smokeTest.searchGnav.click();
    });
    // search pdf and click enter
    await test.step('Verify a search field and type text', async () => {
      //   await smokeTest.search();
      await smokeTest.searchGnavField.fill(data.searchText);
      await smokeTest.searchGnavField.press('Enter');
    });

    await test.step('Verify search page conntent', async () => {
      const searchFieldValue = await smokeTest.searchFieldPage.getAttribute(
        'value',
      );
      expect(searchFieldValue).toContain(data.searchText);
    });

    await test.step('Find a row in assets list and click on download', async () => {
      await smokeTest.searchPageDownloadButton();
    });
  });

  // @user-redirection-apac-smoke-test
  test(`${features[4].name}, ${features[4].tags}`, async ({ page, baseURL }) => {
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[4].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In, verify user redirection', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[4].data.partnerLevel}`);
      await page.waitForLoadState('networkidle');

      const currentURL = await page.evaluate(() => window.location.href);
      await expect(currentURL).toContain(
        features[4].data.expectedPublicPageURL,
      );
    });
  });
  // @user-redirection-emea-smoke-test
  test(`${features[5].name}, ${features[5].tags}`, async ({ page, baseURL }) => {
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[5].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In, verify user redirection', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[5].data.partnerLevel}`);
      await page.waitForLoadState('networkidle');

      const currentURL = await page.evaluate(() => window.location.href);
      await expect(currentURL).toContain(
        features[5].data.expectedPublicPageURL,
      );
    });
  });
  // @user-redirection-jp-smoke-test
  test(`${features[6].name}, ${features[6].tags}`, async ({ page, baseURL }) => {
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[6].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In, verify user redirection', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[6].data.partnerLevel}`);
      await page.waitForLoadState('networkidle');
      const currentURL = await page.evaluate(() => window.location.href);
      await expect(currentURL).toContain(
        features[6].data.expectedPublicPageURL,
      );
    });
  });
  // @search-page-validation-smoke-test
  test(`${features[7].name}, ${features[7].tags}`, async ({ page, baseURL }) => {
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[7].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In, verify user redirection', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[7].data.partnerLevel}`);
      await page.waitForLoadState('networkidle');
      const currentURL = await page.evaluate(() => window.location.href);
      await expect(currentURL).toContain(
        features[7].data.expectedPublicPageURL,
      );
    });
  });
  // @announcement-page-validation-smoke-test
  test(`${features[8].name}, ${features[8].tags}`, async ({ page, baseURL }) => {
    await test.step('Click Sign In button', async () => {
      // finding sign in button
      const signInButtonInt = await signInSmokeTest.getSignInButton(
        `${features[7].data.signInButtonInternationalText}`,
      );
      // click on sign in button
      await signInButtonInt.click();
    });
    await test.step('Sing In', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[8].data.partnerLevel}`);

      await test.step('Click on Announcments from GNav and verify one Announcment card is displayed and page is loaded correctly', async () => {
        await smokeTest.announcemnts.click();
        await smokeTest.announcmentCardVerification({ expect });
      });
    });
  });

  // @search-page-query-param-validation-smoke-test
  test(`${features[9].name}, ${features[9].tags}`, async ({ page, baseURL }) => {
    const { data } = features[9];

    await test.step('Go to prefiltered Search page', async () => {
      await page.goto(`${baseURL}${features[9].path}`);
    });

    await test.step('Sing In, enter user email and password', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${data.partnerLevel}`);
    });

    /**
     * Verify is search field and URL do not contain partnerLogin=true as query parameter
     * Verify if search field and URL contain term=Logo as query parameter
    */ 
    await test.step('Verify if search field contains term query parameter', async () => {
      const searchFieldValue = await smokeTest.searchFieldPage.getAttribute(
        'value',
      );
      expect(searchFieldValue).toContain(data.searchText);
      expect(page.url()).toContain(data.searchText);

      expect(searchFieldValue).not.toContain('partnerLogin');
      expect(page.url()).not.toContain('partnerLogin');
    });

    await test.step('Verify if the URL search query parameter does not exist after the logout', async () => {
      page.locator('.feds-profile-button').click();
      await profileDropdownPage.logoutButton.click();
      expect(page.url()).toContain(data.searchText);
    });
  });
});

import { test, expect } from '@playwright/test';
import smokeSpec from './smoke.spec.js';
import SmokeTest from './smoke.page.js';
import SignInPage from '../signin/signin.page.js';

let smokeTest;
let signInSmokeTest;

const { features } = smokeSpec;

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    smokeTest = new SmokeTest(page);
    signInSmokeTest = new SignInPage(page);

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

      await test.step('Click on Announcments from GNav and verify one Announcment card is displayed', async () => {
        await smokeTest.announcemnts.click();
        await smokeTest.announcmentCardVerification();
      });
    });
  });
  // @retail-program-validation-smoke-test
  test(`${features[9].name}, ${features[9].tags}`, async ({ page }) => {
    await test.step('Veryfy the Select you region is visible', async () => {
      // select you region visible on public page
      const selectYourRegionPublicSection = page.locator('#select-your-region');
      await selectYourRegionPublicSection.isVisible();
    });

    await test.step('Open North America public page and verify select you region does not exist', async () => {
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        // clicking on nort america program from public page
        page.locator('//a[contains(@href, "na/channelpartners/")]').click(),
      ]);
      await newPage.waitForLoadState();
      // check if section select you region is not vsible on na public page
      await expect(newPage.locator('#select-your-region')).not.toBeVisible();
    });
    await test.step('Verify NA Partnership Opportunities is visible', async () => {
      await smokeTest.verifyNorthAmericaPublicPage();
    });
    await test.step('Verify Partnership Opportunities on APAC Page', async () => {
      // opening the APAC public page and checking partnership opportunities
      await smokeTest.verifyApacPage();
    });
  });
  // @apac-specialization-validation-smoke-test
  test(`${features[10].name}, ${features[10].tags}`, async ({ page, baseURL }) => {
    const signInButtonInt = await signInSmokeTest.getSignInButton(
      `${features[10].data.signInButtonInternationalText}`,
    );
    // click on sign in button
    await signInButtonInt.click();

    await test.step('Sing In, enter user email and password', async () => {
    // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[10].data.partnerLevel}`);
    });

    await test.step('Verify VIP Marketplace specialization', async () => {
      await smokeTest.apacSpecializationVerify();
    });
  });
  // @latam-specialization-validation-smoke-test
  test(`${features[11].name}, ${features[11].tags}`, async ({ page, baseURL }) => {
    const signInButtonInt = await signInSmokeTest.getSignInButton(
      `${features[11].data.signInButtonInternationalText}`,
    );
    // click on sign in button
    await signInButtonInt.click();

    await test.step('Sing In, enter user email and password', async () => {
      // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[11].data.partnerLevel}`);
    });

    await test.step('Verify VIP Marketplace specialization', async () => {
      await smokeTest.latamSpecializationVerify();
    });
  });
  // @emea-specialization-validation-smoke-test
  test(`${features[12].name}, ${features[12].tags}`, async ({ page, baseURL }) => {
    const signInButtonInt = await signInSmokeTest.getSignInButton(
      `${features[12].data.signInButtonInternationalText}`,
    );
    // click on sign in button
    await signInButtonInt.click();

    await test.step('Sing In, enter user email and password', async () => {
    // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[12].data.partnerLevel}`);
    });

    await test.step('Verify VIP Marketplace specialization', async () => {
      await smokeTest.emeaSpecializationVerify();
    });
  });
  // @korea-specialization-validation-smoke-test
  test(`${features[13].name}, ${features[13].tags}`, async ({ page, baseURL }) => {
    const signInButtonInt = await signInSmokeTest.getSignInButton(
      `${features[13].data.signInButtonInternationalText}`,
    );
    // click on sign in button
    await signInButtonInt.click();

    await test.step('Sing In, enter user email and password', async () => {
    // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[13].data.partnerLevel}`);
    });

    await test.step('Verify VIP Marketplace specialization', async () => {
      await smokeTest.krSpecializationVerify();
    });
  });
  // @uplevel-info-validation-smoke-test
  test(`${features[14].name}, ${features[14].tags}`, async ({ page, baseURL }) => {
    const signInButtonInt = await signInSmokeTest.getSignInButton(
      `${features[14].data.signInButtonInternationalText}`,
    );
    // click on sign in button
    await signInButtonInt.click();

    await test.step('Sing In, enter user email and password', async () => {
    // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[14].data.partnerLevel}`);
    });

    await test.step('Reseller program uplevel verification', async () => {
      await smokeTest.checkUplevelProgram();

      const resellerProgramLink = page.locator('p.body-m a[href*="/p/Reseller_Program_Guide_EMEA.pdf"]').nth(0);
      await resellerProgramLink.isVisible();
      const resellerProgramhref = await resellerProgramLink.getAttribute('href');
      expect(resellerProgramhref).toContain(
        features[14].data.expectedResellerProgramURL,
      );
    });

    await test.step('Retail program uplevel verification', async () => {
      const retailProgramLink = page.locator('p.body-m a[href*="/p/EMEA_Retail_Program_Guide.pdf"]').nth(0);
      await retailProgramLink.isVisible();
      const retailProgramhHref = await retailProgramLink.getAttribute('href');
      expect(retailProgramhHref).toContain(
        features[14].data.expectedRetailProgramURL,
      );
    });

    await test.step('Membership page info verification', async () => {
      await smokeTest.membershipPageInfoVerification();
    });
  });
  // @cal-links-apac-validation-smoke-test
  test(`${features[15].name}, ${features[15].tags}`, async ({ page, baseURL }) => {
    const signInButtonInt = await signInSmokeTest.getSignInButton(
      `${features[15].data.signInButtonInternationalText}`,
    );
    // click on sign in button
    await signInButtonInt.click();

    await test.step('Sing In, enter user email and password', async () => {
    // entering user email and password
      await smokeTest.smokeSignIn(page, baseURL, `${features[15].data.partnerLevel}`);
    });
    await test.step('Cal page verification', async () => {
      // verify APC program guids
      await smokeTest.apcProgramGuidsVerify();
      // open cal from gnav
      await smokeTest.requestCalverify();
      // verify request and submit for INDIA cal
      await smokeTest.indidaCalVerify();
      // verify request and submit for SEA/BD cal
      await smokeTest.seabdCalVerify();
      // verify request and submit for HKT cal
      await smokeTest.hktCalVerify();
      // verify request and submit for China cal
      await smokeTest.chinaCalVerify();
      // verify request and submit for ANZ cal
      await smokeTest.anzCalVerify();
      // verify request and submit for Kora cal
      await smokeTest.koreaCalVerify();

      await test.step('Submit email verification', async () => {
        await smokeTest.submitEmailVerify();
      });

      await test.step('Mebership page verififcation', async () => {
        await smokeTest.apacMembershipVerify();

        const distributorGuid = page.locator('p.body-m.action-area a[href*="/p/Adobe_Partner_Connection_Distributor_Program_Guide_FY25_Asia_Pacific_v9.pdf"]');
        const distributorGuidlink = await distributorGuid.getAttribute('href');
        expect(distributorGuidlink).toContain(features[15].data.expectedDistributorGuidLink);
      });
    });
  });
});

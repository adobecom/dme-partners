import { test, expect } from '@playwright/test';
import SignInPage from '../signin/signin.page.js';
import SearchSpec from './search.spec.js';
import SearchPage from './search.page.js';

let searchTest;
let sginInSearchTest;

const { features } = SearchSpec;

test.describe('Search Page validation', () => {
  test.beforeEach(async ({ page, browserName, baseURL, context }) => {
    searchTest = new SearchPage(page);
    sginInSearchTest = new SignInPage(page);

    if (!baseURL.includes('partners.stage.adobe.com')) {
      await context.setExtraHTTPHeaders({ authorization: `token ${process.env.MILO_AEM_API_KEY}` });
    }
    if (browserName === 'chromium' && !baseURL.includes('partners.stage.adobe.com')) {
      await page.route('https://www.adobe.com/chimera-api/**', async (route, request) => {
        const newUrl = request.url().replace(
          'https://www.adobe.com/chimera-api',
          'https://14257-chimera.adobeioruntime.net/api/v1/web/chimera-0.0.1',
        );
        route.continue({ url: newUrl });
      });
    }
  });
  // @na-validate-assets-present-for-user
  test(`${features[0].name}, ${features[0].tags}`, async ({ page }) => {
    const { data } = features[0];

    await test.step('Sign In with user', async () => {
      await page.goto(`${features[0].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[0].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
    });

    await test.step('Check MAPC public stage asset', async () => {
      // check asset title
      await searchTest.checkCardTitle(`${data.asset1}`);
      // check pdf icon is displayed
      await searchTest.checkFileIcon(`${data.iconPdf}`);
      // check the present tags
      await searchTest.hasCardTag(data.asset1, data.asset1Tag1);
      await searchTest.hasCardTag(data.asset1, data.asset1Tag2);
      await searchTest.hasCardTag(data.asset1, data.asset1Tag3);
      await searchTest.hasCardTag(data.asset1, data.asset1Tag4);
    });

    await test.step('Check MAPC stage education', async () => {
      await searchTest.checkCardDescription(data.asset2, data.descriptionText);
      await searchTest.checkFileIcon(`${data.iconXLS}`);
    });

    await test.step('Check MAPC stage worldwide', async () => {
      await searchTest.checkFileIcon(data.iconDef);
    });

    await test.step('Check MAPC stage combined', async () => {
      await searchTest.checkFileIcon(data.iconDoc);
    });

    await test.step('Check if new tab is opened for preview', async () => {
      const [newTab] = await Promise.all([
        page.waitForEvent('popup'),
        searchTest.openPreview.click(),
      ]);

      const pages = page.context().pages();
      expect(pages.length).toBe(2);
      await newTab.close();
    });

    const promise = new Promise((resolve) => {
      page.on('response', (response) => {
        if (response.url().includes(`${data.assetURL}`) && response.status() === data.httpStatusCode) {
          resolve(true);
        }
      });
    });

    await test.step('Open pdf preview', async () => {
      const hrefLink = await searchTest.openPreview.getAttribute('href');

      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, hrefLink);
      await page.waitForLoadState('load');
    });
    const resourceSuccessfullyLoaded = await promise;

    expect(resourceSuccessfullyLoaded).toBe(true);
  });
  // @na-validate-search-page-filters-part-one
  test(`${features[1].name}, ${features[1].tags}`, async ({ page }) => {
    const { data } = features[1];

    await test.step('Sign In with user', async () => {
      await page.goto(`${features[1].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[1].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
    });

    await test.step('Filter Assets by Type filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterType, searchTest.checkBoxLicensing);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.clearAllFilters.click();
    });

    await test.step('Filter Assets by Language filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterLanguage, searchTest.checkBoxArabic);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
    });

    await test.step('Filter Assets by Product filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterProduct, searchTest.checkBoxAdobeSign);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
    });

    await test.step('Filter Assets by Topic filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterTopic, searchTest.checkBoxDealRegistration);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.clearAll();
    });

    await test.step('Search Page pagination test', async () => {
      await searchTest.clearAll();
      await page.waitForLoadState('domcontentloaded');
      const number = await searchTest.checkNumberOfAssets();
      expect(number).toBeGreaterThan(4);

      await searchTest.nextPageCLick();
      await searchTest.checkCardTitle(data.nextPageAsset);
      await searchTest.prevPageClick();
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.page3Click();
      await searchTest.checkCardTitle(data.page3Asset);
    });
  });
  // @na-validate-search-page-filters-part-two
  test(`${features[2].name}, ${features[2].tags}`, async ({ page }) => {
    const { data } = features[2];

    await test.step('Sign In with user', async () => {
      await page.goto(`${features[2].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[2].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
    });

    await test.step('Filter Assets by Language filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterLanguage, searchTest.checkBoxSpanish);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.filterSearchAssets(searchTest.filterLanguage, searchTest.checkBoxArabic);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset4);
    });

    await test.step('Filter Assets by Product filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterProduct, searchTest.checkBoxAdobeDreamweaver);
      await searchTest.checkCardTitle(data.asset1);
    });

    await test.step('Filter Assets by Topic filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterTopic, searchTest.checkBoxProgramGuid);
      await searchTest.checkCardTitle(data.asset1);
    });

    await test.step('Filter Assets Uncheck Language filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterLanguage, searchTest.checkBoxSpanish);
      await searchTest.filterSearchAssets(searchTest.filterLanguage, searchTest.checkBoxArabic);
      await searchTest.checkCardTitle(data.asset1);
    });

    await test.step('Filter Assets Uncheck Topic and Product filter', async () => {
      await searchTest.filterSearchAssets(searchTest.filterTopic, searchTest.checkBoxProgramGuid);
      await searchTest.filterSearchAssets(searchTest.filterProduct, searchTest.checkBoxAdobeDreamweaver);
      await searchTest.checkCardTitle(data.asset3);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset4);
    });

    await test.step('Crlear seach keyword test', async () => {
      await searchTest.clearAll();
      await page.waitForLoadState('domcontentloaded');
      await page.locator('.search-card:visible').first().waitFor({ state: 'visible' });
      const number = await searchTest.checkNumberOfAssets();
      expect(number).toBeGreaterThan(4);
    });
  });
  // @apac-asset-validation-search-page
  test(`${features[3].name}, ${features[3].tags}`, async ({ page }) => {
    const { data } = features[3];

    await test.step('Sign In with user', async () => {
      await page.goto(`${features[3].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[3].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
    });
  });
  // @china-asset-validation-search-page
  test(`${features[4].name}, ${features[4].tags}`, async ({ page }) => {
    const { data } = features[4];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[4].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[4].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
    });
  });
  // @west-europe-asset-validation-search-pag
  test(`${features[5].name}, ${features[5].tags}`, async ({ page }) => {
    const { data } = features[5];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[5].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[5].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
    });
  });
  // @japan-europe-asset-validation-search-page
  test(`${features[6].name}, ${features[6].tags}`, async ({ page }) => {
    const { data } = features[6];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[6].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[6].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
      await searchTest.checkCardTitle(data.asset5);
    });
  });
  // @latin-america-asset-validation-search-page
  test(`${features[7].name}, ${features[7].tags}`, async ({ page }) => {
    const { data } = features[7];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[7].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[7].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
      await searchTest.checkCardTitle(data.asset5);
    });
  });
  // @latin-america-na-asset-validation-search-page
  test(`${features[8].name}, ${features[8].tags}`, async ({ page }) => {
    const { data } = features[8];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[8].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[8].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
      await searchTest.checkCardTitle(data.asset5);
    });
  });
  // @pacific-user-asset-validation-search-page
  test(`${features[9].name}, ${features[9].tags}`, async ({ page }) => {
    const { data } = features[9];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[9].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[9].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
    });
  });
  // @uk-user-asset-validation-search-page
  test(`${features[10].name}, ${features[10].tags}`, async ({ page }) => {
    const { data } = features[10];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[10].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[10].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
      await searchTest.checkCardTitle(data.asset5);
      await searchTest.checkCardTitle(data.asset6);
    });
  });
  // @korea-user-asset-validation-search-pag
  test(`${features[11].name}, ${features[11].tags}`, async ({ page }) => {
    const { data } = features[11];

    await test.step('Sign In with China user', async () => {
      await page.goto(`${features[11].path}`);
      await page.waitForLoadState('domcontentloaded');

      await sginInSearchTest.signIn(page, `${features[11].data.partnerLevel}`);
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset1);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset2);
      await searchTest.checkCardTitle(data.asset3);
    });
  });

  test(`${features[12].name}, ${features[12].tags}`, async ({ page }) => {
    const { data } = features[12];

    await test.step('Sign In with  user', async () => {
      await page.goto(`${features[12].path}`);
      await page.waitForLoadState('domcontentloaded');

      const signInButtonInt = await sginInSearchTest.getSignInButton(
        `${features[12].data.signInButtonInternationalText}`,
      );

      await signInButtonInt.click();

      await sginInSearchTest.signIn(page, `${features[12].data.partnerLevel}`);
      await sginInSearchTest.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
    });

    await test.step('Search for assets ', async () => {
      await searchTest.searchForAsset(data.searchText);
      await page.waitForLoadState('networkidle');
      await searchTest.checkNumberOfAssets();
      const numberOfAssets = await searchTest.checkNumberOfAssets();
      await searchTest.clearAll();
      await searchTest.searchAsset(data.searchText);
      await page.waitForLoadState('networkidle');
      await page.locator('.search-card').first().waitFor({ state: 'visible', timeout: 40000 });
      const numberOfAssetsAfterSearch = await searchTest.checkNumberOfAssets();
      expect(numberOfAssets).toBe(numberOfAssetsAfterSearch);
    });

    await test.step('Check assets and pages tabs ', async () => {
      await searchTest.assetTabs.click();
      await page.waitForLoadState('networkidle');
      await searchTest.checkCardTitle(`${data.asset2}`);

      await searchTest.pagesTab.click();
      await page.waitForLoadState('networkidle');
      await searchTest.checkCardTitle(`${data.asset3}`);
    });

    await test.step('Open preview for page', async () => {
      const [newTab] = await Promise.all([
        page.waitForEvent('popup'),
        searchTest.openPreviewPages.click(),
      ]);

      const newTabUrl = newTab.url();
      expect(newTabUrl).toContain(data.expectedUrl);

      await newTab.close();
    });

    await test.step('Search for Mapc assests', async () => {
      await searchTest.clearAll();
      await searchTest.searchAsset(`${data.searchKeyWord}`);
      await searchTest.checkCardTitle(data.asset4);
      await searchTest.checkCardTitle(data.asset5);
      await searchTest.checkCardTitle(data.asset6);
      await searchTest.checkCardTitle(data.asset7);
      await searchTest.checkCardTitle(data.asset8);
    });
  });
});

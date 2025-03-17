import { test, expect } from '@playwright/test';
import SignInPage from '../signin/signin.page.js';
import SearchSpec from '../search-page/search.spec.js';
import SearchPage from '../search-page/search.page.js';

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
        await searchTest.checkFileIcon(`${data.iconPdf}`)
        // check the present tags
        await searchTest.hasCardTag(data.asset1, data.asset1Tag1)
        await searchTest.hasCardTag(data.asset1, data.asset1Tag2)
        await searchTest.hasCardTag(data.asset1, data.asset1Tag3)
        await searchTest.hasCardTag(data.asset1, data.asset1Tag4)
        console.log('asset tag:', data.asset1Tag1)

        // open asset preview  LATER
        //await searchTest.openPreviewFile(data.assetURL, data.httpStatusCode);

        });

        await test.step('Check MAPC stage education', async () => {
            await searchTest.checkCardDescription(data.asset2, data.descriptionText);
            await searchTest.checkFileIcon(`${data.iconXLS}`);
        });

        await test.step('Check MAPC stage worldwide', async () => {
            await searchTest.checkFileIcon(data.iconDef);
            // size and last modife missing LATER

        });

        await test.step('Check MAPC stage combined', async () => {
            await searchTest.checkFileIcon(data.iconDoc);
        });
    });

    test(`${features[1].name}, ${features[1].tags}`, async ({ page }) => {
        const { data } = features[0];

        await test.step('Sign In with user', async () => {
            await page.goto(`${features[1].path}`);
            await page.waitForLoadState('domcontentloaded');

            await sginInSearchTest.signIn(page, `${features[0].data.partnerLevel}`);
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
            await searchTest.clearAllFilters.clik();
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
            await searchTest.filterSearchAssets(searchTest.filterProduct, searchTest.checkBoxAdobeSign);
            await searchTest.checkCardTitle(data.asset1);
            await searchTest.checkCardTitle(data.asset4);
        });

    });

})
import { test, expect } from '@playwright/test';
import PopupsPage from './popups.page.js';
import Popups from './popups.spec.js';

let popupsPage;

const { features } = Popups;
const differentLocaleCases = features.slice(0, 7);
const switchLocaleCases = features.slice(7, 9);

test.describe('Validate popups', () => {
  test.beforeEach(async ({ page, baseURL, browserName, context }) => {
    popupsPage = new PopupsPage(page);
    if (!baseURL.includes('partners.stage.adobe.com')) {
      await context.setExtraHTTPHeaders({ authorization: `token ${process.env.HLX_API_KEY}` });
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

  async function getGeoPopUpSelector(popUpText) {
    return `div.georouting-wrapper:has-text("${popUpText}")`;
  }

  differentLocaleCases.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, baseURL }) => {
      const newBaseUrl = baseURL.includes('adobecom.hlx.live') ? 'https://partners.stage.adobe.com' : baseURL;
      await test.step('Go to public page', async () => {
        await page.goto(`${newBaseUrl}${feature.path}`);
        await page.waitForLoadState();
      });

      await test.step('Verify geo pop-up appeared', async () => {
        const geoPopUpSelector = await getGeoPopUpSelector(feature.data.geoPopUpText);
        await page.waitForSelector(geoPopUpSelector, { timeout: 4000 });

        const switchLocaleButton = await popupsPage.getGeoLocaleButton(feature.data.buttonType);
        await expect(switchLocaleButton).toBeVisible();
        const href = await switchLocaleButton.getAttribute('href');
        await expect(href).toContain(feature.data.switchLocaleUrl);
      });
    });
  });

  switchLocaleCases.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, baseURL }) => {
      const newBaseUrl = baseURL.includes('adobecom.hlx.live') ? 'https://partners.stage.adobe.com' : baseURL;
      await test.step('Go to public page', async () => {
        await page.goto(`${newBaseUrl}${feature.path}`);
        await page.waitForLoadState();
      });

      await test.step('Verify geo pop-up appeared', async () => {
        const geoPopUpSelector = await getGeoPopUpSelector(feature.data.geoPopUpText);
        await page.waitForSelector(geoPopUpSelector, { timeout: 4000 });

        const switchLocaleButton = await popupsPage.getGeoLocaleButton(feature.data.switchLocaleButton);
        await expect(switchLocaleButton).toBeVisible();
        const hrefSwitch = await switchLocaleButton.getAttribute('href');
        await expect(hrefSwitch).toContain(feature.data.switchLocaleUrl);
        const stayLocaleButton = await popupsPage.getGeoLocaleButton(feature.data.stayLocaleButton);
        await expect(stayLocaleButton).toBeVisible();
        const hrefStay = await stayLocaleButton.getAttribute('href');
        await expect(hrefStay).toContain(feature.data.stayLocaleUrl);
        await popupsPage.clickLocaleButton(feature.data.clickButtonType);
        await page.waitForLoadState();
      });

      await test.step('Verify locale switch', async () => {
        const pages = await page.context().pages();
        await expect(pages[0].url())
          .toContain(feature.data.expectedToSeeInURL);
      });
    });
  });
});

import { test, expect } from '@playwright/test';
import redirectionsSpec from './redirections.spec.js';
import RedirectionsTest from './redirections.page.js';

let redirectionsTest;

const { features } = redirectionsSpec;

test.describe('Redirections Tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    redirectionsTest = new RedirectionsTest(page);

    const { path } = features[0];
    await test.step('Go to Landing page', async () => {
      await page.goto(new URL(path, baseURL).href);
    });
  });

  // @verify-find-partner-redirections
  test(`${features[0].name}, ${features[0].tags}`, async ({ page, baseURL }) => {
    const { data, path } = features[0];
    const findPartnerLink = await redirectionsTest.getFindPartnerByRegion(data.findPartnerLinkText);

    await test.step('Verify if Find a Partner is not visible on international pages', async () => {
      await page.goto(`${baseURL}${path}`);
      await expect(findPartnerLink).toBeHidden();
    });

    await test.step('Verify if Find a Partner link is redirecting to North America sales force page', async () => {
      await redirectionsTest.verifyURLRedirection(findPartnerLink, data.naLocalePartnerUrl, data.naLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Latin America sales force page', async () => {
      await redirectionsTest.verifyURLRedirection(findPartnerLink, data.naLocalePartnerUrl, data.latamLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Europe, Middle East, and Africa (English) sales force page', async () => {
      await redirectionsTest.verifyURLRedirection(findPartnerLink, data.naLocalePartnerUrl, data.emeaLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Franch sales force page', async () => {
      const findPartnerLinkFr = await redirectionsTest.getFindPartnerByRegion(data.findPartnerFrenchLinkText);
      await redirectionsTest.verifyURLRedirection(findPartnerLinkFr, data.frLocalePartnerUrl, data.frLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to German sales force page', async () => {
      const findPartnerLinkDe = await redirectionsTest.getFindPartnerByRegion(data.findPartnerGermanLinkText);
      await redirectionsTest.verifyURLRedirection(findPartnerLinkDe, data.deLocalePartnerUrl, data.deLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Italian sales force page', async () => {
      const findPartnerLinkIt = await redirectionsTest.getFindPartnerByRegion(data.findPartnerItalianLinkText);
      await redirectionsTest.verifyURLRedirection(findPartnerLinkIt, data.itLocalePartnerUrl, data.itLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Spanish sales force page', async () => {
      const findPartnerLinkEs = await redirectionsTest.getFindPartnerByRegion(data.findPartnerSpanishLinkText);
      await redirectionsTest.verifyURLRedirection(findPartnerLinkEs, data.esLocalePartnerUrl, data.esLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Asia Pacific sales force page', async () => {
      await redirectionsTest.verifyURLRedirection(findPartnerLink, data.naLocalePartnerUrl, data.apacLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Korian sales force page', async () => {
      const findPartnerLinkKr = await redirectionsTest.getFindPartnerByRegion(data.findPartnerKorianLinkText);
      await redirectionsTest.verifyURLRedirection(findPartnerLinkKr, data.krLocalePartnerUrl, data.krLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to China sales force page', async () => {
      const findPartnerLinkCn = await redirectionsTest.getFindPartnerByRegion(data.findPartnerChinaLinkText);
      await redirectionsTest.verifyURLRedirection(findPartnerLinkCn, data.cnLocalePartnerUrl, data.cnLocaleSwitchUrl);
    });

    await test.step('Verify if Find a Partner link is redirecting to Japan sales force page', async () => {
      const findPartnerLinkJp = await redirectionsTest.getFindPartnerByRegion(data.findPartnerJapanLinkText);
      await redirectionsTest.verifyURLRedirection(findPartnerLinkJp, data.jpLocalePartnerUrl, data.jpLocaleSwitchUrl);
    });
  });
});

import { test, expect } from '@playwright/test';
import PrpCollectionPage from './prp-collection.page.js';
import SignInPage from '../signin/signin.page.js';
import prpCollection from './prp-collection.spec.js';

let prpCollectionPage;
let signInPrpCollectionPage;

const { features } = prpCollection;
const specilizations = features.slice(0, 4);

test.describe('PRP Collection validation', () => {
  test.beforeEach(async ({ page }) => {
    prpCollectionPage = new PrpCollectionPage(page);
    signInPrpCollectionPage = new SignInPage(page);
  });

  specilizations.forEach((feature) => {
    test(`${feature.name}, ${feature.tags}`, async ({ page }) => {
      const { data } = feature;

      await test.step('Go to page and sign in with user', async () => {
        await page.goto(`${feature.path}`);
        await page.waitForLoadState('domcontentloaded');
        await prpCollectionPage.signInButton.click();
        await signInPrpCollectionPage.signIn(page, `${data.partnerLevel}`);
        await prpCollectionPage.profile.waitFor({ state: 'visible', timeout: 20000 });
        await prpCollectionPage.cardWrapper.waitFor({ state: 'visible', timeout: 20000 });
      });

      await test.step(`Verify "${data.title}" card is present on the page`, async () => {
        await expect(prpCollectionPage.card(data.title)).toBeVisible();
      });

      await test.step('Go to search page', async () => {
        await page.goto(`${data.goTo}`);
        await page.waitForLoadState('domcontentloaded');
        await prpCollectionPage.cardWrapper.waitFor({ state: 'visible', timeout: 20000 });
      });

      await test.step(`Verify "${data.title}" card is present on the search page`, async () => {
        await expect(prpCollectionPage.card(data.title)).toBeVisible();
      });
    });
  });
});

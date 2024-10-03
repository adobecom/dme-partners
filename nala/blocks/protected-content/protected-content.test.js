import { test, expect } from '@playwright/test';
import ProtectedContentPage from './protected-content.page.js';
import SignInPage from '../signin/signin.page.js';
import protectedContent from './protected-content.spec.js';

let protectedContentPage;
let singInPage;

const { features } = protectedContent;
const memberUsersCases = features.slice(2, 7);

test.describe('Validate different Partner Levels accessing protected content', () => {
  test.beforeEach(async ({ page }) => {
    protectedContentPage = new ProtectedContentPage(page);
    singInPage = new SignInPage(page);
    page.on('console', (msg) => {
      console.log(`${msg.type()}: ${msg.text()}`, msg.type() === 'error' ? msg.location().url : null);
    });
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page }) => {
    const { path, expectedToSeeInURL } = features[0];
    await test.step('Go to protected content page', async () => {
      await page.goto(`${path}`);
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${expectedToSeeInURL}`);
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, context }) => {
    test.slow();
    const { data, path } = features[1];
    await test.step('Go to public page', async () => {
      await page.goto(`${path}`);
      await page.waitForLoadState('domcontentloaded');
      await protectedContentPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await singInPage.signIn(page, `${data.partnerLevel}`);
      await page.waitForLoadState();
    });

    await test.step('Verify redirect to contact not found page', async () => {
      await protectedContentPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${data.contactNotFoundPage}`);
    });

    await test.step('Open protected content in a new tab - partner level does not match required', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${data.goldLevelPage}`);
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain(`${data.contentNotFoundPage}`);
    });

    await test.step('Open protected content in a new tab - partner level matches required', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${data.platinumLevelPage}`);
      const pages = await page.context().pages();
      await expect(pages[2].url())
        .toContain(`${data.contentNotFoundPage}`);
    });
  });

  memberUsersCases.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, context }) => {
      await test.step('Go to the home page', async () => {
        await page.goto(`${feature.path}`);
        await page.waitForLoadState('domcontentloaded');
        await protectedContentPage.signInButton.click();
      });

      await test.step('Sign in', async () => {
        await singInPage.signIn(page, `${feature.data.partnerLevel}`);
      });

      await test.step('Open matching region page in a new tab - partner level matches required', async () => {
        await protectedContentPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
        const newTab = await context.newPage();
        const newTabPage = new ProtectedContentPage(newTab);
        await newTab.goto(`${feature.data.matchingRegionPage}`);
        const cardTitle = await newTabPage.getCardTitle(feature.matchingRegionCardText);
        await expect(cardTitle).toBeVisible();
      });

      await test.step('Open non matching region page in a new tab - partner level matches required', async () => {
        await protectedContentPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
        const newTab = await context.newPage();
        const newTabPage = new ProtectedContentPage(newTab);
        await newTab.goto(`${feature.data.nonMatchingRegionPage}`);
        const cardTitle = await newTabPage.getCardTitle(feature.nonMatchingRegionCardText);
        await expect(cardTitle).toBeVisible();
      });

      await test.step('Open non matching partner level page in a new tab', async () => {
        const newTab = await context.newPage();
        await newTab.goto(`${feature.data.nonMatchingPartnerLevelPage}`);
        await newTab.waitForLoadState();
        await expect(newTab.url()).toContain(`${feature.data.contentNotFoundPage}`);
      });
    });
  });
});

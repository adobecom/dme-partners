import { test, expect } from '@playwright/test';
import SignInPage from '../signin/signin.page.js';
import AccessingAssets from './accessing-assets.spec.js';

let signInPage;
const { features } = AccessingAssets;
const localesAssetAccess = features.slice(3, 8);

test.describe('Validate popups', () => {
  test.beforeEach(async ({ page, baseURL, browserName, context }) => {
    signInPage = new SignInPage(page);
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
  //  @accessing-restricted-asset-non-logged-in-user
  test(`${features[0].name},${features[0].tags}`, async ({ page }) => {
    const { path } = features[0];
    await test.step('Try accessing restricted asset', async () => {
      await page.goto(`${path}`);
      await page.waitForLoadState('load');
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${features[0].expectedToSeeInURL}`);
    });
  });
  // @login-accessing-public-asset-with-member-user-logged-in-to-adobe
  test(`${features[1].name},${features[1].tags}`, async ({ page }) => {
    const { data, path } = features[1];
    const signInButton = await signInPage.getSignInButton(`${data.signInButtonText}`);
    await test.step('Go to adobe homepage', async () => {
      const url = `${path}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInButton.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with member user', async () => {
      await signInPage.signIn(page, `${data.partnerLevel}`);
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 15000 });
    });

    const promise = new Promise((resolve) => {
      page.on('response', (response) => {
        if (response.url().includes(`${data.assetURL}`) && response.status() === data.httpStatusCode) {
          resolve(true);
        }
      });
    });

    await test.step('Navigate to public asset URL', async () => {
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, data.assetURL);

      await page.waitForLoadState('load');
    });

    const resourceSuccessfullyLoaded = await promise;

    await expect(resourceSuccessfullyLoaded).toBe(true);
  });
  // @na-user-verify-asset-access-base-on-level
  test(`${features[2].name},${features[2].tags}`, async ({ page, context }) => {
    const { data, path } = features[2];
    const signInButton = await signInPage.getSignInButton(`${data.signInButtonText}`);
    await test.step('Go to adobe homepage', async () => {
      const url = `${path}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInButton.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with member user', async () => {
      await signInPage.signIn(page, `${data.partnerLevel}`);
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 15000 });
    });

    await test.step('Open forbidden asset in a new tab', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${data.assetURL}`);
      await page.waitForLoadState('load');
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain(`${data.expectedToSeeInURL}`);
    });
  });

  localesAssetAccess.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, context }) => {
      const { data, path } = feature;
      const signInButton = await signInPage.getSignInButton(`${data.signInButtonText}`);
      await test.step('Go to adobe homepage', async () => {
        const url = `${path}`;
        await page.evaluate((navigationUrl) => {
          window.location.href = navigationUrl;
        }, url);

        await signInButton.click();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Sign in with member user', async () => {
        await signInPage.signIn(page, `${data.partnerLevel}`);
        await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 30000 });
      });

      await test.step('Open forbidden asset in a new tab', async () => {
        const newTab = await context.newPage();
        await newTab.goto(`${data.forbiddenAsset}`);
        await page.waitForLoadState('load');
        const pages = await page.context().pages();
        await expect(pages[1].url())
          .toContain(`${data.expectedToSeeInURL}`);
      });

      const promise = new Promise((resolve) => {
        page.on('response', (response) => {
          if (response.url().includes(`${data.assetURL}`) && response.status() === data.httpStatusCode) {
            resolve(true);
          }
        });
      });

      await test.step('Navigate to public asset URL', async () => {
        await page.evaluate((navigationUrl) => {
          window.location.href = navigationUrl;
        }, data.assetURL);
        await page.waitForLoadState('load');
      });

      const resourceSuccessfullyLoaded = await promise;
      expect(resourceSuccessfullyLoaded).toBe(true);
    });
  });
  // @accessing-public-asset-non-logged-in-user
  test(`${features[8].name},${features[8].tags}`, async ({ page }) => {
    const { data } = features[8];
    const promise = new Promise((resolve) => {
      page.on('response', (response) => {
        if (response.url().includes(`${data.assetURL}`) && response.status() === data.httpStatusCode) {
          resolve(true);
        }
      });
    });
    await test.step('Try accessing restricted asset', async () => {
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, data.assetURL);

      await page.waitForLoadState('load');
    });
    const resourceSuccessfullyLoaded = await promise;

    expect(resourceSuccessfullyLoaded).toBe(true);
  });
});

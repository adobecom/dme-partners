import { test, expect } from '@playwright/test';
import SearchAssetsPage from './search-assets.page.js';
import SignInPage from '../signin/signin.page.js';
import SearchAssets from './search-assets.spec.js';

let searchAssetsPage;
let signInPage;

const { features } = SearchAssets;

test.describe('Validate popups', () => {
  test.beforeEach(async ({ page, baseURL, browserName, context }) => {
    searchAssetsPage = new SearchAssetsPage(page);
    signInPage = new SignInPage(page);
    // page.on('console', (msg) => {
    //   console.log(`${msg.type()}: ${msg.text()}`, msg.type() === 'error' ? msg.location().url : null);
    // });
    // page.on('download', () => {
    //   console.log('download event triggered');
    // });
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

  test(`${features[0].name},${features[0].tags}`, async ({ page }) => {
    const { data, path } = features[0];
    const url = `${path}`;

    await page.route('**/*.pdf', (route) => {
      const headers = {
        ...route.request().headers(),
        'Content-Disposition': 'inline',
        'Content-Type': 'application/pdf',
      };
      route.continue({ headers });
    });

    let resourceValidated = false;

    page.on('response', (response) => {
      if (response.url().includes('/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf')) {
        const contentDisposition = response.headers()['content-disposition'];
        const contentType = response.headers()['content-type'];

        console.log('Content-Disposition:', contentDisposition);
        console.log('Content-Type:', contentType);

        if (contentType === 'application/pdf' && (!contentDisposition || contentDisposition.includes('inline'))) {
          resourceValidated = true;
        } else {
          console.log('PDF might be downloaded instead of previewed.');
        }
      }
    });

    await page.evaluate((navigationUrl) => {
      window.location.href = navigationUrl;
    }, url);

    await page.waitForTimeout(10000);

    expect(resourceValidated).toBe(true);

    // await page.waitForFunction(
    //   () => !window.location.href.includes('about:blank'),
    //   { timeout: 10000 },
    // );

    // const pages = await page.context().pages();
    // await expect(pages[0].url())
    //   .toContain(`${data.expectedToSeeInURL}`);
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, context }) => {
    test.slow();
    const { data, path, baseURL } = features[1];
    const signInButton = await signInPage.getSignInButton(`${data.signInButtonText}`);
    await test.step('Go to adobe homepage', async () => {
      const url = `${baseURL}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInButton.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with member user', async () => {
      await signInPage.signIn(page, `${data.partnerLevel}`);
      await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 15000 });
    });

    // await test.step('Preview asset in a new tab', async () => {
    //   const newTab = await context.newPage();
    //   // await newTab.goto(`${data.previewAssetLink}`);
    //   const url = `${data.previewAssetLink}`;
    //   await newTab.evaluate((navigationUrl) => {
    //     window.location.href = navigationUrl;
    //   }, url);

    //   // TEST delete
    //   await newTab.on('console', (msg) => {
    //     console.log(`[PAGE LOG]: ${msg.text()}`);
    //   });

    //   await newTab.evaluate(() => {
    //     setInterval(() => {
    //       console.log(`B Please ${window.location.href}`);
    //     }, 3000); // 5 seconds interval
    //   });

    //   // TEST delete
    //   await newTab.waitForFunction(
    //     () => !window.location.href.includes('about:blank'),
    //     { timeout: 10000 },
    //   );

    //   const pages = await page.context().pages();
    //   await expect(pages[1].url())
    //     .toContain(`${data.previewAssetLink}`);
    // });

    await test.step('Download asset from a new tab', async () => {
      const newTab = await context.newPage();
      const downloadPromise = newTab.waitForEvent('download');
      const url = `${data.downloadAssetLink}`;
      await newTab.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await page.route('**/*.pdf', (route) => {
        const headers = {
          ...route.request().headers(),
          'Content-Disposition': 'inline',
          'Content-Type': 'application/pdf',
        };
        route.continue({ headers });
      });

      let resourceValidated = false;

      page.on('response', (response) => {
        if (response.url().includes('/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf')) {
          const contentDisposition = response.headers()['content-disposition'];
          const contentType = response.headers()['content-type'];

          console.log('Content-Disposition:', contentDisposition);
          console.log('Content-Type:', contentType);

          if (contentType === 'application/pdf' && (!contentDisposition || contentDisposition.includes('inline'))) {
            resourceValidated = true;
          } else {
            console.log('PDF might be downloaded instead of previewed.');
          }
        }
      });

      const download = await downloadPromise;
      const downurl = download.url();
      await expect(resourceValidated).toBe(true);
      await expect(downurl).toContain(`${data.downloadURL}`);
    });
  });
});

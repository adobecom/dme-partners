import { test, expect } from '@playwright/test';
import SignInPage from './signin.page.js';
import signin from './signin.spec.js';

let signInPage;

const { features } = signin;
const redirectionFeatures = features.slice(1, 3);
const nonMemberRedirects = features.slice(3, 5);
const nonMemberLoggedInToAdobe = features.slice(5, 7);

test.describe('MAPC sign in flow', () => {
  test.beforeEach(async ({ page, browserName, baseURL, context }) => {
    signInPage = new SignInPage(page);
    page.on('console', (msg) => {
      console.log(`${msg.type()}: ${msg.text()}`, msg.type() === 'error' ? msg.location().url : null)
    });
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
    await test.step('Go to the home page', async () => {
      await page.goto(`${features[0].path}`);
      await page.waitForLoadState('domcontentloaded');
      await signInPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await signInPage.signIn(page, `${features[0].data.partnerLevel}`);
    });

    await test.step('Verify redirection to restricted home after successful login', async () => {
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url()).toContain(`${features[0].data.expectedProtectedHomeURL}`);
    });

    await test.step('Logout', async () => {
      await signInPage.profileIconButton.click();
      await signInPage.logoutButton.click();
    });

    await test.step('Verify redirection to public page after logout', async () => {
      await signInPage.signInButton.waitFor({ state: 'visible', timeout: 10000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${features[0].data.expectedPublicPageURL}`);
    });
  });

  redirectionFeatures.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, context }) => {
//       const newTab = await context.newPage();
//       const newTabPage = new SignInPage(newTab);
      await signInPage.verifyRedirectAfterLogin({
        page,
        expect,
        path: feature.baseURL,
        partnerLevel: feature.data.partnerLevel,
        expectedLandingPageURL: feature.data.expectedToSeeInURL,
      });
    });
  });

  nonMemberRedirects.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, browserName }) => {
      if (browserName === 'firefox') {
       test.slow();
      }
      await test.step('Go to the home page', async () => {
        await page.goto(`${feature.path}`);
        await page.waitForLoadState('domcontentloaded');
        await signInPage.signInButton.click();
      });

      await test.step('Sign in', async () => {
        await signInPage.signIn(page, `${feature.data.partnerLevel}`);
      });

      await test.step('After login user is redirected to contact-not-found page', async () => {
        await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
        const pages = await page.context().pages();
        await expect(pages[0].url()).toContain(`${feature.data.expectedRedirectedURL}`);
      });

      await test.step('Logout', async () => {
        const currentUrl = page.url();
        const newUrl = `${currentUrl.replace('#','')}?akamaiLocale=na&martech=off`;
        await page.goto(newUrl);
        await signInPage.profileIconButton.click();
        await signInPage.logoutButton.click();
      });

      await test.step('Verify redirection to public page after logout', async () => {
        await signInPage.signInButton.waitFor({ state: 'visible', timeout: 10000 });
        const pages = await page.context().pages();
        await expect(pages[0].url())
          .toContain(`${feature.data.expectedPublicPageURL}`);
      });
    });
  });

  nonMemberLoggedInToAdobe.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page, context, browserName }) => {
      if (browserName === 'firefox') {
       test.slow();
      }
      await test.step('Go to the home page', async () => {
        const url = `${feature.baseURL}`;
        await page.evaluate((navigationUrl) => {
          window.location.href = navigationUrl;
        }, url);

        await signInPage.signInButton.click();
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Sign in with tpp platinum user', async () => {
        await signInPage.signIn(page, `${feature.data.partnerLevel}`);
        await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 15000 });
      });

      await test.step(`Open ${feature.data.page} in a new tab`, async () => {
        const newTab = await context.newPage();
        await newTab.goto(`${feature.path}`);
        const newTabPage = new SignInPage(newTab);
        await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
        const pages = await page.context().pages();
        await expect(pages[1].url())
          .toContain(`${feature.data.expectedRedirectedURL}`);
        const signInButton = await newTabPage.signInButton;
        await expect(signInButton).toBeHidden();
        const joinNowButton = await newTabPage.joinNowButton;
        await expect(joinNowButton).toBeVisible();
      });
    });
  });

  test(`${features[7].name},${features[7].tags}`, async ({ page, context, browserName }) => {
    if (browserName === 'firefox') {
      test.slow();
    }
    const { data, path, baseURL } = features[7];
    await test.step('Go to the home page', async () => {
      const url = `${baseURL}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInPage.signInButton.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with tpp platinum user', async () => {
      await signInPage.signIn(page, `${data.partnerLevel}`);
      await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 15000 });
    });

    await test.step('Open public page in a new tab', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${path}`);
      const newTabPage = new SignInPage(newTab);
      await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain(`${data.expectedPublicURL}`);
      const signInButton = await newTabPage.signInButton;
      await expect(signInButton).toBeHidden();
      const joinNowButton = await newTabPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
    });

    await test.step('Open restricted page in a new tab', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${data.restrictedHomePath}`);
      const newTabPage = new SignInPage(newTab);
      await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[2].url())
        .toContain(`${data.expectedToSeeInURL}`);
    });
  });

  test(`${features[8].name},${features[8].tags}`, async ({ page }) => {
    const { path, expectedToSeeInURL } = features[8];
    await test.step('Go to protected home page', async () => {
      await page.goto(`${path}`);
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${expectedToSeeInURL}`);
    });
  });
});

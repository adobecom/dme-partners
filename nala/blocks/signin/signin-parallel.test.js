import { test, expect } from '@playwright/test';
import SignInPage from './signin.page.js';
import signin from './signin.spec.js';

let signInPage;

const { features } = signin;
test.describe.configure({ mode: 'parallel' });

test.describe('MAPC sign in flow', () => {
  test.beforeEach(async ({ page, browserName, baseURL, context }) => {
    signInPage = new SignInPage(page);
    page.on('console', (msg) => {
      console.log(`${msg.type()}: ${msg.text()}`, msg.type() === 'error' ? msg.location().url : null);
    });
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
      const signInButtonInt = await signInPage.getSignInButton(`${features[0].data.signInButtonInternationalText}`);
      await signInButtonInt.click();
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
      const logoutButton = await signInPage.getButtonElement(`${features[0].data.logoutButtonText}`);
      await logoutButton.click();
    });

    await test.step('Verify redirection to public page after logout', async () => {
      const signInButton = await signInPage.getSignInButton(`${features[0].data.signInButtonEsGeoText}`);
      await signInButton.waitFor({ state: 'visible', timeout: 10000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${features[0].data.expectedPublicPageURL}`);
    });
  });

  test(`${features[13].name},${features[13].tags}`, async ({ page }) => {
    const { data, path } = features[13];
    await test.step('Go to public program page', async () => {
      await page.goto(`${path}`);
      await page.waitForLoadState('domcontentloaded');
      const joinNowButton = await signInPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
      const signInButtonInt = await signInPage.getSignInButton(`${data.signInButtonInternationalText}`);
      await expect(signInButtonInt).toBeVisible();
      await signInButtonInt.click();
    });

    await test.step('Sign in', async () => {
      await signInPage.signIn(page, `${data.partnerLevel}`);
    });

    const signInButton = await signInPage.getSignInButton(`${data.signInButtonText}`);
    await test.step('After login user is redirected to protected program page', async () => {
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url()).toContain(`${data.landingPageAfterLoginURL}`);
      const joinNowButton = await signInPage.joinNowButton;
      await expect(joinNowButton).toBeHidden();
      await expect(signInButton).toBeHidden();
    });

    await test.step('Logout', async () => {
      const currentUrl = page.url();
      const newUrl = `${currentUrl.replace('#', '')}?akamaiLocale=na&martech=off`;
      await page.goto(newUrl);
      await signInPage.profileIconButton.click();
      const logoutButton = await signInPage.getButtonElement(`${data.logoutButtonText}`);
      await logoutButton.click();
    });

    await test.step('Verify redirection to public program page after logout', async () => {
      await signInButton.waitFor({ state: 'visible', timeout: 10000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${data.landingPageAfterLogoutURL}`);
      const joinNowButton = await signInPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
      await expect(signInButton).toBeVisible();
    });
  });
});

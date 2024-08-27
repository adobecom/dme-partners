import { test, expect } from '@playwright/test';
import SignInPage from './signin.page.js';

let signInPage;
import signin from './signin.spec.js';

const { features } = signin;
const redirectionFeatures = features.slice(1, 3);

test.describe('MAPC sign in flow', () => {
  test.beforeEach(async ({ page, browserName, baseURL, context }) => {
    signInPage = new SignInPage(page);
    page.on('console', msg => console.log(msg.text()));
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
        console.log('ssss', features[0].data.partnerLevel);
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
       const newTab = await context.newPage();
       const newTabPage = new SignInPage(newTab);
       await signInPage.verifyRedirectAfterLogin({
         page,
         expect,
         path: feature.baseURL,
         partnerLevel: feature.data.partnerLevel,
         expectedLandingPageURL: feature.data.expectedToSeeInURL,
       });
     });
   });

});

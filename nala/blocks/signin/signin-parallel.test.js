import { test, expect } from '@playwright/test';
import SignInPage from './signin.page.js';
import signin from './signin.spec.js';

let signInPage;

const { features } = signin;

const resellerMembersLogin = features.slice(9, 13);

test.describe.configure({ mode: 'parallel' });

test.describe('MAPC sign in flow parallel', () => {
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

  for (let i = 0; i < 1; i++) {
     resellerMembersLogin.forEach((feature) => {
      test(`Run ${i + 1}: ${feature.name},${feature.tags}`, async ({ page }) => {
        await test.step('Go to the public page', async () => {
          await page.goto(`${feature.path}`);
          await page.waitForLoadState('domcontentloaded');
          const signInButton = await signInPage.getSignInButton(`${feature.data.signInButtonText}`);
          await signInButton.click();
        });

        await test.step('Sign in', async () => {
          await signInPage.signIn(page, `${feature.data.partnerLevel}`);
        });

        await test.step('Verify successful login', async () => {
          await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
        });
      });
    });
  }

});

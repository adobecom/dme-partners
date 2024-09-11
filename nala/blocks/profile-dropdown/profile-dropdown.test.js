import { test, expect } from '@playwright/test';
import ProfileDropdownPage from './profile-dropdown.page.js';
import SignInPage from '../signin/signin.page.js';
import profiles from './profile-dropdown.spec.js';

let profileDropdownPage;
let signInPage;

const { features } = profiles;

test.describe('MAPC sign in flow', () => {
  test.beforeEach(async ({ page, browserName, baseURL, context }) => {
    profileDropdownPage = new ProfileDropdownPage(page);
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
    const { data, path } = features[0];
    await test.step('Go to the home page', async () => {
      await page.goto(`${path}`);
      await page.waitForLoadState('domcontentloaded');
      await profileDropdownPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await signInPage.signIn(page, `${data.partnerLevel}`);
    });

    await test.step('Verify profile dropdown after successful login', async () => {
      await profileDropdownPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      await profileDropdownPage.toggleProfileDropdown();
      const profileImage = await profileDropdownPage.profileImage;
      await expect(profileImage).toBeVisible();
      const profileName = await profileDropdownPage.profileName.textContent();
      await expect(profileName).toBe(data.profileName);
      const profileEmail = await profileDropdownPage.profileEmail.textContent();
      await expect(profileEmail).toBe(data.profileEmail);
      const primaryContact = await profileDropdownPage.primaryContact;
      await expect(primaryContact).toBeVisible();
    });

    await test.step('Logout', async () => {
      await profileDropdownPage.logoutButton.click();
    });
  });
});

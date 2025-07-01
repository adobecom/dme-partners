import { test, expect } from '@playwright/test';
import DmeFormPage from './dme-form.page.js';
import SignInPage from '../signin/signin.page.js';
import DmeFormSpec from './dme-form.spec.js';

let dmeFormPage;
let singInPage;

const { features } = DmeFormSpec;

test.describe('Validate DME Form block', () => {
  test.beforeEach(async ({ page, browserName, baseURL, context }) => {
    dmeFormPage = new DmeFormPage(page);
    singInPage = new SignInPage(page);
    if (!baseURL.includes('partners.stage.adobe.com')) {
      await context.setExtraHTTPHeaders({ authorization: `token ${process.env.MILO_AEM_API_KEY}` });
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

  test(`${features[0].name},${features[0].tags}`, async ({ page, context, baseURL }) => {
    test.slow();
    const { data, path } = features[0];
    let emailValue = '';
    let partnerNameValue = '';

    await test.step('Go to Promo Pricing page', async () => {
      await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
    });

    await test.step('Set partner_data cookie', async () => {
      if (baseURL.includes('adobe.com')) {
        await singInPage.signIn(page, `${data.partnerLevel}`);
        await page.waitForLoadState();
      } else {
        await singInPage.addCookie(
          data.partnerData,
          `${baseURL}${path}`,
          context,
        );

        await page.reload({ waitUntil: 'networkidle' });
      }
    });

    await test.step('Verify form field autofill', async () => {
      emailValue = await dmeFormPage.emailField.inputValue();
      expect(emailValue).not.toBe('');

      partnerNameValue = await dmeFormPage.partnerNameField.inputValue();
      expect(partnerNameValue).not.toBe('');
    });

    await test.step('Complete the form', async () => {
      await dmeFormPage.customerVIPField.fill('Yes');
      await dmeFormPage.customerCountryField.fill('USA');
      await dmeFormPage.customerRegionField.fill('USA');
      await dmeFormPage.adobeSalesOrderField.fill('1');
      await dmeFormPage.orderAmountField.fill('1');
      await dmeFormPage.durationField.fill('12');
    });

    await test.step('Trigger validation by clearing key fields', async () => {
      await dmeFormPage.emailField.fill('');
      await dmeFormPage.partnerNameField.fill('');
      await dmeFormPage.durationField.fill('');
      await page.keyboard.press('Tab');

      await expect(dmeFormPage.emailField.locator('..')).toHaveClass(/error/);
      await expect(dmeFormPage.partnerNameField.locator('..')).toHaveClass(/error/);
      await expect(dmeFormPage.durationField.locator('..')).toHaveClass(/error/);
    });

    await test.step('Restore valid input and submit the form', async () => {
      await dmeFormPage.emailField.fill(emailValue);
      await dmeFormPage.partnerNameField.fill(partnerNameValue);
      await dmeFormPage.durationField.fill('12');

      await dmeFormPage.formSubmitButton.click();
    });

    await test.step('Post-submission validation', async () => {
      const urlRegex = new RegExp(`.*${data.thankYouPageURL}.*`);
      await page.waitForURL(urlRegex, { timeout: 5000 });

      const pages = await page.context().pages();
      expect(pages[0].url()).toContain(`${baseURL}${data.thankYouPageURL}`);
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, context, baseURL }) => {
    const { data, path } = features[1];

    await test.step('Go to Promo Pricing page', async () => {
      await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
    });

    await test.step('Set partner_data cookie', async () => {
      if (baseURL.includes('adobe.com')) {
        await singInPage.signIn(page, `${data.partnerLevel}`);
        await page.waitForLoadState();
      } else {
        await singInPage.addCookie(
          data.partnerData,
          `${baseURL}${path}`,
          context,
        );

        await page.reload({ waitUntil: 'networkidle' });
      }

      await expect(dmeFormPage.notFound404).toBeVisible({ timeout: 30000 });
    });
  });
});

export default class SignInPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.signInButtonStageAdobe = page.locator('.profile-comp.secondary-button');
    this.profileIconButton = page.locator('.feds-profile-button');
    this.profileIconButtonAdobe = page.locator('.profile-container .profile-collapsed');
    this.userNameDisplay = page.locator('.user-name');
    this.logoutButton = page.locator('[daa-ll="Sign Out"]');

    this.emailField = page.locator('#EmailPage-EmailField');
    this.emailPageContinueButton = page.locator('//button[@data-id="EmailPage-ContinueButton"]');
    this.passwordField = page.locator('#PasswordPage-PasswordField');
    this.passwordPageContinueButton = page.locator('//button[@data-id="PasswordPage-ContinueButton"]');
  }

  async signIn(page, partnerLevel) {
    const email = process.env.IMS_EMAIL.split(partnerLevel)[1].split(';')[0];
    await page.waitForLoadState('domcontentloaded');
    await this.emailField.fill(email);
    await this.emailPageContinueButton.click();
    await this.passwordField.fill(process.env.IMS_PASS);
    await this.passwordPageContinueButton.click();
  }

  async verifyRedirectAfterLogin({ page, expect, path, partnerLevel, expectedLandingPageURL, browserName, tcid, }) {
    await page.goto(path);
    await page.waitForLoadState('domcontentloaded');
    if (path.includes('stage.adobe.com/partners.html')) {
      const h1 = await page.locator('div.responsivegrid h1');
      console.log('the h1 is: ',h1);
      await expect(h1).toBeVisible();
      await page.screenshot({ path: `nala/screenshots/${browserName}-testId-${tcid}-screenshot.png` });
      await this.signInButtonStageAdobe.waitFor({ state: 'visible', timeout: 30000 });
      await this.signInButtonStageAdobe.click();
    } else {
      await this.signInButton.click();
    }
    await this.signIn(page, partnerLevel);
    await page.waitForLoadState('domcontentloaded');
    if (path.includes('stage.adobe.com/partners.html')) {
      await this.profileIconButtonAdobe.waitFor({ state: 'visible', timeout: 30000 });
      const pages = await page.context().pages();
    } else {
      await this.profileIconButton.waitFor({ state: 'visible', timeout: 30000 });
      const pages = await page.context().pages();
      await expect(pages[0].url()).toContain(expectedLandingPageURL);
    }
  }

  async addCookie(partnerData, page, context) {
    this.context = context;
    await this.context.addCookies([{
      name: 'partner_data',
      value: `{"${partnerData.partnerPortal}":{"accountAnniversary":"${partnerData.anniversaryDate ? partnerData.anniversaryDate : '2040-08-22T00:00:00.000Z'}"%2C"company":"Company"%2C`
      + `"firstName":"${partnerData.firstName !== undefined && partnerData.firstName !== null ? partnerData.firstName : 'Name'}"%2C"lastName":"LastName"%2C`
      + `"level":"${partnerData.partnerLevel}"%2C"permissionRegion":"${partnerData.permissionRegion}"%2C"primaryContact":true%2C"salesCenterAccess":true%2C"status":"MEMBER"}}`,
      url: `${page}`,
    }]);
  }
}

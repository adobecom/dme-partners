export default class SignInPage {
  constructor(page) {
    this.page = page;
    this.profileIconButton = page.locator('.feds-profile-button');
    this.profileIconButtonAdobe = page.getByLabel('Profile button');
    this.userNameDisplay = page.locator('.user-name');
    this.joinNowButton = page.locator('#feds-nav-wrapper .feds-cta--primary:has-text("Join Now")');

    this.emailField = page.locator('#EmailPage-EmailField');
    this.emailPageContinueButton = page.locator('//button[@data-id="EmailPage-ContinueButton"]');
    this.passwordField = page.locator('#PasswordPage-PasswordField');
    this.passwordPageContinueButton = page.locator('//button[@data-id="PasswordPage-ContinueButton"]');
  }

  async getButtonElement(text) {
    return this.page.locator(`[daa-ll="${text}"]`);
  }

  async getSignInButton(text) {
    return this.page.getByRole('button', { name: `${text}` });
  }

  async signIn(page, partnerLevel) {
    const email = process.env.IMS_EMAIL.split(partnerLevel)[1].split(';')[0];
    await page.waitForLoadState('domcontentloaded');
    await this.emailField.fill(email);
    await this.emailPageContinueButton.click();
    await this.passwordField.fill(process.env.IMS_PASS);
    await this.passwordPageContinueButton.click();
  }

  async verifyRedirectAfterLogin({
    page, expect, path, partnerLevel, expectedLandingPageURL, buttonText,
  }) {
    await page.goto(path);
    await page.waitForLoadState('domcontentloaded');

    await this.page.getByRole('button', { name: 'Sign In' }).waitFor({ state: 'visible', timeout: 30000 });
    const signInButton = await this.getSignInButton(buttonText);
    await signInButton.click();
    await this.signIn(page, partnerLevel);
    await page.waitForLoadState('domcontentloaded');
    if (!path.includes('automation/regression')) {
      await page.context().pages();
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

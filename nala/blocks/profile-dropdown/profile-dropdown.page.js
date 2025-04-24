export default class ProfileDropdownPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.profileIconButton = page.locator('.feds-profile-button');
    this.profileImage = page.locator('div#feds-profile-menu img[alt="profile avatar"]');
    this.profileName = page.locator('.feds-profile-name');
    this.profileEmail = page.locator('.feds-profile-email');
    this.primaryContact = page.locator('.primary-contact-wrapper');
    this.profilePartnerLevel = page.locator('.level-placeholder');
    this.editProfileButton = page.locator('.feds-profile-account');
    this.accountManagementButton = page.locator('a:has-text("Open account management")');
    this.salesCenterButton = page.locator('a:has-text("Go to Sales Center")');
    this.renewNowButton = page.locator('.intro.partner-expired.partner-renew.text a[target="_blank"]');
    this.logoutButton = page.locator('[daa-ll="Sign Out"]');
    this.profileMenu = page.locator('#feds-profile-menu');
  }

  async toggleProfileDropdown() {
    await this.page.locator('.feds-profile-button').click();
  }

  getRenewNotification(type) {
    return this.page.locator(`.intro.partner-${type}.partner-renew.text > div > div > p:nth-of-type(1)`);
  }

  async clickRenewNowButton(type) {
    await this.page.locator(`.intro.partner-${type}.partner-renew.text a[target="_blank"]`).click();
  }

  getAccountManagementByText(text) {
    return this.page.locator(`a:has-text("${text}")`);
  }

  getLogoutByText(text) {
    return this.page.locator(`[daa-ll="${text}"]`);
  }
}

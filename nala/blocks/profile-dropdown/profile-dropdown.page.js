export default class ProfileDropdownPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.profileIconButton = page.locator('.feds-profile-button');
    this.profileImage = page.locator('.feds-profile-img');
    this.profileName = page.locator('.feds-profile-name');
    this.profileEmail = page.locator('.feds-profile-email');
    this.primaryContact = page.locator('.primary-contact-wrapper');
    this.profilePartnerLevel = page.locator('.level-placeholder');
    this.logoutButton = page.locator('[daa-ll="Sign Out"]');
  }

  async toggleProfileDropdown() {
    await this.page.locator('.feds-profile-button').click();
  }
}

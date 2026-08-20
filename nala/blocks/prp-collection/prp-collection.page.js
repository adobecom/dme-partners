export default class PrpCollectionPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('.feds-profile');
    this.profileIconButton = page.locator('.feds-profile-button');
    this.profile = page.locator('.feds-profile');
    this.cardWrapper = page.locator('.card-wrapper');
  }

  card(title) {
    return this.page.locator('.card-title').getByText(title, { exact: true });
  }
}
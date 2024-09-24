export default class ProtectedContentPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.profileIconButton = page.locator('.feds-profile-button');
  }

  getCardTitle(title) {
    return this.page.getByRole('heading', { name: `${title}` });
  }
}

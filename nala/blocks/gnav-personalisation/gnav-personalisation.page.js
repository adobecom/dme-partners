export default class GnavPersonalisationPage {
  constructor(page) {
    this.page = page;
    this.protectedGnavHeader = page.locator('header[daa-lh="gnav|loggedin-gnav"]');
    this.publicGnavHeader = page.locator('header[daa-lh="gnav|public-gnav"]');
    this.joinNowButton = page.locator('#feds-nav-wrapper .feds-cta--primary:has-text("Join Now")');
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.profileIconButton = page.locator('.feds-profile-button');

    this.welcomeFirstName = page.locator('h4#welcome-firstname');
    this.fragmentPartnerAllLevel = page.locator('.partner-all-levels div .fragment');
  }

  getH3ElementById(id) {
    return this.page.locator(`h3#${id}`);
  }

  getParagraphByH3ElementId(id, paragraphIndex) {
    return this.page.locator(`div:has(> h3#${id}) > p:nth-of-type(${paragraphIndex})`);
  }
}

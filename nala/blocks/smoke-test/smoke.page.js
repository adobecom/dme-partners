export default class SmokeTest {
  constructor(page) {
    this.page = page;
    this.joinNowButton = page.locator(
      '#feds-nav-wrapper .feds-cta--primary:has-text("Join Now")'
    );
    this.signInButton = page.locator('.feds-signIn');
    this.GNav = page.locator('.feds-topnav');
    this.profileIcon = page.locator('.feds-profile-button');
    this.priceList = page.locator('[daa-ll="Price lists-1"]');
    this.tableSelector = '.table-container';
    this.searchGnav = page.locator('.feds-search-trigger');
    this.searchGnavField = page.locator('.feds-search-input');
    this.searchFieldPage = page.locator('#search');
    this.announcemnts = page.locator('[daa-ll="Announcements-6"]');
  }

  async verifyButtonExist() {
    const joinNowExist = await this.joinNowButton.isVisible();
    const signInExists = await this.signInButton.isVisible();

    return {
      joinNowButton: joinNowExist,
      signInButton: signInExists,
    };
  }

  async verifyProtectedGnav() {
    const gNavExists = await this.GNav.isVisible();

    return {
      GNav: gNavExists,
    };
  }

  async verifyProfileIcon() {
    const profileIconExists = await this.profileIcon.isVisible();

    return {
      profileIcon: profileIconExists,
    };
  }

  async getCurrentUrl() {
    return await this.page.url();
  }

  async clickDownloadButtonInFirstRow() {
    const firstRowWithDownload = this.page
      .locator(`${this.tableSelector} tr:has(td[headers="download"])`)
      .first();
    const downloadButton = firstRowWithDownload.locator('#button');
    await downloadButton.click();
  }

  async searchPageDownloadButton() {
    const enableAll = this.page.locator('#onetrust-accept-btn-handler');
    await enableAll.waitFor({ state: 'visible' });
    await enableAll.click();
    const shadowHost = await this.page
      .locator('search-cards.search-cards-wrapper[data-idx="2"]')
      .elementHandle();
    const shadowRoot = await shadowHost.evaluateHandle(
      (node) => node.shadowRoot
    );

    const downloadButton = await shadowRoot.$(
      'sp-action-button[href="https://partners.stage.adobe.com/channelpartnerassets/assets/public/public_1/scanning_documents_into_pdf_files--ar.pdf?download"]'
    );

    await downloadButton.click();
  }

  async announcmentCardVerification() {
    const shadowHostCard = await this.page
      .locator(
        'announcements-cards.content.announcements-wrapper[data-idx="0"]'
      )
      .elementHandle();
    const shadowRootCard = await shadowHostCard.evaluateHandle(
      (node) => node.shadowRoot
    );

    const announcementsCrad = await shadowRootCard.$$('.card-wrapper');
    const firstCard = announcementsCrad[0];
    await firstCard.isVisible();
  }
}

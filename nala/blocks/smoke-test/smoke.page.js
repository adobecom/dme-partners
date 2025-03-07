export default class SmokeTest {
  constructor(page) {
    this.page = page;
    this.joinNowButton = page.locator('text="Join Now"');
    this.signInButton = page.locator('.feds-signIn');
    this.GNav = page.locator('.feds-topnav');
    this.profileIcon = page.locator('.feds-profile-button');
    this.priceList = page.locator('a.feds-navLink:has-text("Price lists")');
    this.tableSelector = '.table-container';
    this.searchGnav = page.locator('.feds-search-trigger');
    this.searchGnavField = page.locator('.feds-search-input');
    this.searchFieldPage = page.locator('.search-wrapper #search');
    this.announcemnts = page.locator('text="Announcements"');
    this.emailField = page.locator('#EmailPage-EmailField');
    this.emailPageContinueButton = page.locator('//button[@data-id="EmailPage-ContinueButton"]');
    this.passwordField = page.locator('#PasswordPage-PasswordField');
    this.passwordPageContinueButton = page.locator('//button[@data-id="PasswordPage-ContinueButton"]');
  }

  async smokeSignIn(page, baseURL, partnerLevel) {
    const isProduction = baseURL.includes('partners.adobe.com');
    const emailData = isProduction ? process.env.IMS_EMAIL_PROD : process.env.IMS_EMAIL;
    const emailPart = emailData.split(';');
    const emailEntry = emailPart.find((pair) => pair.startsWith(partnerLevel));
    const email = emailEntry ? emailEntry.split(':')[1] : null;
    await page.waitForLoadState('domcontentloaded');
    await this.emailField.fill(email);
    await this.emailPageContinueButton.click();
    await this.passwordField.fill(process.env.IMS_PASS);
    await this.passwordPageContinueButton.click();
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

    return { GNav: gNavExists };
  }

  async verifyProfileIcon() {
    const profileIconExists = await this.profileIcon.isVisible();

    return { profileIcon: profileIconExists };
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async clickDownloadButtonInFirstRow() {
    const firstRowWithDownload = this.page
      .locator(`${this.tableSelector} tr:has(td[headers="download"])`)
      .first();
    const downloadButton = firstRowWithDownload.locator('#button');
    await downloadButton.click();
  }

  async searchPageDownloadButton() {
    const downloadButton = this.page.locator('.button.anchor.hidden').first();
    await downloadButton.click();
  }

  async announcmentCardVerification({ expect }) {
    const shadowHostCard = await this.page
      .locator(
        'announcements-cards.content.announcements-wrapper',
      )
      .elementHandle();
    const shadowRootCard = await shadowHostCard.evaluateHandle(
      (node) => node.shadowRoot,
    );

    const announcementsCrad = await shadowRootCard.$$('.card-wrapper');
    const firstCard = announcementsCrad[0];
    await firstCard.isVisible();

    const firstCardTitle = await this.page.locator('.announcements-wrapper .card-wrapper:nth-of-type(1) p.card-title').textContent();

    const readMoreBtn = await firstCard.$('.card-btn');
    await readMoreBtn.click();

    await this.page.waitForLoadState();
    const title = await this.page.title();
    expect(title).toBe(firstCardTitle);
  }

  getJoinNowButtonByRegion(text) {
    return this.page.locator(`#feds-nav-wrapper a[href*="/enrollment/"]:has-text("${text}")`);
  }
}

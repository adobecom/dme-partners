import { expect } from '@playwright/test';

export default class SmokeTest {
  constructor(page) {
    this.page = page;
    this.joinNowButton = page.locator('text="Join Now"');
    this.signInButton = page.locator('.feds-signIn');
    this.GNav = page.locator('.feds-topnav');
    this.profileIcon = page.locator('.feds-profile-button');
    this.priceList = page.locator('a.feds-navLink:has-text("Price lists")');
    this.membershipDe = page.locator('a.feds-navLink:has-text("Mitgliedschaft")').nth(0);
    this.membership = page.locator('a.feds-navLink:has-text("Membership")').nth(0);
    this.tableSelector = '.table-container';
    this.searchGnav = page.locator('.feds-search-trigger');
    this.searchGnavField = page.locator('.feds-search-input');
    this.searchFieldPage = page.locator('.search-wrapper #search');
    this.announcemnts = page.locator('text="Announcements"');
    this.emailField = page.locator('#EmailPage-EmailField');
    this.emailPageContinueButton = page.locator('//button[@data-id="EmailPage-ContinueButton"]');
    this.passwordField = page.locator('#PasswordPage-PasswordField');
    this.passwordPageContinueButton = page.locator('//button[@data-id="PasswordPage-ContinueButton"]');
    this.partnershipOpportunitiesSection = page.locator('#partnership-opportunities');
    this.resellerProgram = page.locator('#reseller-program');
    this.retailProgram = page.locator('#retail-program');
    this.regionPicker = page.locator('.feds-regionPicker');
    this.apacRegion = page.locator('.tracking-header a[href*="/apac/channelpartners/"]');
    this.salesGnavButton = page.locator('.feds-navItem:nth-of-type(2) button');
    this.specializationButton = page.locator('div.feds-menu-items a[href*="sales-resources/specializations/"]');
    this.vipMarketplace = page.locator('[tabindex]:has-text("VIP Marketplace")');
    this.government = page.locator('[tabindex]:has-text("Government")');
    this.education = page.locator('[tabindex]').filter({ hasText: /^Education$/ });
    this.educationElite = page.locator('[tabindex]').filter({ hasText: /^Education Elite$/ });
    this.educationEliteKorea = page.locator('[tabindex]').filter({ hasText: /^교육 기관용 Elite$/ });
    this.worldwide = page.locator('[tabindex]:has-text("Worldwide")');
    this.govermentElite = page.locator('[tabindex]:has-text("공공 기관용 Elite")');
    this.adobeSubstance3D = page.locator('[tabindex]:has-text("Adobe Substance 3D")');
    this.resellerDeProgram = page.locator('#leitfäden-zum-apc-programm');
    this.apacResellerProgramGuid = page.locator('#apc-program-guides-1 a[href*="/p/Adobe_Partner_Connection_Reseller_Program_Guide_Asia_Pacific.pdf"]');
    this.apacRetailProgramGuid = page.locator('#apc-program-guides-1 a[href*="/p/Adobe_Partner_Connection_Distributor_Program_Guide_FY25_Asia_Pacific_v9.pdf"]');
    this.cal = page.locator('div.feds-menu-items a[href*="/sales-resources/cal/"]');
    this.geoModal = page.locator('#locale-modal-v2');
    this.cbcLearnMore = page.locator('.media .media-row a[href*="/bin/fusion/modalImsLogin?resource=%2Fen%2Fnews%2Fenablement-news-partner-lock"]');
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

  async announcmentCardVerification() {
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

  getFindPartnerByRegion(text) {
    return this.page.locator(`#feds-nav-wrapper a[href*="/PartnerSearch"]:has-text("${text}")`);
  }

  getGeoModalLink(linkText) {
    return this.page.locator(`.link-wrapper a:has-text("${linkText}")`);
  }

  async verifySelectYouRegion() {
    const syrExist = await this.selectYourRegionPublicSection.isVisible();

    return { selectYourRegionPublicSection: syrExist };
  }

  async verifyNorthAmericaPublicPage() {
    const partnershipOppVisible = await this.partnershipOpportunitiesSection.isVisible();
    const retailProVisible = await this.retailProgram.isVisible();
    const resellerProVisible = await this.resellerProgram.isVisible();

    return {
      partnershipOpportunitiesSection: partnershipOppVisible,
      retailProgram: retailProVisible,
      resellerProgram: resellerProVisible,
    };
  }

  async verifyApacPage() {
    const regionPickerButton = this.regionPicker;
    await regionPickerButton.waitFor({ state: 'visible' });
    await regionPickerButton.click();

    const asiaPacificOption = this.apacRegion;
    await asiaPacificOption.waitFor({ state: 'visible' });
    await asiaPacificOption.click();

    await expect(this.partnershipOpportunitiesSection).toBeVisible();
    await expect(this.resellerProgram).toBeVisible();
    await expect(this.retailProgram).not.toBeVisible();
  }

  async apacSpecializationVerify() {
    const salesBatton = this.salesGnavButton;
    await salesBatton.click();

    const { specializationButton } = this;
    await specializationButton.click();

    const vipMarketplaceTab = this.vipMarketplace;
    await expect(vipMarketplaceTab).toHaveCount(1);
    await expect(vipMarketplaceTab).toBeVisible();
  }

  async latamSpecializationVerify() {
    const salesBatton = this.salesGnavButton;
    await salesBatton.click();

    const { specializationButton } = this;
    await specializationButton.click();

    const governmentTab = this.government;
    await expect(governmentTab).toHaveCount(1);
    await expect(governmentTab).toBeVisible();
  }

  async emeaSpecializationVerify() {
    const { salesGnavButton } = this;
    await salesGnavButton.click();

    const { specializationButton } = this;
    await specializationButton.click();

    const { education } = this;
    const { educationElite } = this;
    const { worldwide } = this;

    await expect(education).toHaveCount(1);
    await expect(education).toBeVisible();

    await expect(educationElite).toHaveCount(1);
    await expect(educationElite).toBeVisible();

    await expect(worldwide).toHaveCount(1);
    await expect(worldwide).toBeVisible();
  }

  async krSpecializationVerify() {
    const { salesGnavButton } = this;
    await salesGnavButton.click();

    const { specializationButton } = this;
    await specializationButton.click();

    const { govermentElite } = this;
    const { educationEliteKorea } = this;
    const { adobeSubstance3D } = this;

    await expect(govermentElite).toHaveCount(1);
    await expect(govermentElite).toBeVisible();

    await expect(educationEliteKorea).toHaveCount(1);
    await expect(educationEliteKorea).toBeVisible();

    await expect(adobeSubstance3D).toHaveCount(1);
    await expect(adobeSubstance3D).toBeVisible();
  }

  async checkUplevelProgram() {
    const { resellerDeProgram } = this;
    await resellerDeProgram.isVisible();
  }

  async membershipPageInfoVerification() {
    const { membershipDe } = this;
    await membershipDe.click();

    const goldLevel = this.page.locator('#gold');
    await goldLevel.isVisible();

    const upgradeSection = this.page.locator('#upgrade-der-mitgliedschaftsstufe');
    await upgradeSection.isVisible();
  }

  async apcProgramGuidsVerify() {
    const { apacResellerProgramGuid } = this;
    await apacResellerProgramGuid.isVisible();
    const { apacRetailProgramGuid } = this;
    await apacRetailProgramGuid.isVisible();
  }

  async requestCalverify() {
    const { salesGnavButton } = this;
    await salesGnavButton.click();
    const { cal } = this;
    await cal.click();
  }

  async indiaCalVerify() {
    const calIndiaRequest = this.page.locator('#request-a-cal-httpsmain--dme-partners--adobecomhlxpageedsdmepartners-sharedfragmentscommondistributor-cal-links-1').getByRole('link', { name: 'INDIA' });
    await calIndiaRequest.isVisible();
    let calIndiaRequestlink = await calIndiaRequest.getAttribute('href');
    if (calIndiaRequestlink?.includes('#_blank')) {
      calIndiaRequestlink = calIndiaRequestlink.replace('#_blank', '');
    }
    const calIndiaSubmit = this.page.getByRole('link', { name: 'INDIA' }).nth(1);
    await calIndiaSubmit.isVisible();
    const calIndiaSubmitLink = await calIndiaSubmit.getAttribute('href');

    expect(calIndiaRequestlink).toBe(calIndiaSubmitLink);
  }

  async seabdCalVerify() {
    const calSeabdRequest = this.page.locator('h3#request-a-cal-httpsmain--dme-partners--adobecomhlxpageedsdmepartners-sharedfragmentscommondistributor-cal-links-1.heading-m strong p.body-m.action-area a.con-button.blue.button-m ').nth(1);
    await calSeabdRequest.isVisible();
    const calSeabdRequestlink = await calSeabdRequest.getAttribute('href');
    const calSeabdSubmit = this.page.locator('#submit-a-channel-authorization-letter + p a:has-text("SEA/BD")');
    await calSeabdSubmit.isVisible();
    const calSeabdSubmitLink = await calSeabdSubmit.getAttribute('href');

    expect(calSeabdSubmitLink).toBe(calSeabdRequestlink);
  }

  async hktCalVerify() {
    const calHktRequest = this.page.locator('h3#request-a-cal-httpsmain--dme-partners--adobecomhlxpageedsdmepartners-sharedfragmentscommondistributor-cal-links-1.heading-m strong p.body-m.action-area a.con-button.blue.button-m ').nth(2);
    await calHktRequest.isVisible();
    const calHktRequestlink = await calHktRequest.getAttribute('href');
    const calHktSubmit = this.page.locator('#submit-a-channel-authorization-letter + p a:has-text("HKT")');
    await calHktSubmit.isVisible();
    const calHktSubmitLink = await calHktSubmit.getAttribute('href');

    expect(calHktSubmitLink).toBe(calHktRequestlink);
  }

  async chinaCalVerify() {
    const calChinaRequest = this.page.locator('h3#request-a-cal-httpsmain--dme-partners--adobecomhlxpageedsdmepartners-sharedfragmentscommondistributor-cal-links-1.heading-m strong p.body-m.action-area a.con-button.blue.button-m ').nth(3);
    await calChinaRequest.isVisible();
    const calChinaRequestlink = await calChinaRequest.getAttribute('href');
    const calChinaSubmit = this.page.locator('#submit-a-channel-authorization-letter + p a:has-text("China")');
    await calChinaSubmit.isVisible();
    const calChinaSubmitLink = await calChinaSubmit.getAttribute('href');

    expect(calChinaSubmitLink).toBe(calChinaRequestlink);
  }

  async anzCalVerify() {
    const calAnzRequest = this.page.locator('h3#request-a-cal-httpsmain--dme-partners--adobecomhlxpageedsdmepartners-sharedfragmentscommondistributor-cal-links-1.heading-m strong p.body-m.action-area a.con-button.blue.button-m ').nth(4);
    await calAnzRequest.isVisible();
    const calAnzRequestlink = await calAnzRequest.getAttribute('href');
    const calAnzSubmit = this.page.locator('#submit-a-channel-authorization-letter + p a:has-text("ANZ")');
    await calAnzSubmit.isVisible();
    const calAnzSubmitLink = await calAnzSubmit.getAttribute('href');

    expect(calAnzSubmitLink).toBe(calAnzRequestlink);
  }

  async koreaCalVerify() {
    const calKoreaRequest = this.page.locator('h3#request-a-cal-httpsmain--dme-partners--adobecomhlxpageedsdmepartners-sharedfragmentscommondistributor-cal-links-1.heading-m strong p.body-m.action-area a.con-button.blue.button-m ').nth(5);
    await calKoreaRequest.isVisible();
    const calKoreaRequestlink = await calKoreaRequest.getAttribute('href');
    const calKoreaSubmit = this.page.locator('#submit-a-channel-authorization-letter + p a:has-text("Korea")');
    await calKoreaSubmit.isVisible();
    const calKoreaSubmitLink = await calKoreaSubmit.getAttribute('href');

    expect(calKoreaSubmitLink).toBe(calKoreaRequestlink);
  }

  async submitEmailVerify() {
    const submitEmail = this.page.locator('a[href*="mailto:apacpm@adobe.com"]').nth(0);
    await expect(submitEmail).toHaveAttribute('href', 'mailto:apacpm@adobe.com');
  }

  async apacMembershipVerify() {
    const { membership } = this;
    await membership.click();

    const membershiplevel = this.page.locator('#distributor');
    await membershiplevel.isVisible();
  }
}

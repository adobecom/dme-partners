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
    this.apacRegion = page.locator('[daa-ll="Asia Pacific English-9--Asia Pacific English"]');
    this.salesGnavButton = page.locator('.feds-navItem:nth-of-type(2) button');
    this.specializationButton = page.locator('.feds-menu-items ul li:nth-of-type(2) a');
    this.vipMarketplace = page.locator('[tabindex]:has-text("VIP Marketplace")');
    this.government = page.locator('[tabindex]:has-text("Government")');
    this.education = page.locator('[tabindex]').filter({ hasText: /^Education$/ });
    this.educationElite = page.locator('[tabindex]').filter({ hasText: /^Education Elite$/ });
    this.educationEliteKorea = page.locator('[tabindex]').filter({ hasText: /^교육 기관용 Elite$/ });
    this.worldwide = page.locator('[tabindex]:has-text("Worldwide")');
    this.govermentElite = page.locator('[tabindex]:has-text("공공 기관용 Elite")');
    this.adobeSubstance3D = page.locator('[tabindex]:has-text("Adobe Substance 3D")');
    this.resellerDeProgram = page.locator('#leitfäden-zum-apc-programm');
    this.resellerProgramLink = page.locator('h2.body-m').nth(0);
    this.retailProgramLink = page.locator('h2.body-m').nth(1);
    this.apacResellerProgramGuid = page.locator('[daa-ll="Reseller Program Gui-1--APC Program Guides"]');
    this.apacRetailProgramGuid = page.locator('[daa-ll="Distributor Guide-2--APC Program Guides"]');
    this.cal = page.locator('.feds-menu-items ul li:nth-of-type(4) a');
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
    const salesBatton = this.salesGnavButton;
    await salesBatton.click();

    const { specializationButton } = this;
    await specializationButton.click();

    const educationTab = this.education;
    const educationEliteTab = this.educationElite;
    const worldwideTab = this.worldwide;

    await expect(educationTab).toHaveCount(1);
    await expect(educationTab).toBeVisible();

    await expect(educationEliteTab).toHaveCount(1);
    await expect(educationEliteTab).toBeVisible();

    await expect(worldwideTab).toHaveCount(1);
    await expect(worldwideTab).toBeVisible();
  }

  async krSpecializationVerify() {
    const salesBatton = this.salesGnavButton;
    await salesBatton.click();

    const { specializationButton } = this;
    await specializationButton.click();

    const govermentEliteTab = this.govermentElite;
    const educationEliteTab = this.educationEliteKorea;
    const adobeSubstanceTab = this.adobeSubstance3D;

    await expect(govermentEliteTab).toHaveCount(1);
    await expect(govermentEliteTab).toBeVisible();

    await expect(educationEliteTab).toHaveCount(1);
    await expect(educationEliteTab).toBeVisible();

    await expect(adobeSubstanceTab).toHaveCount(1);
    await expect(adobeSubstanceTab).toBeVisible();
  }

  async checkUplevelProgram() {
    const resellerDeProgramn = this.resellerDeProgram;
    await resellerDeProgramn.isVisible();
  }

  async membershipPageInfoVerification() {
    const membershipDePage = this.membershipDe;
    await membershipDePage.click();

    const goldLevel = this.page.locator('#gold');
    await goldLevel.isVisible();

    const upgradeSection = this.page.locator('#upgrade-der-mitgliedschaftsstufe');
    await upgradeSection.isVisible();
  }

  async apcProgramGuidsVerify() {
    const apacReseller = this.apacResellerProgramGuid;
    await apacReseller.isVisible();
    const apacRetail = this.apacRetailProgramGuid;
    await apacRetail.isVisible();
  }

  async requestCalverify() {
    const salesButton = this.salesGnavButton;
    await salesButton.click();
    const calButton = this.cal;
    await calButton.click();
  }

  async indidaCalVerify() {
    const calIndiaRequest = this.page.locator('[daa-ll="INDIA-1--Request a CAL INDIAS"]');
    await calIndiaRequest.isVisible();
    const calIndidaRequestlink = await calIndiaRequest.getAttribute('href');
    const calIndiaSubmit = this.page.locator('[daa-ll="INDIA-1--Submit a Channel Aut"]');
    await calIndiaSubmit.isVisible();
    const calIndiaSubmitLink = await calIndiaSubmit.getAttribute('href');

    expect(calIndidaRequestlink).toBe(calIndiaSubmitLink);
  }

  async seabdCalVerify() {
    const calSeabdRequest = this.page.locator('[daa-ll="SEA BD-2--Request a CAL INDIAS"]');
    await calSeabdRequest.isVisible();
    const calSeabdRequestlink = await calSeabdRequest.getAttribute('href');
    const calSeabdSubmit = this.page.locator('[daa-ll="SEA BD-2--Submit a Channel Aut"]');
    await calSeabdSubmit.isVisible();
    const calSeabdSubmitLink = await calSeabdSubmit.getAttribute('href');

    expect(calSeabdSubmitLink).toBe(calSeabdRequestlink);
  }

  async hktCalVerify() {
    const calHktRequest = this.page.locator('[daa-ll="HKT-3--Request a CAL INDIAS"]');
    await calHktRequest.isVisible();
    const calHktRequestlink = await calHktRequest.getAttribute('href');
    const calHktSubmit = this.page.locator('[daa-ll="HKT-3--Submit a Channel Aut"]');
    await calHktSubmit.isVisible();
    const calHktSubmitLink = await calHktSubmit.getAttribute('href');

    expect(calHktSubmitLink).toBe(calHktRequestlink);
  }

  async chinaCalVerify() {
    const calChinaRequest = this.page.locator('[daa-ll="China-4--Request a CAL INDIAS"]');
    await calChinaRequest.isVisible();
    const calChinaRequestlink = await calChinaRequest.getAttribute('href');
    const calChinaSubmit = this.page.locator('[daa-ll="China-4--Submit a Channel Aut"]');
    await calChinaSubmit.isVisible();
    const calChinaSubmitLink = await calChinaSubmit.getAttribute('href');

    expect(calChinaSubmitLink).toBe(calChinaRequestlink);
  }

  async anzCalVerify() {
    const calAnzRequest = this.page.locator('[daa-ll="ANZ-5--Request a CAL INDIAS"]');
    await calAnzRequest.isVisible();
    const calAnzRequestlink = await calAnzRequest.getAttribute('href');
    const calAnzSubmit = this.page.locator('[daa-ll="ANZ-5--Submit a Channel Aut"]');
    await calAnzSubmit.isVisible();
    const calAnzSubmitLink = await calAnzSubmit.getAttribute('href');

    expect(calAnzSubmitLink).toBe(calAnzRequestlink);
  }

  async koreaCalVerify() {
    const calKoreaRequest = this.page.locator('[daa-ll="Korea-6--Request a CAL INDIAS"]');
    await calKoreaRequest.isVisible();
    const calKoreaRequestlink = await calKoreaRequest.getAttribute('href');
    const calKoreaSubmit = this.page.locator('[daa-ll="Korea-6--Submit a Channel Aut"]');
    await calKoreaSubmit.isVisible();
    const calKoreaSubmitLink = await calKoreaSubmit.getAttribute('href');

    expect(calKoreaSubmitLink).toBe(calKoreaRequestlink);
  }

  async submitEmailVerify() {
    const submitEmail = this.page.locator('[daa-ll="apacpm adobe com-7--Submit a Channel Aut"]');
    await expect(submitEmail).toHaveAttribute('href', 'mailto:apacpm@adobe.com');
  }

  async apacMembershipVerify() {
    const { membership } = this;
    await membership.click();

    const membershiplevel = this.page.locator('#distributor');
    await membershiplevel.isVisible();
  }
}

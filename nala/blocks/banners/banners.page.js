export default class BannersPage {
  constructor(page) {
    this.page = page;
    this.renewBanner = page.locator('div.notification.ribbon');
    this.bannerLink = page.locator('.notification p.body-m.action-area > a.con-button.outline');
    this.profileIconButton = page.locator('.feds-profile-button');
  }

  getBannerParagraphByIndex() {
    return this.page.locator('.text .copy-wrap > p.body-m');
  }
}

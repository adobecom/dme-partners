export default class BannersPage {
  constructor(page) {
    this.page = page;
    this.renewBanner = page.locator('div.renew-banner');
    this.bannerLink = page.locator('.renew-banner p.body-m.action-area > a.con-button.outline');
    this.profileIconButton = page.locator('.feds-profile-button');
  }

  getBannerParagraphByIndex(paragraphIndex) {
    return this.page.locator(`.text > .body-m:nth-child(${paragraphIndex})`);
  }
}

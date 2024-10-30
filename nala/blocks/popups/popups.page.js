export default class PopupsPage {
  constructor(page) {
    this.page = page;
  }

  getGeoPopUpElement(popUpText) {
    return this.page.locator(`div.georouting-wrapper:has-text("${popUpText}")`);
  }

  getGeoLocaleButton(type) {
    return this.page.locator(`a[daa-ll="${type}"]`);
  }

  async clickLocaleButton(type) {
    await this.page.locator(`a[daa-ll="${type}"]`).click();
  }
}

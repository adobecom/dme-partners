export default class AccessingAssetsPage {
  constructor(page) {
    this.page = page;
    this.notFound404 = page.locator('#not-found');
  }
}

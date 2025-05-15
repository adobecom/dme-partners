export default class AccessingAssetsPage {
  constructor(page) {
    this.page = page;
    this.notFound404 = page.locator('#not-fond');
  }

  async notFoundContentCheck() {
    const { notFound404 } = this;
    await notFound404.isVisible();
  }
}

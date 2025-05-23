export default class RedirectsPage {
  constructor(page) {
    this.page = page;
    this.adobeGnavLink = page.locator(' a[href*="https://www.adobe.com/"]').first();
  }

  async getButtonElement(text) {
    return this.page.getByRole('button', { name: `${text}` });
  }

  getLinkByText(text) {
    return this.page.locator(`a:has-text("${text}")`);
  }
}

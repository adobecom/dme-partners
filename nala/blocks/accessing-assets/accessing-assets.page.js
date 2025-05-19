import { expect } from '@playwright/test';

export default class AccessingAssetsPage {
  constructor(page) {
    this.page = page;
    this.notFound404 = page.locator('#not-found');
  }

  async notFoundContentCheck() {
    await expect(this.notFound404).toBeVisible();
  }
}

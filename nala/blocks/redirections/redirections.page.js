import { expect } from '@playwright/test';

export default class RedirectionsTest {
  constructor(page) {
    this.page = page;
    this.localeModal = page.locator('#locale-modal-v2');
    this.localeModalCloseButton = page.locator('#locale-modal-v2 .dialog-close');
  }

  getFindPartnerByRegion(text) {
    return this.page.locator(`#feds-nav-wrapper a[href*="/PartnerSearch"]:has-text("${text}")`);
  }

  async verifyURLRedirection(findPartnerLink, localePartnerURL, localeSwitchURL) {
    await this.page.goto(localeSwitchURL);
    await expect(findPartnerLink).toBeVisible();

    if (await this.localeModal.isVisible()) {
      await this.localeModalCloseButton.click();
    }

    await findPartnerLink.click();

    const [newTab] = await Promise.all([
      this.page.waitForEvent('popup'),
    ]);

    await newTab.waitForLoadState();
    expect(newTab.url()).toBe(`${localePartnerURL}`);
    newTab.close();
  }
}

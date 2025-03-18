import { expect } from '@playwright/test';

export default class RedirectionsTest {
  constructor(page) {
    this.page = page;
  }

  getFindPartnerByRegion(text) {
    return this.page.locator(`#feds-nav-wrapper a[href*="/PartnerSearch"]:has-text("${text}")`);
  }

  async verifyURLRedirection(findPartnerLink, localePartnerURL, localeSwitchURL) {
    await this.page.goto(localeSwitchURL);
    await expect(findPartnerLink).toBeVisible();
    await findPartnerLink.click();

    const [newTab] = await Promise.all([
      this.page.waitForEvent('popup'),
    ]);

    await newTab.waitForLoadState();
    expect(newTab.url()).toBe(`${localePartnerURL}`);
    newTab.close();
  }
}

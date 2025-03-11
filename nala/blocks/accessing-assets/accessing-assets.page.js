import { expect } from '@playwright/test';

export default class AccessingAssetsPage {
  constructor(page) {
    this.page = page;
    this.searchGnav = page.locator('.feds-search-trigger');
    this.searchGnavField = page.locator('.feds-search-input');
    this.cardTitle = page.locator('.card-title');
    this.searchFieldPage = page.locator('input.input[type="search"]');
    this.searchFieldPageDistributor = page.getByRole('searchbox', { name: 'Search' });
    this.resetButton = page.locator('#button[aria-label="Reset"]');
    this.downloadButton = page.locator('sp-action-button[aria-label="Download"]').nth(0);
    this.downloadButtonLocale = page.locator('search-card').filter({ hasText: 'China Reseller Channel' }).locator('#button').first();
  }

  async openAssetInNewTab(locatorText) {
    return this.page.locator('search-card').filter({ hasText: locatorText }).locator('#button').nth(1);
  }

  async searchAsset(locatorText, expectedAsset) {
    await this.openAssetInNewTab(locatorText).waitFor({ state: 'visible' });
    const cardTitles = await this.cardTitle.allTextContents();
    expect(cardTitles.some((title) => title.includes(expectedAsset))).toBeTruthy();
  }

  async unwantedAssetCheck(unwantedAsset) {
    const cardTitles = await this.cardTitle.allTextContents();
    const isTextPresent = cardTitles.some((title) => title.toLowerCase().includes(unwantedAsset.toLowerCase()));
    expect(isTextPresent).toBe(false);
  }

  async checkOpenAsset(locatorText, assetURL) {
    await this.page.waitForLoadState('domcontentloaded');
    const hrefLink = await this.openAssetInNewTab(locatorText).getAttribute('href');
    expect(hrefLink).toContain(assetURL);
  }
}

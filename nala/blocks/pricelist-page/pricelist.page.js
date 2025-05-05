import { expect } from '@playwright/test';

export default class SearchTest {
  constructor(page) {
    this.page = page;
    this.currencyFilter = page.getByLabel('Currency');
    this.monthFilter = page.getByLabel('Month');
    this.buyingProgramTypesFilter = page.getByLabel('Buying program types');
    this.clearAllFilters = page.locator('.sidebar-clear-btn');
    this.regionFilter = page.locator('[aria-label="Region"].filter-header');
    this.profile = page.locator('.feds-profile');
    this.signOut = page.locator('.feds-profile-action');
    this.firstRegionCell = page.locator('td[headers="region"]').first();
    this.includeEndPricelists = page.getByRole('switch', { name: 'Include end user price lists' });
    this.searchField = page.getByRole('searchbox', { name: 'Search' });
    this.xButton = page.getByLabel('Reset');
    this.cells = page.locator('td[headers="type"]');
  }

  async checkBox(checkBox, exact) {
    return this.page.getByRole('checkbox', { name: `${checkBox}`, exact });
  }

  async filterPricelists(filter, checkBoxName, exactMatch = false) {
    await filter.click();
    const checkBox = await this.checkBox(checkBoxName, exactMatch);
    await checkBox.click();
    await filter.click();
  }

  async searchPriceList(searchKeyWord) {
    const { searchField } = this;
    await searchField.fill(searchKeyWord);
    await searchField.press('Enter');
  }

  async priceListsCount() {
    const { cells } = this;
    return cells.count();
  }

  async pricelistRegionCheck(text) {
    const { firstRegionCell } = this;
    expect(firstRegionCell).toHaveText(text);
  }

  async includeEndUserPricelists() {
    const { includeEndPricelists } = this;
    await includeEndPricelists.click();
  }

  async checkTable() {
    const { firstRegionCell } = this;
    await expect(firstRegionCell).not.toBeVisible();
  }
}

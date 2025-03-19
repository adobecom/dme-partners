import { expect } from '@playwright/test';

export default class SearchTest {
    constructor(page) {
        this.page = page;
        this.searchField = page.getByRole('searchbox', { name: 'Search' });
        this.openPreview = page.getByLabel('Open in', { exact: true }).locator('#button');
        this.cardDescription = page.locator('.card-description', { hasText: 'Asset Type: Advertising, Channel Copy, Language: English International (EI), Spanish, Product: Adobe Acrobat, Adobe Connect, Topic: Channel Authorization Letter, Onboarding' });
        this.filterType = page.getByLabel('Type');
        this.checkBoxLicensing = page.getByRole('checkbox', { name: 'Licensing', exact: true });
        this.filterLanguage = page.getByLabel('Asset language');
        this.checkBoxArabic = page.getByRole('checkbox', { name: 'Arabic' });
        this.checkBoxSpanish = page.getByRole('checkbox', { name: 'Spanish' });
        this.filterProduct = page.getByLabel('Product');
        this.checkBoxAdobeSign = page.getByRole('checkbox', { name: 'Adobe Sign' });
        this.checkBoxAdobeDreamweaver = page.getByRole('checkbox', { name: 'Adobe Dreamweaver' });
        this.filterTopic = page.getByLabel('Topic');
        this.checkBoxDealRegistration = page.getByRole('checkbox', { name: 'Deal Registration' });
        this.checkBoxProgramGuid = page.getByRole('checkbox', { name: 'Programme Guide' })
        this.clearAllFilters = page.getByLabel('Clear all');
        this.tabAll = page.getByLabel('All', { exact: true });
        this.nextPage = page.getByLabel('Next Page');
        this.prevPage = page.getByLabel('Previous Page');
        this.page3 = page.getByLabel('Page 3');
        this.searchSpotlight = page.getByLabel('Search', { exact: true });
        this.searchSpotlightFiled = page.getByPlaceholder('Search for topics, resources');
        this.assetTabs = page.getByLabel('Assets');
        this.pagesTab = page.getByLabel('Pages');
    }
    async cardTitle(text) {
        return this.page.getByText(text);
    }

    async fileIcon(fileType) {
        return this.page.locator(`div.file-icon[style*="icons/${fileType}.svg"]`);
    }
    
    async checkFileIcon(icon) {
        const fileIcon = await this.fileIcon(icon);
        fileIcon.isVisible();
    }
    async getSignInButton(text) {
        return this.page.getByRole('button', { name: `${text}` });
    }

    async searchAsset(searchKeyWord) {
        const { searchField } = this;
        await this.page.locator('.search-card').first().waitFor({ state: 'visible' });
        await searchField.fill(searchKeyWord);
        await searchField.press('Enter');
    }

    async checkCardTitle(asset) {
        const card = await this.cardTitle(asset)
        await card.isVisible();
    }

    async hasCardTag(asset, tagText) {
        const card = await this.cardTitle(asset);
        return await card.locator('.card-tags-wrapper .card-tag', { hasText: tagText }).isVisible();
    }

    async openPreviewFile(assetURL, httpStatusCode) {
        const { openPreview } = this;
        const promise = new Promise((resolve) => {
            page.on('response', (response) => {
              if (response.url().includes(assetURL) && response.status() === httpStatusCode) {
                resolve(true);
              }
            });
          });

        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            openPreview.click(),
        ]);

        const resourceSuccessfullyLoaded = await promise;
        await expect(resourceSuccessfullyLoaded).toBe(true);
    }

    async checkCardDescription(asset, descriptionText) {
        const card = await this.cardTitle(asset); 
        const descriptionLocator = card.locator('.card-description', { hasText: descriptionText });
        return await descriptionLocator.isVisible();
    }

    async filterSearchAssets(filter, checkBox) {
        await filter.click();
        await checkBox.click();
        await filter.click();
    }

    async clearAll() {
        const { clearAllFilters } = this;
        await clearAllFilters.click();
    }

    async checkNumberOfAssets() {
        const { tabAll } = this;
        const buttonText = await tabAll.innerText();
        const numberMatch = buttonText.match(/\d+/);
        const number = parseInt(numberMatch[0], 10);

        return number;
    }

    async nextPageCLick() {
        const { nextPage } = this;
        await nextPage.click();
    }

    async prevPageClick() {
        const { prevPage } = this;
        await prevPage.click();
    }

    async page3Click() {
        const { page3 } = this;
        await page3.click();
    }

    async searchForAsset(text) {
        const { searchSpotlight } = this;
        const { searchSpotlightFiled } = this;

        await searchSpotlight.click();
        await searchSpotlightFiled.fill(text);
        await searchSpotlightFiled.press('Enter');
    }
}
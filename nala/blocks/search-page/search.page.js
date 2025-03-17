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
        this.filterProduct = page.getByLabel('Product');
        this.checkBoxAdobeSign = page.getByRole('checkbox', { name: 'Adobe Sign' });
        this.filterTopic = page.getByLabel('Topic');
        this.checkBoxDealRegistration = page.getByRole('checkbox', { name: 'Deal Registration' });
        this.clearAllFilters = page.getByLabel('Clear all');
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
            this.page.on('response', (response) => {
              if (response.url().includes(`${assetURL}`) && response.status() === httpStatusCode) {
                resolve(true);
              }
            });
          });

        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            openPreview.click(), 
        ]);

        const resourceSuccessfullyLoaded = await promise;

        expect(resourceSuccessfullyLoaded).toBe(true);
    
        await newPage.close();
    }

    async checkCardDescription(asset, descriptionText) {
        const card = await this.cardTitle(asset); 
        const descriptionLocator = card.locator('.card-description', { hasText: descriptionText });
        return await descriptionLocator.isVisible();
    }

    async filterSearchAssets(filter, checkBox) {
        await filter.click();
        await checkBox.click();
    }
}
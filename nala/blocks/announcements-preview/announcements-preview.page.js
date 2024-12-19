export default class AnnouncementsPreviewPage {
  constructor(page) {
    this.page = page;
    this.profileIconButton = page.locator('.feds-profile-button');
    this.announcementsPreview = page.locator('.announcements-preview').nth(0);
    this.announcements = page.locator('.announcements-preview .link-wrapper');
    this.viewAllAnnouncementsButton = page.locator('.announcements-preview .con-button');
    this.loadMore = page.locator('[aria-label="Load more"]');

    this.cards = page.locator('single-partner-card');
    this.selectedSortText = page.locator('.sort-btn-text');
    this.sortBtn = page.locator('.sort-btn');
    this.newestOption = page.getByRole('button', { name: 'newest' });
  }

  async getButtonElement(text) {
    return this.page.getByRole('button', { name: `${text}` });
  }
}

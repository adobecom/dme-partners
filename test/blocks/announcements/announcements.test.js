import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../edsdme/blocks/announcements/announcements.js';
import PartnerCards from '../../../edsdme/components/PartnerCards.js';

const cardsString = await readFile({ path: './mocks/cards.json' });
const cards = JSON.parse(cardsString);

describe('announcements block', () => {
  beforeEach(async () => {
    sinon.stub(PartnerCards.prototype, 'fetchData').resolves({ cards });

    sinon.stub(PartnerCards.prototype, 'firstUpdated').callsFake(async function () {
      this.allCards = cards;
      this.cards = cards;
      this.paginatedCards = this.cards.slice(0, 1);
      this.hasResponseData = true;
      this.fetchedData = true;
    });

    await import('../../../edsdme/scripts/scripts.js');
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  afterEach(() => {
    PartnerCards.prototype.fetchData.restore();
    PartnerCards.prototype.firstUpdated.restore();
  });

  const setupAndCommonTest = async (windowWidth) => {
    Object.defineProperty(window, 'innerWidth', { value: windowWidth });

    const block = document.querySelector('.announcements');
    expect(block).to.exist;

    const component = await init(block);
    expect(component).to.exist;

    const announcementsWrapper = document.querySelector('.announcements-wrapper');
    expect(announcementsWrapper.shadowRoot).to.exist;
    const partnerCardsCollection = announcementsWrapper.shadowRoot.querySelector('.partner-cards-collection');
    expect(partnerCardsCollection).to.exist;
    expect(partnerCardsCollection.innerHTML).to.include('single-partner-card');
    const firstCard = partnerCardsCollection.querySelector('.card-wrapper');
    expect(firstCard.shadowRoot).to.exist;
    const searchBarWrapper = announcementsWrapper.shadowRoot.querySelector('.partner-cards-sidebar .search-wrapper');
    expect(searchBarWrapper.shadowRoot).to.exist;
    const spectrumSearch = searchBarWrapper.querySelector('#search');
    expect(spectrumSearch.shadowRoot).to.exist;
    const paginationWrapper = announcementsWrapper.shadowRoot.querySelector('.partner-cards-content .pagination-wrapper');
    expect(paginationWrapper).to.exist;
    const loadMoreBtn = announcementsWrapper.shadowRoot.querySelector('.partner-cards-content .pagination-wrapper .load-more-btn');
    expect(loadMoreBtn).to.exist;
    const sortWrapper = announcementsWrapper.shadowRoot.querySelector('.partner-cards-content .sort-wrapper');
    expect(sortWrapper).to.exist;
    const firstSortItem = sortWrapper.querySelector('.sort-list .sort-item');
    expect(firstSortItem).to.exist;

    return { announcementsWrapper };
  };

  it('should have shadow root and render partner cards for mobile', async () => {
    const { announcementsWrapper } = await setupAndCommonTest(500);

    const filtersBtn = announcementsWrapper.shadowRoot.querySelector('.filters-btn-mobile');
    expect(filtersBtn).to.exist;
    const filtersWrapper = announcementsWrapper.shadowRoot.querySelector('.all-filters-wrapper-mobile');
    expect(filtersWrapper).to.exist;
    const firstFilter = filtersWrapper.querySelector('.filter-wrapper-mobile');
    expect(firstFilter).to.exist;
  });
  it('should have shadow root and render partner cards for desktop', async () => {
    const { announcementsWrapper } = await setupAndCommonTest(1500);

    const sidebarFiltersWrapper = announcementsWrapper.shadowRoot.querySelector('.sidebar-filters-wrapper');
    expect(sidebarFiltersWrapper).to.exist;
    const firstFilter = sidebarFiltersWrapper.querySelector('.filter');
    expect(firstFilter).to.exist;
  });
});

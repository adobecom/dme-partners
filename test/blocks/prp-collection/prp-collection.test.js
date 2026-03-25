import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../edsdme/blocks/prp-collection/prp-collection.js';
import PartnerCards from '../../../edsdme/components/PartnerCards.js';

const cardsString = await readFile({ path: './mocks/cards.json' });
const cards = JSON.parse(cardsString);

describe('PRP Collection block', () => {
  beforeEach(async () => {
    sinon.stub(PartnerCards.prototype, 'fetchData').resolves({ cards });

    // eslint-disable-next-line no-underscore-dangle
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

    const block = document.querySelector('.prp-collection');
    expect(block).to.exist;

    const component = await init(block);
    expect(component).to.exist;

    const prpCollectionWrapper = document.querySelector('.prp-collection-wrapper');
    expect(prpCollectionWrapper).to.exist;
    const partnerCardsCollection = prpCollectionWrapper.querySelector('.partner-cards-collection');
    expect(partnerCardsCollection).to.exist;
    expect(partnerCardsCollection.innerHTML).to.include('single-prp-collection-card');
    const firstCard = partnerCardsCollection.querySelector('.card-wrapper');
    expect(firstCard).to.exist;
    const searchBarWrapper = prpCollectionWrapper.querySelector('.partner-cards-sidebar .search-wrapper');
    expect(searchBarWrapper).to.exist;
    const spectrumSearch = searchBarWrapper.querySelector('#search');
    expect(spectrumSearch).to.exist;
    const paginationWrapper = prpCollectionWrapper.querySelector('.partner-cards-content .pagination-wrapper');
    expect(paginationWrapper).to.exist;
    const loadMoreBtn = prpCollectionWrapper.querySelector('.partner-cards-content .pagination-wrapper .load-more-btn');
    expect(loadMoreBtn).to.exist;
    const sortWrapper = prpCollectionWrapper.querySelector('.partner-cards-content .sort-wrapper');
    expect(sortWrapper).to.exist;
    const firstSortItem = sortWrapper.querySelector('.sort-list .sort-item');
    expect(firstSortItem).to.exist;

    return { prpCollectionWrapper };
  };

  it('should render partner cards for mobile', async () => {
    const { prpCollectionWrapper } = await setupAndCommonTest(500);

    const filtersBtn = prpCollectionWrapper.querySelector('.filters-btn-mobile');
    expect(filtersBtn).to.exist;
    const filtersWrapper = prpCollectionWrapper.querySelector('.all-filters-wrapper-mobile');
    expect(filtersWrapper).to.exist;
    const firstFilter = filtersWrapper.querySelector('.filter-wrapper-mobile');
    expect(firstFilter).to.exist;
  });

  it('should render partner cards for desktop', async () => {
    const { prpCollectionWrapper } = await setupAndCommonTest(1500);

    const sidebarFiltersWrapper = prpCollectionWrapper.querySelector('.sidebar-filters-wrapper');
    expect(sidebarFiltersWrapper).to.exist;
    const firstFilter = sidebarFiltersWrapper.querySelector('.filter');
    expect(firstFilter).to.exist;
  });
});

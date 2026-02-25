import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../edsdme/blocks/marketing-resources/marketing-resources.js';
import PartnerCards from '../../../edsdme/components/PartnerCards.js';

const cardsString = await readFile({ path: './mocks/cards.json' });
const cardsData = JSON.parse(cardsString);
const cards = Array.isArray(cardsData) ? cardsData : (cardsData.cards || []);

describe('Marketing Resources block', () => {
  beforeEach(async () => {
    sinon.stub(PartnerCards.prototype, 'fetchData').resolves({ cards });
    // eslint-disable-next-line no-underscore-dangle
    sinon.stub(PartnerCards.prototype, 'firstUpdated').callsFake(async function () {
      this.allCards = cards;
      this.cards = cards;
      this.paginatedCards = this.cards.slice(0, 1);
      this.hasResponseData = true;
      this.fetchedData = true;
      if (this.getAllCardFilters) this.getAllCardFilters();
    });

    await import('../../../edsdme/scripts/scripts.js');
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  afterEach(() => {
    PartnerCards.prototype.fetchData.restore();
    PartnerCards.prototype.firstUpdated.restore();
  });

  async function setupAndRunInit(windowWidth = 1500) {
    Object.defineProperty(window, 'innerWidth', { value: windowWidth });
    const block = document.querySelector('.marketing-resources');
    expect(block).to.exist;
    const app = await init(block);
    expect(app).to.exist;
    expect(app.tagName.toLowerCase()).to.equal('marketing-resources-cards');
    expect(app.getAttribute('daa-lh')).to.equal('Marketing Resources Cards');
    return app;
  }

  it('replaces block with marketing-resources-cards and renders cards, search, and pagination', async () => {
    const app = await setupAndRunInit();
    expect(app.shadowRoot).to.exist;
    const collection = app.shadowRoot.querySelector('.partner-cards-collection');
    expect(collection).to.exist;
    expect(collection.innerHTML).to.include('single-marketing-resources-card');
    expect(app.shadowRoot.querySelector('.card-wrapper')).to.exist;
    expect(app.shadowRoot.querySelector('.search-wrapper sp-search')).to.exist;
    expect(app.shadowRoot.querySelector('.pagination-wrapper')).to.exist;
    expect(app.shadowRoot.querySelector('.load-more-btn')).to.exist;
  });

  it('renders mobile filters when viewport is narrow', async () => {
    const app = await setupAndRunInit(500);
    expect(app.shadowRoot.querySelector('.filters-btn-mobile')).to.exist;
    expect(app.shadowRoot.querySelector('.all-filters-wrapper-mobile')).to.exist;
  });

  it('renders desktop sidebar filters when viewport is wide', async () => {
    const app = await setupAndRunInit(1500);
    expect(app.shadowRoot.querySelector('.sidebar-filters-wrapper')).to.exist;
  });
});

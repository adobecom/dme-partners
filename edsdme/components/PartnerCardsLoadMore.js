import { getLibs } from '../scripts/utils.js';
import { partnerCardsLoadMoreStyles } from './PartnerCardsStyles.js';

const miloLibs = getLibs();
const { html } = await import(`${miloLibs}/deps/lit-all.min.js`);

// eslint-disable-next-line import/prefer-default-export
export const PartnerCardsLoadMore = (superClass) => class extends superClass {
  static styles = [
    superClass.styles,
    partnerCardsLoadMoreStyles,
  ];

  get pagination() {
    if (this.cards.length === this.paginatedCards.length) {
      return '';
    }
    return html`<button class="load-more-btn" @click="${this.handleLoadMore}" aria-label="${this.blockData.localizedText['{{load-more}}']}">${this.blockData.localizedText['{{load-more}}']}</button>`;
  }

  handleActions() {
    super.handleActions();
    this.updatePaginatedCards();
  }

  updatePaginatedCards() {
    const countPages = this.paginationCounter * this.cardsPerPage;
    this.paginatedCards = this.cards.slice(0, countPages);
  }

  handleLoadMore() {
    this.paginationCounter += 1;
    this.handleActions();
  }
};

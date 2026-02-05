import { getLibs } from '../../scripts/utils.js';
import { partnerCardsDateFilterStyles } from '../../components/PartnerCardsStyles.js';
import PartnerCards from '../../components/PartnerCards.js';
import '../../components/SinglePrpCollectionCard.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

export function filterRestrictedCardsByCurrentSite(cards) {
  const currentSite = window.location.pathname.split('/')[1];
  return cards.filter((card) => {
    const cardUrl = card?.contentArea?.url;
    if (!cardUrl) return false;
    try {
      const cardSite = new URL(cardUrl).pathname.split('/')[1];
      return currentSite === cardSite;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Invalid URL: ${cardUrl}`, error);
      return false;
    }
  });
}

export default class Collections extends PartnerCards {
  static styles = [
    PartnerCards.styles,
    partnerCardsDateFilterStyles,
  ];

  static properties = {
    ...PartnerCards.properties,
    //selectedDateFilter: { type: Object },
  };

  constructor() {
    super();
    //this.selectedDateFilter = {};
  }

  get filters() {
    return html`
      ${super.filters}
    `;
  }

  get filtersMobile() {
    return html`
      ${super.filtersMobile}
    `;
  }

  get chosenFilters() {
    const parentChosenFilters = super.chosenFilters;
    if (!parentChosenFilters) return;

    let htmlContent = parentChosenFilters ? parentChosenFilters.htmlContent : '';
    let tagsCount = parentChosenFilters ? parentChosenFilters.tagsCount : 0;

    // if (!this.selectedDateFilter.default && Object.keys(this.selectedDateFilter).length) {
    //   htmlContent = html`
    //     <button class="${this.mobileView ? 'chosen-filter-btn-mobile' : 'sidebar-chosen-filter-btn'}" @click="${() => this.handleResetDateTags(this.blockData.dateFilter.tags)}" aria-label="${this.selectedDateFilter.value}">
    //       ${this.selectedDateFilter.value}
    //     </button>
    //     ${htmlContent}
    //   `;
    //   tagsCount += 1;
    // }

    // eslint-disable-next-line consistent-return
    return { htmlContent, tagsCount };
  }

  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.id,
        (card, index) => html`<single-prp-collection-card  class="card-wrapper"  .data=${card} .ietf=${this.blockData.ietf}></single-partner-card>`,
      )}`;
    }

    return html`<div class="no-results">
        <strong class="no-results-title">${this.blockData.localizedText['{{no-results-title}}']}</strong>
        <p class="no-results-description">${this.blockData.localizedText['{{no-results-description}}']}</p>
      </div>`;
  }

  // eslint-disable-next-line class-methods-use-this
  onDataFetched(apiData) {
    // Filter announcements by current site
    apiData.cards = filterRestrictedCardsByCurrentSite(apiData.cards);
  }
}

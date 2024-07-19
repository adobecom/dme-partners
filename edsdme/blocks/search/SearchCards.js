import { getLibs } from '../../scripts/utils.js';
import PartnerCards from '../../components/PartnerCards.js';
import { searchCardsStyles } from './SearchCardsStyles.js';
import '../../components/SearchCard.js';
import cardsData from './cards.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

export default class Search extends PartnerCards {
  static styles = [
    PartnerCards.styles,
    searchCardsStyles,
  ];

  static properties = {
    ...PartnerCards.properties,
    contentType: { type: String },
    contentTypeCounter: { type: Object },
  };

  constructor() {
    super();
    this.contentType = 'all';
    this.contentTypeCounter = { countAll: 0, countAssets: 0, countPages: 0 };
  }

  async fetchData() {
    const apiData = cardsData;
    // eslint-disable-next-line no-return-assign
    apiData.cards.forEach((card, index) => card.orderNum = index + 1);
    this.allCards = apiData.cards;
    this.cards = apiData.cards;
    this.paginatedCards = this.cards.slice(0, this.cardsPerPage);
    this.hasResponseData = true;
  }

  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.id,
        (card) => html`<search-card class="card-wrapper" .data=${card} .localizedText="${this.blockData.localizedText}"></search-card>`,
      )}`;
    }
    return html`<div class="no-results">
        <strong class="no-results-title">${this.blockData.localizedText['{{no-results-title}}']}</strong>
        <p class="no-results-description">${this.blockData.localizedText['{{no-results-description}}']}</p>
      </div>`;
  }

  setContentTypeCounts() {
    const counts = { countAll: 0, countAssets: 0, countPages: 0 };
    const filteredCards = [];

    this.cards.forEach((card) => {
      if (card.contentArea?.contentType === 'asset' || card.contentArea?.contentType === 'page') {
        counts.countAll += 1;
        if (card.contentArea.contentType === 'asset') counts.countAssets += 1;
        if (card.contentArea.contentType === 'page') counts.countPages += 1;
        filteredCards.push(card);
      }
    });

    this.cards = filteredCards;
    this.contentTypeCounter = counts;
  }

  additionalActions() {
    this.setContentTypeCounts();
    this.handleContentTypeAction();
  }

  handleContentType(contentType) {
    if (this.contentType === contentType) return;
    this.contentType = contentType;

    this.paginationCounter = 1;
    this.handleActions();
  }

  handleContentTypeAction() {
    if (this.contentType === 'all') return;
    this.cards = this.cards.filter((card) => card.contentArea?.contentType === this.contentType);
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class="search-box-wrapper" style="${this.blockData.backgroundColor ? `background: ${this.blockData.backgroundColor}` : ''}">
        <div class="search-box content">
          <h3 class="partner-cards-title">
            ${this.searchTerm
              ? `${this.blockData.localizedText['{{showing-results-for}}']} ${this.searchTerm}`
              : this.blockData.title
            }
          </h3>
          <sp-theme class="search-wrapper" theme="spectrum" color="light" scale="medium">
            <sp-search id="search" size="m" value="${this.searchTerm}" @input="${this.handleSearch}" @submit="${(event) => event.preventDefault()}" placeholder="${this.blockData.localizedText['{{search-topics-resources-files}}']}"></sp-search>
          </sp-theme>
        </div>
      </div>
      <div class="content">
        <div class="partner-cards">
        <div class="partner-cards-sidebar-wrapper">
          <div class="partner-cards-sidebar">
            ${!this.mobileView
              ? html`
                <div class="sidebar-header">
                  <h3 class="sidebar-title">${this.blockData.localizedText['{{filter}}']}</h3>
                  <button class="sidebar-clear-btn" @click="${this.handleResetActions}" aria-label="${this.blockData.localizedText['{{clear-all}}']}">${this.blockData.localizedText['{{clear-all}}']}</button>
                </div>
                <div class="sidebar-chosen-filters-wrapper">
                  ${this.chosenFilters && this.chosenFilters.htmlContent}
                </div>
                <div class="sidebar-filters-wrapper">
                  ${this.filters}
                </div>
              `
              : ''
            }
          </div>
        </div>
        <div class="partner-cards-content">
          <div class="partner-cards-header">
            <div class="partner-cards-title-wrapper">
              ${this.blockData.localizedText['{{show}}']}:
              <sp-theme theme="spectrum" color="light" scale="medium">
                <sp-button variant="${this.contentType === 'all' ? 'primary' : 'secondary'}" size="m" @click="${() => this.handleContentType('all')}" aria-label="${this.blockData.localizedText['{{all}}']}">
                  ${this.blockData.localizedText['{{all}}']} (${this.contentTypeCounter.countAll})</sp-button>
                <sp-button variant="${this.contentType === 'asset' ? 'primary' : 'secondary'}" size="m" @click="${() => this.handleContentType('asset')}" aria-label="${this.blockData.localizedText['{{assets}}']}">
                  ${this.blockData.localizedText['{{assets}}']} (${this.contentTypeCounter.countAssets})</sp-button>
                <sp-button variant="${this.contentType === 'page' ? 'primary' : 'secondary'}" size="m" @click="${() => this.handleContentType('page')}" aria-label="${this.blockData.localizedText['{{pages}}']}">
                  ${this.blockData.localizedText['{{pages}}']} (${this.contentTypeCounter.countPages})</sp-button>
              </sp-theme>
            </div>
            <div class="partner-cards-sort-wrapper">
              ${this.mobileView
                ? html`
                  <button class="filters-btn-mobile" @click="${this.openFiltersMobile}" aria-label="${this.blockData.localizedText['{{filters}}']}">
                    <span class="filters-btn-mobile-icon"></span>
                    <span class="filters-btn-mobile-title">${this.blockData.localizedText['{{filters}}']}</span>
                    ${this.chosenFilters?.tagsCount
                      ? html`<span class="filters-btn-mobile-total">${this.chosenFilters.tagsCount}</span>`
                      : ''
                    }
                  </button>
                `
                : ''
              }
              ${this.blockData.sort.items.length
                ? html`
                  <div class="sort-wrapper">
                    <button class="sort-btn" @click="${this.toggleSort}">
                      <span class="sort-btn-text">${this.selectedSortOrder.value}</span>
                      <span class="filter-chevron-icon" />
                    </button>
                    <div class="sort-list">
                      ${this.sortItems}
                    </div>
                  </div>`
                : ''
              }
            </div>
          </div>
          <div class="partner-cards-collection">
            ${this.hasResponseData
              ? this.partnerCards
              : html`
                <div class="progress-circle-wrapper">
                  <sp-theme theme="spectrum" color="light" scale="medium">
                    <sp-progress-circle label="Cards loading" indeterminate="" size="l" role="progressbar"></sp-progress-circle>
                  </sp-theme>
                </div>
              `
            }
          </div>
          ${this.cards.length
            ? html`
              <div class="pagination-wrapper ${this.blockData?.pagination === 'load-more' ? 'pagination-wrapper-load-more' : 'pagination-wrapper-default'}">
                ${this.pagination}
                <span class="pagination-total-results">${this.cardsCounter} ${this.blockData.localizedText['{{of}}']} ${this.cards.length} ${this.blockData.localizedText['{{results}}']}</span>
              </div>
            `
            : ''
          }
        </div>
      </div>
      </div>

      ${this.mobileView
        ? html`
          <div class="all-filters-wrapper-mobile">
            <div class="all-filters-header-mobile">
              <button class="all-filters-header-back-btn-mobile" @click="${this.closeFiltersMobile}" aria-label="${this.blockData.localizedText['{{back}}']}"></button>
              <span class="all-filters-header-title-mobile">${this.blockData.localizedText['{{filter-by}}']}</span>
            </div>
            <div class="all-filters-list-mobile">
              ${this.filtersMobile}
            </div>
            <div class="all-filters-footer-mobile">
              <span class="all-filters-footer-results-mobile">${this.cards?.length} ${this.blockData.localizedText['{{results}}']}</span>
              <div class="all-filters-footer-buttons-mobile">
                <button class="all-filters-footer-clear-btn-mobile" @click="${this.handleResetActions}" aria-label="${this.blockData.localizedText['{{clear-all}}']}">${this.blockData.localizedText['{{clear-all}}']}</button>
                <sp-theme theme="spectrum" color="light" scale="medium">
                  <sp-button @click="${this.closeFiltersMobile}" aria-label="${this.blockData.localizedText['{{apply}}']}">${this.blockData.localizedText['{{apply}}']}</sp-button>
                </sp-theme>
              </div>
            </div>
          </div>
        `
        : ''
      }
    `;
    }
  /* eslint-enable indent */
}

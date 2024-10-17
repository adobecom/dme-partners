import {
  getCurrentProgramType,
  getLibs, getLocale, getPartnerDataCookieObject,
} from '../../scripts/utils.js';
import PartnerCards from '../../components/PartnerCards.js';
import { searchCardsStyles } from './SearchCardsStyles.js';
import '../../components/SearchCard.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);
const { getConfig } = await import(`${miloLibs}/utils/utils.js`);

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
    // override in order to do nothing since we will fetch data in handleActions which is called on each user action
  }

  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.id,
        (card) => html`<search-card class="card-wrapper" .data=${card} .localizedText=${this.blockData.localizedText} .ietf=${this.blockData.ietf}></search-card>`,
      )}`;
    }
    return html`<div class="no-results">
        <strong class="no-results-title">${this.blockData.localizedText['{{no-results-title}}']}</strong>
        <p class="no-results-description">${this.blockData.localizedText['{{no-results-description}}']}</p>
      </div>`;
  }

  async getCards() {
    const url = new URL(
      "https://14257-dxpartners-stage.adobeioruntime.net/api/v1/web/dx-partners-runtime/search-apc/search-apc?",
    );

    const startCardIndex = (this.paginationCounter - 1) * this.cardsPerPage;

    const partnerDataCookie = getPartnerDataCookieObject(getCurrentProgramType());
    const partnerLevel = partnerDataCookie?.level || 'public';
    const regions = partnerDataCookie?.level || 'worldwide';

    const { locales } = getConfig();
    const localesData = getLocale(locales);

    const queryParams = new URLSearchParams(url.search);
        queryParams.append('partnerLevel', partnerLevel);
        queryParams.append('regions',  regions);
        queryParams.append('type',this.contentType);
        queryParams.append('term', this.searchTerm);
        queryParams.append('geo', localesData.region);
        queryParams.append('language', localesData.ietf);
        queryParams.append('from', startCardIndex.toString());
        queryParams.append('size',this.cardsPerPage);
        const sortMap = {'most-recent': 'recent', 'most-relevant': 'relevant'}
        queryParams.append('sort', sortMap[this.selectedSortOrder.key]);

    const postData = {
      filters: {
        type: this.selectedFilters?.type?.map((filter) =>filter.key) || [],
        product: this.selectedFilters?.product?.map((filter) => filter.key) || [],
        language: this.selectedFilters?.language?.map((filter) => filter.key) || [],
        topic: this.selectedFilters?.topic?.map((filter) => filter.key) || []
      }};

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Basic NDA3M2UwZTgtMTNlMC00ZjZjLWI5ZTMtZjBhZmQwYWM0ZDMzOjJKMnY1ODdnR3dtVXhoQjNRNlI2NDIydlJNUDYwRDZBYnJtSzRpRTJrMDBmdlI1VGMxRXNRbG9Vc2dBYTNNSUg=")

    let apiData;
    try {
      setTimeout(() => {
        this.hasResponseData = !!apiData?.cards;
        this.fetchedData = true;
      }, 5);


      const response = await fetch(url + queryParams, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Error message: ${response.statusText}`);
      }

      apiData = await response.json();
      this.hasResponseData = !!apiData.cards;
      return apiData;
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }
  async handleActions() {
    const cardsData = await this.getCards();
    const cards = cardsData.cards;
    const count = cardsData.count;
    this.cards = cards;
    this.paginatedCards = cards;
    this.countAll =  count.all;
    this.contentTypeCounter = { countAll: count.all, countAssets: count.assets, countPages: count.pages };
    }

  handleContentType(contentType) {
    if (this.contentType === contentType) return;
    this.contentType = contentType;

    this.paginationCounter = 1;
    this.handleActions();
  }

  getPageNumArray() {
    let numberOfPages = Math.ceil(this.contentTypeCounter.countAll / this.cardsPerPage);
    this.totalPages = numberOfPages;
    // eslint-disable-next-line consistent-return
    return Array.from({length: numberOfPages}, (value, index) => index + 1);
  }

  get cardsCounter() {
    const startIndex = (this.paginationCounter - 1) * this.cardsPerPage;

    const endIndex = startIndex + this.cardsPerPage;
    const lastCardIndex = this.contentTypeCounter.countAll < endIndex ? this.contentTypeCounter.countAll : endIndex;
    if (this.blockData.pagination === 'load-more') return lastCardIndex;

    return `${startIndex + 1} - ${lastCardIndex}`;
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
                <span class="pagination-total-results">${this.cardsCounter} ${this.blockData.localizedText['{{of}}']} ${this.contentTypeCounter.countAll} ${this.blockData.localizedText['{{results}}']}</span>
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

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
  async getCards() {
    try {

      const url = 'https://14257-dxpartners-stage.adobeioruntime.net/api/v1/web/dx-partners-runtime/search-apc/search-apc';
      const api = 'https://14257-dxpartners-richarddev.adobeioruntime.net/api/v1/web/dx-partners-runtime/search-apc?partnerLevel=gold&regions=worldwide, pacific&type=all&term=&specializations=education, government&geo=es&language=es-ES&from=0&size=200&sort=relevant';
      const params = '?partnerLevel=gold&regions=worldwide, pacific&type=all&term=&specializations=education, government&geo=es&language=es-ES&from=0&size=200&sort=relevant';
      const headers = new Headers();
      const username = '4073e0e8-13e0-4f6c-b9e3-f0afd0ac4d33';
      const password = '2J2v587gGwmUxhB3Q6R6422vRMP60D6AbrmK4iE2k00fvR5Tc1EsQloUsgAa3MIH';

      headers.append("X-OW-EXTRA-LOGGING", "ON");
const basicAuth = 'Basic NDA3M2UwZTgtMTNlMC00ZjZjLWI5ZTMtZjBhZmQwYWM0ZDMzOjJKMnY1ODdnR3dtVXhoQjNRNlI2NDIydlJNUDYwRDZBYnJtSzRpRTJrMDBmdlI1VGMxRXNRbG9Vc2dBYTNNSUg=';
      // headers.append("Authorization", 'Basic NDA3M2UwZTgtMTNlMC00ZjZjLWI5ZTMtZjBhZmQwYWM0ZDMzOjJKMnY1ODdnR3dtVXhoQjNRNlI2NDIydlJNUDYwRDZBYnJtSzRpRTJrMDBmdlI1VGMxRXNRbG9Vc2dBYTNNSUg=');
      // headers.append('Authorization', basicAuth);
// headers.append('Authorization', 'Basic ' +  btoa('4073e0e8-13e0-4f6c-b9e3-f0afd0ac4d33:2J2v587gGwmUxhB3Q6R6422vRMP60D6AbrmK4iE2k00fvR5Tc1EsQloUsgAa3MIH'));
headers.append('Authorization', 'Basic NDA3M2UwZTgtMTNlMC00ZjZjLWI5ZTMtZjBhZmQwYWM0ZDMzOjJKMnY1ODdnR3dtVXhoQjNRNlI2NDIydlJNUDYwRDZBYnJtSzRpRTJrMDBmdlI1VGMxRXNRbG9Vc2dBYTNNSUg=');
// headers.append('Authorization', 'Basic 4073e0e8-13e0-4f6c-b9e3-f0afd0ac4d33:2J2v587gGwmUxhB3Q6R6422vRMP60D6AbrmK4iE2k00fvR5Tc1EsQloUsgAa3MIH');
      headers.append("Content-Type", "application/json");
      const body = {
        "filters": {
          "type": [],
          "product": [],
          "language": [],
          "topic": []
        }
      };
      const options = {
        headers: headers,
        method: 'POST',
        body: body
      };
      const response = await fetch(url + params, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiData = await response.json();
      console.log('2 apiData from search', apiData);} catch (error) { console.error('Error fetching data:', error);}

  }
// todo: update to use real fetch, check with dragana for what we need card.orderNum,can we delete it,and why we need this.allcards
  async fetchData() {
    const apiData = cardsData;
    // eslint-disable-next-line no-return-assign
    apiData.cards.forEach((card, index) => card.orderNum = index + 1);
    this.allCards = apiData.cards;
    this.cards = apiData.cards;
    this.paginatedCards = this.cards.slice(0, this.cardsPerPage);
    this.hasResponseData = true;
    await this.getCards();
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
// todo : this should also be done in back and  just set counts based on  response in handle actions method
  // todo check with dragana why we are setting this.cards = filteredcards since we didn't change any card here
  setContentTypeCounts() {
    console.log('in setContentTypeCounts(), should be moved to back')
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
//todo update to fetch and populate data (this and fetch data should be one method (dont se why would we need 2 methods?)
  handleActions() {
    console.log('in search card handle actions');
    console.log('search input changed, we should fetch');
    this.fetchData();
    //this should be skipped
    super.handleActions();
    //and instead of it collect :
    //  this.searchTerm ,
    //   this.selectedSortOrder.key,
    //    this.selectedFilters,
    // this.contentType,
    // this.paginationCounter (// check which value should be sent to backedn (0 or 1)see line 101)
    //    and set:
    //    this.paginationCounter (page num),this.cardsPerPage (page size),
    //    this.paginatedCards,
    // this.cards
    //  this.contentTypeCounter (as in setContentTypeCounts())
    //if filters : this.selectedFilters -  are empty she deleted url params also: this.urlSearchParams.delete('filters');

  }
// todo remove this since it will be covered
  additionalActions() {
    this.setContentTypeCounts();
    this.handleContentTypeAction();
  }
//todo: this should be good also since we overrride handle actions where we call fetch
  handleContentType(contentType) {
    if (this.contentType === contentType) return;
    this.contentType = contentType;
// check which value should be sent to backedn (0 or 1)
    this.paginationCounter = 1;
    this.handleActions();
  }
//todo : remove this - should be filtered on back
  handleContentTypeAction() {
    console.log('in handleContentTypeAction(), should be skip since back will filter by this also')
    if (this.contentType === 'all') return;
    this.cards = this.cards.filter((card) => card.contentArea?.contentType === this.contentType);
  }

  //todo override getPageNumArray() from superclass
  //todo overrride get cardsCounter() from superclass,or use some new property instead
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
<!--                this.card.lenght should be replaced with total size value that we got from backend -->
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

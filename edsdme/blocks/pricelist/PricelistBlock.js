import PartnerCards from "../../components/PartnerCards.js";
import {getLibs} from "../../scripts/utils.js";
import {pricelistBlockStyles} from "./PricelistBlockStyles.js";
import {data} from "./pricelistdata.js";
import {setDownloadParam} from "../utils/utils.js";
const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

export default class Pricelist extends PartnerCards {
  static styles = [
    PartnerCards.styles,
    pricelistBlockStyles,
  ];
  static properties = {
    ...PartnerCards.properties,
    filtersSectionOptions: {
      searchLabel: 'Search',
      searchPlaceholder: 'Search here',
      filtersLabel: 'Filters',
      includeEndUser: false,
      includeEndUserPricelistFilter: {},
    },
  };
  constructor() {
    super();
    this.includeEndUser = false;
    this.includeEndUserPricelistFilter = {};
    this.searchInputPlaceholder = '{{search-here}}';
    this.searchInputLabel = '{{search}}';
  }

  //todo update when to use api
  async fetch () {
    return { json: data };
  }
  //todo handle error
  async fetchData() {
    setTimeout(() => {
      this.hasResponseData = !!apiData?.pricelist;
      this.fetchedData = true;
    }, 5);
    let apiData;
    try {
      const response = await this.fetch();
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      // apiData = await response.json();
      apiData = response.json;
      apiData.pricelist.forEach((card, index) => card.orderNum = index + 1);
      this.allCards = apiData.pricelist;
      this.cards = apiData.pricelist;
      this.paginatedCards = this.cards.slice(0, this.cardsPerPage);
      this.hasResponseData = !!apiData.pricelist;
    } catch (e) {
      console.log('error', e);
    }

  }
  createFilterObject(data) {
    return {
      key: data.name,
      value: this.blockData.localizedText[`{{${data.name}}}`],
      tags: data.tags.map((tagKey) => (
        {
          key: tagKey,
          parentKey: data.name,
        //todo check do we need to translate htose
          value: tagKey,
        // value: this.blockData.localizedText[`{{${tagKey}}}`],
          checked: false,
      })),
    }
  }
  additionalFirstUpdated() {
    this.getAllCardFilters();
    if (this.mobileView) {
      this.blockData.pagination = 'load-more';
      this.paginationCounter = 1;
      this.cardsPerPage = this.blockData.cardsPerPage;
    } else {
      this.blockData.pagination = 'default';
      this.paginationCounter = 1;
      this.cardsPerPage = this.allCards.length;
    }
  }
  additionalUpdateView(viewUpdated) {
    if (viewUpdated) {
      if (this.mobileView) {
        console.log('view');
        this.blockData.pagination = 'load-more';
        this.paginationCounter = 1;
        this.cardsPerPage = this.blockData.cardsPerPage;
        this.handleActions();
      } else {
        this.blockData.pagination = 'default';
        this.paginationCounter = 1;
        this.cardsPerPage = this.allCards.length;
        this.handleActions();
      }
    }
  }

  getAllCardFilters() {
    const filterKeys = ['currency', 'month','buying_program_type', 'region'];
    const filtersMap = {
      currency: new Set(),
      month: new Set(),
      buying_program_type: new Set(),
      region: new Set(),
    };

    const allArbitraryItems = this.cards.flatMap((card) => card.arbitrary);

    filterKeys.forEach((key) => {
      allArbitraryItems.forEach((item) => {
        if (item[key]) {
          filtersMap[key].add(item[key]);
        }
      });
    });

    filterKeys.forEach((key) => {
      this.blockData.filters.push(
        this.createFilterObject({ name: key, tags: Array.from(filtersMap[key]) })
      );
    });
    this.includeEndUserPricelistFilter = this.createFilterObject({ name: 'include_end_user_pricelist', tags: ['include_end_user_pricelist']});

  }


  getSlider() {
    return html`
      <sp-theme class="search-wrapper" theme="spectrum" color="light" scale="medium">
      <div class="sidebar-slider">
        <sp-switch size="m" 
                     ?checked=${this.includeEndUser} 
                     @change=${this.handleSlider}>
          include endpricelist user
        </sp-switch>
      </div>
      </sp-theme>
    `;
  }
  handleSlider(event) {
    this.includeEndUser = !this.includeEndUser;
    this.handleTag(event, this.includeEndUserPricelistFilter.tags[0], this.includeEndUserPricelistFilter.key);
  }

  getArbitraryValue(arbitrary, key) {
    const filters = arbitrary.filter((a) => a[key]);
    const newarray =  filters.map(f=> f[key]);
    return newarray.join(' ');

  }
  getTableRow(data) {
    return html`
      <tr>
        <td>${this.getArbitraryValue(data.arbitrary, 'buying_program_type')}</td>
        <td>${this.getArbitraryValue(data.arbitrary, 'region')}</td>
        <td>${this.getArbitraryValue(data.arbitrary, 'currency')}</td>
        <td>${this.getArbitraryValue(data.arbitrary, 'month')}</td>
        <td>
          <sp-theme theme="spectrum" color="light" scale="medium">
              <sp-action-button 
                  size="m"
                  href="${setDownloadParam(data.contentArea?.url)}" 
                  download="${data.contentArea?.title}" 
                  aria-label="${this.blockData.localizedText['{{download}}']}">
                <sp-icon-download slot="icon"></sp-icon-download>
                ${this.blockData.localizedText['{{download}}']}
              </sp-action-button>
            </sp-theme>
          
        </td>

      </tr>`
  }
  getTableRows() {
    return html`${repeat(this.paginatedCards,
        (pricelist) => pricelist.id,
        (pricelist) => this.getTableRow(pricelist))
    }`;
  }

  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`<div class="table-container" tabindex="0" role="region" aria-label="Scrollable table with data"">
        <table >
          <thead>
          <tr>
            <th scope="type">${this.blockData.localizedText['{{type}}']?.toLocaleUpperCase()}</th>
            <th scope="region">${this.blockData.localizedText['{{region}}']?.toLocaleUpperCase()}</th>
            <th scope="currency">${this.blockData.localizedText['{{currency}}']?.toLocaleUpperCase()}</th>
            <th scope="month">${this.blockData.localizedText['{{month}}']?.toLocaleUpperCase()}</th>
            <th scope="download">${this.blockData.localizedText['{{action}}']?.toLocaleUpperCase()}</th>
          </tr>
          </thead>
          <tbody>
          ${this.getTableRows()}
          </tbody>
        </table>
      </div>
      `;
    }

    return html`<div class="no-results">
        <strong class="no-results-title">${this.blockData.localizedText['{{no-results-title}}']}</strong>
        <p class="no-results-description">${this.blockData.localizedText['{{no-results-description}}']}</p>
      </div>`;
  }

  getCardArbitraryValues(card) {
   return card.arbitrary?.
   map((object) => {
     return Object.entries(object).map(([key, value]) =>
       value.toLocaleLowerCase()) }).join(' ');
  }
  handleSearchAction() {
    // eslint-disable-next-line max-len
    this.cards = this.allCards.filter((card) => this.getCardArbitraryValues(card).includes(this.searchTerm));
  }

  shouldDisplayPagination() {
    return this.cards.length && this.mobileView;
  }
  getPartnerCardsHeader() {
    return html`
      <div class="partner-cards-header">

        <div class="partner-cards-sort-wrapper">
          ${this.mobileView
        ? html`
              <button class="filters-btn-mobile" @click="${this.openFiltersMobile}"
                      aria-label="${this.blockData.localizedText['{{filters}}']}">
                <span class="filters-btn-mobile-icon"></span>
                <span class="filters-btn-mobile-title">${this.blockData.localizedText['{{filters}}']}</span>
                ${this.chosenFilters?.tagsCount
            ? html`<span class="filters-btn-mobile-total">${this.chosenFilters.tagsCount}</span>`
            : ''
        }
              </button>
                ${this.getSlider()}
            `
        : ''
    }
        </div>
      </div>
    `;
  }

}

import PartnerCards from "../../components/PartnerCards.js";
import {getLibs} from "../../scripts/utils.js";
import {pricelistBlockStyles} from "./PricelistBlockStyles.js";
import {data} from "./pricelistdata.js";
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
  }

  getAllCardFilters() {
    const filterKeys = ['month', 'region', 'currency', 'buying_program_type'];
    const filtersMap = {
      month: new Set(),
      region: new Set(),
      currency: new Set(),
      buying_program_type: new Set(),
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
      <div class="sidebar-slider">
        <sp-switch size="m" 
                     ?checked=${this.includeEndUser} 
                     @change=${this.handleSlider}>
          include endpricelist user
        </sp-switch>
      </div>
    `;
  }
  handleSlider(event) {
    this.handleTag(event, this.includeEndUserPricelistFilter.tags[0], this.includeEndUserPricelistFilter.key);
  }
   renderDivsForArbitrary(arbitrary) {
    return html`
    ${arbitrary.map(
      (item) =>
        html`<div>${Object.entries(item).map(
          ([key, value]) => html`<strong>${key}</strong>: ${value}`
        )}</div>`
    )}
  `;
  }

  // todo update view to display table
  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.id,
        (card) => html`<div class="card-wrapper" > ${this.renderDivsForArbitrary(card.arbitrary)}
        </div>`,
      )}`;
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
}

import PartnerCards from '../../components/PartnerCards.js';
import { getLibs } from '../../scripts/utils.js';
import { pricelistBlockStyles } from './PricelistBlockStyles.js';
import { data } from './pricelistdata.js';
import { setDownloadParam } from '../utils/utils.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);
export const priceListKeyWords = {
  CURRENCY: 'currency',
  MONTH: 'month',
  REGION: 'region',
  BUYING_PROGRAM_TYPE: 'buying_program_type',
  INCLUDE_EU_PRICELIST: 'include_end_user_pricelist',
  PAGINATION: {
    LOAD_MORE: 'load-more',
    DEFAULT: 'default',
  },
};
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

  // eslint-disable-next-line class-methods-use-this
  async fetch() {
    return { json: data };
  }

  async fetchData() {
    let apiData;
    setTimeout(() => {
      this.hasResponseData = !!apiData?.pricelist;
      this.fetchedData = true;
    }, 5);
    try {
      const response = await this.fetch();
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      // apiData = await response.json();
      apiData = response.json;
      apiData.pricelist.forEach((card, index) => { card.orderNum = index + 1; });
      this.allCards = apiData.pricelist;
      this.cards = apiData.pricelist;
      this.paginatedCards = this.cards.slice(0, this.cardsPerPage);
      this.hasResponseData = !!apiData.pricelist;
    } catch (e) {
      console.log('error', e);
    }
  }

  createFilterObject(filterData) {
    return {
      key: filterData.name,
      value: this.blockData.localizedText[`{{${filterData.name}}}`],
      tags: filterData.tags.map((tagKey) => (
        {
          key: tagKey,
          parentKey: filterData.name,
          value: tagKey,
          checked: false,
        })),
    };
  }

  additionalFirstUpdated() {
    this.getAllCardFilters();
    if (this.mobileView) {
      this.blockData.pagination = priceListKeyWords.PAGINATION.LOAD_MORE;
      this.cardsPerPage = this.blockData.cardsPerPage;
    } else {
      this.blockData.pagination = priceListKeyWords.PAGINATION.DEFAULT;
      this.cardsPerPage = this.allCards.length;
    }
  }

  additionalUpdateView(viewUpdated) {
    if (viewUpdated) {
      this.paginationCounter = 1;
      if (this.mobileView) {
        this.blockData.pagination = priceListKeyWords.PAGINATION.LOAD_MORE;
        this.cardsPerPage = this.blockData.cardsPerPage;
      } else {
        this.blockData.pagination = priceListKeyWords.PAGINATION.DEFAULT;
        this.cardsPerPage = this.allCards.length;
      }
      this.handleActions();
    }
  }

  getAllCardFilters() {
    const filterKeys = [
      priceListKeyWords.CURRENCY,
      priceListKeyWords.MONTH,
      priceListKeyWords.BUYING_PROGRAM_TYPE,
      priceListKeyWords.REGION,
    ];
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
        this.createFilterObject({ name: key, tags: Array.from(filtersMap[key]) }),
      );
    });
    this.includeEndUserPricelistFilter = this.createFilterObject({
      name: priceListKeyWords.INCLUDE_EU_PRICELIST,
      tags: [priceListKeyWords.INCLUDE_EU_PRICELIST],
    });
  }

  getSlider() {
    return html`
        <sp-theme class="search-wrapper" theme="spectrum" color="light" scale="medium">
            <div class="sidebar-slider">
                <sp-switch size="m"
                           ?checked=${this.includeEndUser}
                           @change=${this.handleSlider}>
                    ${this.blockData.localizedText[`{{${priceListKeyWords.INCLUDE_EU_PRICELIST}}}`]}
                </sp-switch>
            </div>
        </sp-theme>
    `;
  }

  handleSlider(event) {
    this.includeEndUser = event.target.checked;
    this.handleActions();
  }

  // eslint-disable-next-line class-methods-use-this
  getArbitraryValue(arbitrary, key) {
    const filters = arbitrary.filter((a) => a[key]);
    return filters.map((f) => f[key]).join();
  }

  getTableRow(rowData) {
    return html`
        <tr>
            <td headers="${priceListKeyWords.BUYING_PROGRAM_TYPE}">
                ${this.getArbitraryValue(rowData.arbitrary, priceListKeyWords.BUYING_PROGRAM_TYPE)}
            </td>
            <td headers="${priceListKeyWords.REGION}">
                ${this.getArbitraryValue(rowData.arbitrary, priceListKeyWords.REGION)}
            </td>
            <td headers="${priceListKeyWords.CURRENCY}">
                ${this.getArbitraryValue(rowData.arbitrary, priceListKeyWords.CURRENCY)}
            </td>
            <td headers="${priceListKeyWords.MONTH}">
                ${this.getArbitraryValue(rowData.arbitrary, priceListKeyWords.MONTH)}
            </td>
            <td headers="download">
                <sp-theme theme="spectrum" color="light" scale="medium">
                    <sp-action-button
                            size="m"
                            href="${setDownloadParam(rowData.contentArea?.url)}"
                            download="${rowData.contentArea?.title}"
                            aria-label="${this.blockData.localizedText['{{download}}']}">
                        <sp-icon-download slot="icon"></sp-icon-download>
                        ${this.blockData.localizedText['{{download}}']}
                    </sp-action-button>
                </sp-theme>
            </td>
        </tr>`;
  }

  getTableRows() {
    return html`${repeat(
      this.paginatedCards,
      (pricelist) => pricelist.id,
      (pricelist) => this.getTableRow(pricelist),
    )
    }`;
  }

  additionalActions() {
    this.cards = this.cards.filter((card) => {
      if (!card.arbitrary.length) return false;
      const isEndUser = card.arbitrary.some((o) => {
        return o.hasOwnProperty(priceListKeyWords.INCLUDE_EU_PRICELIST);
      });
      return this.includeEndUser || !isEndUser;
    });
  }

  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`
            <div class="table-container" tabindex="0" role="region" aria-label="Scrollable table with data"">
            <table>
                <thead>
                <tr>
                    <th id="type">
                        ${this.blockData.localizedText[`{{${priceListKeyWords.BUYING_PROGRAM_TYPE}}}`]?.toLocaleUpperCase()}
                    </th>
                    <th id="region">
                        ${this.blockData.localizedText[`{{${priceListKeyWords.REGION}}}`]?.toLocaleUpperCase()}
                    </th>
                    <th id="currency">
                        ${this.blockData.localizedText[`{{${priceListKeyWords.CURRENCY}}}`]?.toLocaleUpperCase()}
                    </th>
                    <th id="month">
                        ${this.blockData.localizedText[`{{${priceListKeyWords.MONTH}}}`]?.toLocaleUpperCase()}
                    </th>
                    <th id="download">${this.blockData.localizedText['{{action}}']?.toLocaleUpperCase()}</th>
                </tr>
                </thead>
                <tbody>
                ${this.getTableRows()}
                </tbody>
            </table>
            </div>
        `;
    }

    return html`
        <div class="no-results">
            <strong class="no-results-title">${this.blockData.localizedText['{{no-results-title}}']}</strong>
            <p class="no-results-description">${this.blockData.localizedText['{{no-results-description}}']}</p>
        </div>`;
  }

  // eslint-disable-next-line class-methods-use-this
  getCardArbitraryValues(card) {
    return card.arbitrary?.map((object) => Object.entries(object).map(([value]) => value.toLocaleLowerCase())).join(' ');
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
    ? html`<span
                                                class="filters-btn-mobile-total">${this.chosenFilters.tagsCount}</span>`
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

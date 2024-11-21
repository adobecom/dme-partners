import PartnerCards from "../../components/PartnerCards.js";
import {getLibs} from "../../scripts/utils.js";
import {partnerCardsDateFilterStyles} from "../../components/PartnerCardsStyles.js";
import {pricelistBlockStyles} from "./PricelistBlockStyles.js";
const miloLibs = getLibs();
const { html } = await import(`${miloLibs}/deps/lit-all.min.js`);
export default class PricelistBlock extends PartnerCards {
  static styles = [
    PartnerCards.styles,
    partnerCardsDateFilterStyles,
    pricelistBlockStyles,
  ];
  static properties = {
    ...PartnerCards.properties,
    filtersSectionOptions: {
      checkbox: 'INCLUDE-END-USER-PRICELIST',
      searchLabel: 'Search',
      searchPlaceholder: 'Search here',
      infoBoxTitle: 'Filter options',
      infoBoxDescription: 'Region: What countries a user is eligible to sell into Partner type: Programs a user is eligible to sell. Currency: Allows selection of currency if multiple currencies are available. Month: Price Lists for current, next, or previous months.',
      filtersLabel: 'Filters',
    },
  };
  constructor() {
    super();
  }
  fetchData () {

    console.log('in fetch')
  this.fetchedData = true;
  // override in order to do nothing
  }
  handleActions(
  ) {console.log('in handla a')
  this.fetchData()


  };


}

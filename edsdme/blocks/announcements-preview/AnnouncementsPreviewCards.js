import PartnerCards from '../../components/PartnerCards.js';
import { filterRestrictedCardsByCurrentSite } from '../announcements/AnnouncementsCards.js';

export default class AnnouncementsPreview extends PartnerCards {

  static properties = {
    ...PartnerCards.properties,
  };

  constructor() {
    super();
  }

  sortLatest(cards) {
  cards.forEach((card) => {
    const cardDate = new Date(card.cardDate);
    if (this.blockData.newestCards.length < 3) {
      this.blockData.newestCards.push(card);
      this.blockData.newestCards.sort((a, b) => new Date(b.cardDate) - new Date(a.cardDate));
    } else if (cardDate > new Date(this.blockData.newestCards[2].cardDate)) {
      this.blockData.newestCards[2] = card;
      this.blockData.newestCards.sort((a, b) => new Date(b.cardDate) - new Date(a.cardDate));
    }
  return this.blockData.newestCards;
  });

  // Ensure no duplicates and return only 3 cards
  this.blockData.newestCards = Array.from(new Set(this.blockData.newestCards.map(a => a.cardDate)))
    .map(date => this.blockData.newestCards.find(a => a.cardDate === date));

  return this.blockData.newestCards;
  }

  // eslint-disable-next-line class-methods-use-this
  onDataFetched(apiData) {
    // Filter announcements by current site
    console.log('before apiData.cards', apiData.cards)
    apiData.cards = filterRestrictedCardsByCurrentSite(apiData.cards);
    console.log('after filter apiData.cards', apiData.cards)
//     apiData.cards = this.sortLatest(apiData.cards);
    console.log('after apiData.cards', apiData.cards)
  }

  shouldDisplayPagination() {
    // override method
  }

  handleSortAction() {
    this.cards.sort((a, b) => new Date(a.cardDate) - new Date(b.cardDate))
  }

}

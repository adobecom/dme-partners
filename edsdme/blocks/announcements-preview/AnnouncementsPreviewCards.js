import { getLibs } from '../../scripts/utils.js';
import { previewPartnerCardStyles } from '../../components/PartnerCardsStyles.js';
import PartnerCards from '../../components/PartnerCards.js';
import { filterRestrictedCardsByCurrentSite } from '../announcements/AnnouncementsCards.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

export default class AnnouncementsPreview extends PartnerCards {

  static properties = {
    ...PartnerCards.properties,
  };

  constructor() {
    super();
  }

  sortLatest(cards) {
  console.log('cards before sort cards',cards)
  cards.forEach((card) => {
    const cardDate = new Date(card.cardDate);
    if (this.blockData.newestCards.length < 3) {
      this.blockData.newestCards.push(card);
      this.blockData.newestCards.sort((a, b) => new Date(b.cardDate) - new Date(a.cardDate));
    } else if (cardDate > new Date(this.blockData.newestCards[2].cardDate)) {
      this.blockData.newestCards[2] = card;
      this.blockData.newestCards.sort((a, b) => new Date(b.cardDate) - new Date(a.cardDate));
    }
  });

  // Ensure no duplicates and return only 3 cards
  this.blockData.newestCards = Array.from(new Set(this.blockData.newestCards.map(a => a.cardDate)))
    .map(date => this.blockData.newestCards.find(a => a.cardDate === date));

  cards = this.blockData.newestCards;
  console.log('cards after sort cards',cards)
  return cards;
  }

  // eslint-disable-next-line class-methods-use-this
  onDataFetched(apiData) {
    // Filter announcements by current site
    apiData.cards = filterRestrictedCardsByCurrentSite(apiData.cards);
    apiData.cards = this.sortLatest(apiData.cards);
    console.log('after apiData.cards', apiData.cards)
  }

  shouldDisplayPagination() {}

//   handleSortAction() {
//     console.log('this.cards unsorted', this.cards);
//     this.cards = this.sortLatest(this.cards);
//     console.log('this.cards unsorted', this.cards);
//   }

  getPartnerCardsHeader() {
    return html`
      <div class="partner-cards-header">
        <div class="partner-cards-title-wrapper">
          <h3 class="partner-cards-title">${this.blockData.title}</h3>
        </div>
      </div>
    `;
  }

  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.id,
        (card) => html`<single-partner-card class="card-wrapper" .data=${card} .ietf=${this.blockData.ietf}></single-partner-card>`,
      )}`;
    }
  return html`<div class="no-results">
          <p class="empty-massage">${this.blockData.localizedText['{{no-partner-announcement}}']}</p>
        </div>`;
    }

}

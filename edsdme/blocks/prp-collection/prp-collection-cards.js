import { getLibs } from '../../scripts/utils.js';
import PartnerCards from '../../components/PartnerCards.js';
import '../../components/SinglePrpCollectionCard.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

export function filterCardsByCollectionName(cards, arbitrary) {
  return cards.filter((card) => {
    const collectionName = Object.values(card?.arbitrary[0])[0];
    if (!collectionName) return false;

    try {
      return collectionName === arbitrary;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Invalid title: ${collectionName}`, error);
      return false;
    }
  });
}

export default class PRPCollectionCards extends PartnerCards {
  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.id,
        (card) => html`<single-prp-collection-card  class="card-wrapper"  .data=${card} .ietf=${this.blockData.ietf}></single-partner-card>`,
      )}`;
    }

    return html`<div class="no-results">
        <strong class="no-results-title">${this.blockData.localizedText['{{no-results-title}}']}</strong>
        <p class="no-results-description">${this.blockData.localizedText['{{no-results-description}}']}</p>
      </div>`;
  }

  // eslint-disable-next-line class-methods-use-this
  onDataFetched(apiData) {
    // Filter assets by collection name
    apiData.cards = filterCardsByCollectionName(apiData.cards, this.blockData.arbitrary);
  }
}

import { getLibs, getPermissionSpecializations } from '../../scripts/utils.js';
import PartnerCards from '../../components/PartnerCards.js';
import { hasPreviewOption } from './SinglePrpCollectionCard.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

export function filterCardsByCollectionName(cards, collectionName) {
  return cards.filter((card) => {
    const name = Object.values(card?.arbitrary[0])[0];
    if (!name) return false;

    try {
      return name === collectionName;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Invalid title: ${collectionName}`, error);
      return false;
    }
  });
}

function filterCardsBySpecialization(cards) {
  const userSpecializations = getPermissionSpecializations();

  return cards.filter((card) => {
    const arbitrary = card?.arbitrary || [];

    const cardSpecializations = arbitrary
      .filter((item) => item && typeof item === 'object' && 'specializations' in item)
      .map((item) => `${item.specializations}`.trim().toLowerCase())
      .filter(Boolean);

    if (cardSpecializations.length === 0) return true;

    return cardSpecializations.some((spec) => userSpecializations.includes(spec));
  });
}

export default class PRPCollectionCards extends PartnerCards {
  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.id,
        (card) => html`<single-prp-collection-card class="card-wrapper" .data=${card} .ietf=${this.blockData.ietf} .localizedText=${this.blockData.localizedText}>
          ${hasPreviewOption(card.contentArea?.url) ? html`<a slot="card-footer" class="card-open-link" daa-ll="${this.blockData.localizedText['{{open}}']}" href="${card.contentArea?.url}" target="_blank" rel="noopener noreferrer">${this.blockData.localizedText['{{open}}']}</a>` : ''}
          <a slot="card-footer" class="card-btn" daa-ll="${this.blockData.localizedText['{{download}}']}" @click=${(e) => e.stopPropagation()} download="${card.contentArea?.title}" href="${card.contentArea?.url}">${this.blockData.localizedText['{{download}}']}</a>
        </single-prp-collection-card>`,
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
    apiData.cards = filterCardsByCollectionName(apiData.cards, this.blockData.collectionName);
    // Filter assets if user has access based on specialization
    apiData.cards = filterCardsBySpecialization(apiData.cards);
  }
}

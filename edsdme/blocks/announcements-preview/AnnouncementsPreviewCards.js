import { getLibs } from '../../scripts/utils.js';
import { previewPartnerCardStyles } from '../../components/PartnerCardsStyles.js';
import PartnerCards from '../../components/PartnerCards.js';
import { filterRestrictedCardsByCurrentSite } from '../announcements/AnnouncementsCards.js';
import { transformCardUrl } from '../utils/utils.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

export function formatLinks(link) {
  const { hostname, pathname } = new URL(link);
  const isMiloUrl = hostname.endsWith('hlx.live') || hostname.endsWith('hlx.page');
  return isMiloUrl ? pathname : link;
}

export default class AnnouncementsPreview extends PartnerCards {
  static styles = [
    previewPartnerCardStyles,
  ];

  static properties = { ...PartnerCards.properties };

  additionalFirstUpdated() {
    const miloStylesPath = `${miloLibs}/styles/styles.css`;
    if (!this.shadowRoot.querySelector(`link[href="${miloStylesPath}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = miloStylesPath;
      this.shadowRoot.appendChild(link);
    }
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
    });

    // Ensure no duplicates and return only 3 cards
    // eslint-disable-next-line max-len
    this.blockData.newestCards = Array.from(new Set(this.blockData.newestCards.map((a) => a.cardDate)))
      .map((date) => this.blockData.newestCards.find((a) => a.cardDate === date));

    // eslint-disable-next-line no-param-reassign
    cards = this.blockData.newestCards;
    return cards;
  }

  // eslint-disable-next-line class-methods-use-this
  onDataFetched(apiData) {
    // Filter announcements by current site
    apiData.cards = filterRestrictedCardsByCurrentSite(apiData.cards);
    apiData.cards = this.sortLatest(apiData.cards);
  }

  // eslint-disable-next-line class-methods-use-this
  shouldDisplayPagination() {}

  getPartnerCardsHeader() {
    return html`
            <h3 class="text announcement-preview-title ${this.blockData.heading}">
              <strong>${this.blockData.title}</strong>
            </h3>
      `;
  }

  getViewAllButton() {
    return html`
              <a class="con-button blue" href="${this.blockData.link}">${this.blockData.buttonText}</a>
        `;
  }

  get partnerCards() {
    if (this.cards.length) {
      return html`${repeat(
        this.cards,
        (card) => card.id,
        (card) => {
          const imageUrl = card.styles?.backgroundImage
            ? `${new URL(card.styles.backgroundImage).pathname}?width=240&format=webp&optimize=small`
            : '';

          return html`
            <a class="link-wrapper" href="${transformCardUrl(card.contentArea.url)}" target="_blank">
              <div class="announcement-item">
                <div class="card-image">
                  <picture>
                    <source srcset="${imageUrl}" type="image/webp" />
                    <img src="${imageUrl}" alt="${card.styles?.backgroundAltText || ''}" loading="lazy" />
                  </picture>
                </div>
                <div class="card-content">
                  <h3 class="card-title">${card.contentArea.title}</h3>
                  <p class="card-description">${card.contentArea.description}</p>
                </div>
              </div>
            </a>
          `;
        },
      )}`;
    }

    return html`<p class="empty-message">${this.blockData.localizedText['{{no-partner-announcement}}']}</p>`;
  }

  render() {
    return html`
        ${this.fetchedData
    ? html`
            ${this.getPartnerCardsHeader()}
                ${this.hasResponseData
    ? this.partnerCards
    : ''}
         ` : ''}
      ${this.getViewAllButton()}
    `;
  }
}

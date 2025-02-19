import { getLibs } from '../../scripts/utils.js';
import { previewPartnerCardStyles } from '../../components/PartnerCardsStyles.js';
import PartnerCards from '../../components/PartnerCards.js';
import { filterRestrictedCardsByCurrentSite } from '../announcements/AnnouncementsCards.js';
import { transformCardUrl } from '../utils/utils.js';

const miloLibs = getLibs();
const { html, repeat } = await import(`${miloLibs}/deps/lit-all.min.js`);

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

  // eslint-disable-next-line class-methods-use-this
  handleSortAction(cards) {
    const sortFunctions = { newest: (a, b) => new Date(b.cardDate) - new Date(a.cardDate) };

    const sortKey = 'newest';
    cards.sort(sortFunctions[sortKey]);
  }

  // eslint-disable-next-line class-methods-use-this
  onDataFetched(apiData) {
    // Filter announcements by current site
    apiData.cards = filterRestrictedCardsByCurrentSite(apiData.cards);
    this.handleSortAction(apiData.cards);
    apiData.cards = apiData.cards.slice(0, 3);
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
    if (this.blockData.link && this.blockData.buttonText) {
      return html`
              <a class="con-button blue" href="${this.blockData.link}">${this.blockData.buttonText}</a>
        `;
    }
    return '';
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

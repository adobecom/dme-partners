import { singlePrpCollectionCardStyles } from './SinglePrpCollectionCardStyles.js';
import { formatDate, getLibs, prodHosts } from '../scripts/utils.js';
import { getConfig, transformCardUrl } from '../blocks/utils/utils.js';

const miloLibs = getLibs();
const { html, LitElement } = await import(`${miloLibs}/deps/lit-all.min.js`);
const { processTrackingLabels } = await import(`${miloLibs}/martech/attributes.js`);

const DEFAULT_BACKGROUND_IMAGE_PATH = '/content/dam/solution/en/images/card-collection/sample_default.png';

class SinglePrpCollectionCard extends LitElement {
  static properties = {
    data: { type: Object },
    ietf: { type: String },
  };

  static styles = singlePrpCollectionCardStyles;

  get imageUrl() {
    return `${new URL(this.data.styles?.backgroundImage).pathname}?width=400&format=webp&optimize=small`;
  }

  checkBackgroundImage(element) {
    const url = this.imageUrl;
    const img = new Image();

    const isProd = prodHosts.includes(window.location.host);
    const defaultBackgroundImageOrigin = `https://partners.${isProd ? '' : 'stage.'}adobe.com`;
    const defaultBackgroundImageUrl = `${defaultBackgroundImageOrigin}${DEFAULT_BACKGROUND_IMAGE_PATH}`;

    img.onerror = () => {
      element.style.backgroundImage = `url(${defaultBackgroundImageUrl})`;
    };

    img.src = url;
  }

  firstUpdated() {
    this.checkBackgroundImage(this.shadowRoot.querySelector('.card-header'));
  }

  render() {
    return html`
      <div class="single-prp-collection-card">
        <div class="card-header" style="background-image: url(${this.imageUrl})" alt="${this.data.styles?.backgroundAltText}"></div>
        <span class="card-file-type">PDF</span>
        <div class="card-content">
          <span class="card-date">${formatDate(this.data.cardDate, this.ietf)}</span>
          <div class="card-text">
            <p class="card-title">${this.data.contentArea?.title !== 'card-metadata' ? this.data.contentArea?.title : ''}</p>
            <p class="card-description">English, Datasheet</p>
          </div>
          <div class="card-footer">
            <a class="card-open-link" href="${transformCardUrl(this.data.contentArea?.url)}" daa-ll="${processTrackingLabels(this.data.footer[0]?.right[0]?.text, getConfig(), 30)}">Open</a>
            <a class="card-btn" href="${transformCardUrl(this.data.contentArea?.url)}" daa-ll="${processTrackingLabels(this.data.footer[0]?.right[0]?.text, getConfig(), 30)}">${this.data.footer[0]?.right[0]?.text}</a>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('single-prp-collection-card', SinglePrpCollectionCard);

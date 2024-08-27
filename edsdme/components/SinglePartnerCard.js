import { singlePartnerCardStyles } from './PartnerCardsStyles.js';
import { formatDate, getLibs, getLocale, prodHosts } from '../scripts/utils.js';

const miloLibs = getLibs();
const locale = getLocale();
const { html, LitElement } = await import(`${miloLibs}/deps/lit-all.min.js`);

const DEFAULT_BACKGROUND_IMAGE_PATH = '/content/dam/solution/en/images/card-collection/sample_default.png';

class SinglePartnerCard extends LitElement {
  static properties = { data: { type: Object } };

  static styles = singlePartnerCardStyles;

  // eslint-disable-next-line class-methods-use-this
  transformCardUrl(url) {
    if (!url) {
      console.error('URL is null or undefined');
      return '';
    }
    if (window.location.host === 'partners.adobe.com') {
      return url;
    }
    const newUrl = new URL(url);
    newUrl.protocol = window.location.protocol;
    newUrl.host = window.location.host;
    return newUrl;
  }

  get imageUrl() {
    return `${new URL(this.data.styles?.backgroundImage).pathname}?width=400&format=webp&optimize=small`
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
      <div class="single-partner-card">
        <div class="card-header" style="background-image: url(${this.imageUrl})" alt="${this.data.styles?.backgroundAltText}"></div>
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">${this.data.contentArea?.title !== 'card-metadata' ? this.data.contentArea?.title : ''}</p>
            <p class="card-description">${this.data.contentArea?.description}</p>
          </div>
          <div class="card-footer">
            <span class="card-date">${formatDate(this.data.cardDate, locale.ietf)}</span>
            <a class="card-btn" href="${this.transformCardUrl(this.data.contentArea?.url)}">${this.data.footer[0]?.right[0]?.text}</a>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('single-partner-card', SinglePartnerCard);

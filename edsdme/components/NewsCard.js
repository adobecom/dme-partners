import { newsCardStyles } from './PartnerCardsStyles.js';
import { formatDate, getLibs, prodHosts } from '../scripts/utils.js';

const miloLibs = getLibs();
const { html, LitElement } = await import(`${miloLibs}/deps/lit-all.min.js`);

const DEFAULT_BACKGROUND_IMAGE_PATH = '/content/dam/solution/en/images/card-collection/sample_default.png';

class NewsCard extends LitElement {
  static properties = { data: { type: Object } };

  static styles = newsCardStyles;

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

  checkBackgroundImage(element) {
    const style = window.getComputedStyle(element);
    const url = style.backgroundImage.slice(5, -2);
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
      <div class="news-card">
        <div class="card-header" style="background-image: url('${this.data.styles?.backgroundImage}')" alt="${this.data.styles?.backgroundAltText}"></div>
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">${this.data.contentArea?.title !== 'card-metadata' ? this.data.contentArea?.title : ''}</p>
            <p class="card-description">${this.data.contentArea?.description}</p>
          </div>
          <div class="card-footer">
            <span class="card-date">${formatDate(this.data.cardDate)}</span>
            <a class="card-btn" href="${this.transformCardUrl(this.data.contentArea?.url)}">${this.data.footer[0]?.right[0]?.text}</a>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('news-card', NewsCard);

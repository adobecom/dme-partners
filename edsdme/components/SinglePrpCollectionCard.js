import { singlePrpCollectionCardStyles } from './SinglePrpCollectionCardStyles.js';
import { formatDate, getLibs } from '../scripts/utils.js';

const miloLibs = getLibs();
const { html, LitElement } = await import(`${miloLibs}/deps/lit-all.min.js`);

class SinglePrpCollectionCard extends LitElement {
  static properties = {
    localizedText: { type: Object },
    data: { type: Object },
    ietf: { type: String },
  };

  static styles = singlePrpCollectionCardStyles;

  get imageUrl() {
    return `${new URL(this.data.styles?.backgroundImage)}?width=400&format=webp&optimize=small`;
  }

  // eslint-disable-next-line class-methods-use-this
  getFileExtensionFromUrl(url) {
    if (!url || typeof url !== 'string') return '';

    try {
      const { pathname } = new URL(url, window.location.origin);
      const fileName = pathname.split('/').pop();

      if (!fileName || !fileName.includes('.')) return '';

      return fileName.split('.').pop().toLowerCase();
    } catch {
      return '';
    }
  }

  getAssetDetails(arbitrary) {
    const result = [];

    arbitrary.forEach((item) => {
      if (item.category) {
        result.push(this.localizedText[`{{${item.category}}}`] ?? item.category);
      }

      if (item.language) {
        result.push(this.localizedText[`{{${item.language}}}`] ?? item.language);
      }
    });

    return [...new Set(result)].join(', ');
  }

  hasPreviewOption(url) {
    const currentExtension = this.getFileExtensionFromUrl(url);
    return currentExtension !== 'zip';
  }

  render() {
    return html`
      <div class="single-prp-collection-card">
        <div class="card-header" style="background-image: url(${this.imageUrl})" alt="${this.data.styles?.backgroundAltText}"></div>
        <span class="card-file-type">${this.getFileExtensionFromUrl(this.data.contentArea?.url)}</span>
        <div class="card-content">
          <span class="card-date">${formatDate(this.data.cardDate, this.ietf)}</span>
          <div class="card-text">
            <p class="card-title">${this.data.contentArea?.title !== 'card-metadata' ? this.data.contentArea?.title : ''}</p>
            <p class="card-description">${this.getAssetDetails(this.data.arbitrary)}</p>
          </div>
          <div class="card-footer">
            ${this.hasPreviewOption(this.data.contentArea?.url) ? html`<a class="card-open-link" href="${this.data.contentArea?.url}" target="_blank">${this.localizedText['{{open}}']}</a>` : ''}
            <a class="card-btn" download="${this.data.contentArea?.title}">${this.localizedText['{{download}}']}</a>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('single-prp-collection-card', SinglePrpCollectionCard);

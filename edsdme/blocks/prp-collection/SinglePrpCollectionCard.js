import { singlePrpCollectionCardStyles } from './SinglePrpCollectionCardStyles.js';
import { formatDate, getLibs } from '../../scripts/utils.js';

const miloLibs = getLibs();

export function getFileExtensionFromUrl(url) {
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

const ALLOWED_PREVIEW_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'mp4', 'pdf', 'png', 'svg'];

export function hasPreviewOption(url) {
  const currentExtension = getFileExtensionFromUrl(url);
  if (!currentExtension) return false;
  return ALLOWED_PREVIEW_EXTENSIONS.includes(currentExtension.toLowerCase());
}
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
    return getFileExtensionFromUrl(url);
  }

  getAssetDetails(arbitrary) {
    const result = [];

    arbitrary.forEach((item) => {
      if (item['asset-type']) {
        result.push(this.localizedText[`{{${item['asset-type']}}}`] ?? item['asset-type']);
      }

      if (item.language) {
        result.push(this.localizedText[`{{${item.language}}}`] ?? item.language);
      }
    });

    return [...new Set(result)].join(', ');
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
            <slot name="card-footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('single-prp-collection-card', SinglePrpCollectionCard);

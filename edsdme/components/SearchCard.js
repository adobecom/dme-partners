import searchCardStyles from './SearchCardStyles.js';
import { formatDate, getLibs } from '../scripts/utils.js';
import {setDownloadParam} from "../blocks/utils/utils.js";

const miloLibs = getLibs();
const { html, repeat, LitElement } = await import(`${miloLibs}/deps/lit-all.min.js`);

class SearchCard extends LitElement {
  static properties = {
    data: { type: Object },
    localizedText: { type: Object },
    ietf: { type: String },
  };

  static styles = searchCardStyles;

  get cardTags() {
    const tags = this.data.arbitrary;
    if (!tags.length) return;
    // eslint-disable-next-line consistent-return
    return html`${repeat(
      tags,
      (tag) => tag.key,
      (tag) => {
        const key = Object.values(tag)[0];
        return html`<span class="card-tag">${this.localizedText[`{{${key}}}`] || key.replaceAll('-', ' ')}</span>`;
      },
    )}`;
  }

  // eslint-disable-next-line class-methods-use-this
  toggleCard(searchCard) {
    searchCard.classList.toggle('expanded');
  }

  // eslint-disable-next-line class-methods-use-this
  isDownloadDisabled(fileType) {
    const disabledTypes = ['html'];
    return disabledTypes.includes(fileType);
  }

  // eslint-disable-next-line class-methods-use-this
  isPreviewEnabled(fileType) {
    const enabledTypes = ['pdf', 'html'];
    return enabledTypes.includes(fileType);
  }

  // eslint-disable-next-line class-methods-use-this
  getFileType(type) {
    const supportedFileTypes = ['excel', 'pfd', 'powerpoint', 'video', 'word', 'zip', 'html'];
    return supportedFileTypes.includes(type) ? type : 'default';
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class="search-card" @click=${(e) => this.toggleCard(e.currentTarget)}>
        <div class="card-header">
          <div class="card-title-wrapper">
            <span class="card-chevron-icon"></span>
            <div class="file-icon" style="background-image: url('/edsdme/img/icons/${this.getFileType(this.data.contentArea?.type)}.svg')"></div>
            <span class="card-title">${this.data.contentArea?.title !== 'card-metadata' ? this.data.contentArea?.title : ''}</span>
          </div>
          <div class="card-icons">
            <sp-theme theme="spectrum" color="light" scale="medium">
              <sp-action-button ?disabled=${this.isDownloadDisabled(this.data.contentArea?.type)} href="${setDownloadParam(this.data.contentArea?.url)}" download="${this.data.contentArea?.title}" aria-label="${this.localizedText['{{download}}']}"><sp-icon-download /></sp-action-button>
              ${this.isPreviewEnabled(this.data.contentArea?.type)
                ? html`<sp-action-button href="${this.data.contentArea?.url}" target="_blank" aria-label="${this.localizedText['{{open-in}}']}"><sp-icon-open-in /></sp-action-button>`
                : html`<sp-action-button disabled selected aria-label="${this.localizedText['{{open-in-disabled}}']}"><sp-icon-open-in /></sp-action-button>`
              }
            </sp-theme>
          </div>
        </div>
        
        <div class="card-content">
          ${this.data.styles?.backgroundImage
            ? html`<div class="card-img" style="background-image: url('${this.data.styles?.backgroundImage}')" alt="${this.data.styles?.backgroundAltText}"></div>`
            : ''
          }
          <div class="card-text">
            <span class="card-date">${this.localizedText['{{last-modified}}']}: ${formatDate(this.data.cardDate, this.ietf)}
          ${this.data.contentArea?.type !== 'html'
    ? html`<span class="card-size">${this.localizedText['{{size}}']}: ${this.data.contentArea?.size}</span>`
                : ''
    }
            </span>
            <p class="card-description">${this.data.contentArea?.description}</p>
            <div class="card-tags-wrapper">${this.cardTags}</div>
          </div>
        </div>
      </div>
    `;
  }
  /* eslint-enable indent */
}
customElements.define('search-card', SearchCard);

import { formatDate, createTag, getConfig } from '../../scripts/utils.js';

const CARD_METADATA_PROPERTY_CREATED = 'created';

export default async function init(el) {
  performance.mark('announcement-date:start');

  let createdDateValue;
  const cardMetadataEl = document.querySelector('.card-metadata');

  if (cardMetadataEl) {
    [...cardMetadataEl.children].forEach((row) => {
      const firstColumn = row.children[0];
      if (firstColumn
        && firstColumn.innerText.trim().toLowerCase() === CARD_METADATA_PROPERTY_CREATED) {
        createdDateValue = row.children[1]?.innerText.trim();
      }
    });
  }

  const createdDate = new Date(createdDateValue);

  if (!Number.isNaN(createdDate)) {
    const config = getConfig();
    el.innerHTML = '';
    el.className = `announcement-date-wrapper content ${el.className}`;
    el.classList.remove('announcement-date');
    const month = String(createdDate.getMonth() + 1).padStart(2, '0');
    const day = String(createdDate.getDate()).padStart(2, '0');
    const datetime = `${createdDate.getFullYear()}-${month}-${day}`;
    const dateEl = createTag('time', { datetime, class: 'announcement-date detail-m' }, formatDate(createdDateValue, config?.locale?.ietf));
    el.append(dateEl);
  }

  performance.mark('announcement-date:end');
  performance.measure('announcement-date block', 'announcement-date:start', 'announcement-date:end');
}

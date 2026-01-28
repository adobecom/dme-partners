import { getLibs, getCaasUrl } from '../../scripts/utils.js';
import { getConfig, populateLocalizedTextFromListItems, localizationPromises } from '../utils/utils.js';
import Collections from './CollectionsCards.js';

function declareCollections() {
  if (customElements.get('collections-cards')) return;
  customElements.define('collections-cards', Collections);
}

export default async function init(el) {
  performance.mark('collections-cards:start');

  const miloLibs = getLibs();
  const config = getConfig();

  const isArchive = el.classList.contains('archive');
  const sectionIndex = el.parentNode.getAttribute('data-idx');

  const localizedText = {
    '{{apply}}': 'Apply',
    '{{back}}': 'Back',
    '{{clear-all}}': 'Clear all',
    '{{current-month}}': 'Current month',
    '{{date}}': 'Date',
    '{{filter}}': 'Filter',
    '{{filter-by}}': 'Filter by',
    '{{filters}}': 'Filters',
    '{{last-90-days}}': 'Last 90 days',
    '{{next}}': 'Next',
    '{{next-page}}': 'Next Page',
    '{{load-more}}': 'Load more',
    '{{no-results-description}}': 'Try checking your spelling or broadening your search.',
    '{{no-results-title}}': 'No Results Found',
    '{{of}}': 'Of',
    '{{page}}': 'Page',
    '{{prev}}': 'Prev',
    '{{previous-month}}': 'Previous month',
    '{{previous-page}}': 'Previous Page',
    '{{results}}': 'Results',
    '{{search}}': 'Search',
    '{{show-all}}': 'Show all',
    '{{show-more}}': 'Show more',
    '{{show-less}}': 'Show less',
  };

  populateLocalizedTextFromListItems(el, localizedText);

  const deps = await Promise.all([
    localizationPromises(localizedText, config),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
  ]);

  declareCollections();

  const dateFilter = {
    key: 'date',
    value: localizedText['{{date}}'],
    tags: isArchive
      ? [{ key: 'show-all', value: localizedText['{{show-all}}'], parentKey: 'date', checked: true, default: true }]
      : [{ key: 'show-all', value: localizedText['{{show-all}}'], parentKey: 'date', checked: true, default: true },
        { key: 'current-month', value: localizedText['{{current-month}}'], parentKey: 'date', checked: false },
        { key: 'previous-month', value: localizedText['{{previous-month}}'], parentKey: 'date', checked: false },
        { key: 'last-90-days', value: localizedText['{{last-90-days}}'], parentKey: 'date', checked: false }],
  };

  const block = {
    el,
    collectionTag: '"caas:adobe-partners/collections/announcements"',
    ietf: config.locale.ietf,
  };

  const blockData = {
    localizedText,
    tableData: el.children,
    dateFilter,
    cardsPerPage: 12,
    pagination: 'load-more',
    isArchive,
    caasUrl: getCaasUrl(block),
    ietf: config.locale.ietf,
  };

  const app = document.createElement('collections-cards');
  app.className = 'content collections-wrapper';
  app.blockData = blockData;
  app.setAttribute('data-idx', sectionIndex);
  app.setAttribute('daa-lh', 'Collections Cards');
  el.replaceWith(app);

  await deps;
  performance.mark('collections-cards:end');
  performance.measure('collections-cards block', 'collections-cards:start', 'collections-cards:end');
  return app;
}

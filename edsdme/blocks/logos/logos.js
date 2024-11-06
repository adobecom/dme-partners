import { getLibs } from '../../scripts/utils.js';
import { replaceText, getConfig, populateLocalizedTextFromListItems } from '../utils/utils.js';
import Logos from './LogosCards.js';

function declareLogos() {
  if (customElements.get('logos-cards')) return;
  customElements.define('logos-cards', Logos);
}

async function localizationPromises(localizedText, config) {
  return Promise.all(Object.keys(localizedText).map(async (key) => {
    const value = await replaceText(key, config);
    if (value.length) localizedText[key] = value;
  }));
}

export default async function init(el) {
  const miloLibs = getLibs();
  const config = getConfig();

  const sectionIndex = el.parentNode.getAttribute('data-idx');
  const isMain = el.classList.contains('main');

  const localizedText = {
    '{{no-results-title}}': 'No Results Found',
    '{{size}}': 'Size',
    '{{last-modified}}': 'Last modified',
  };

  populateLocalizedTextFromListItems(el, localizedText);

  const deps = await Promise.all([
    localizationPromises(localizedText, config),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/action-button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/icons-workflow.js`),
  ]);

  declareLogos();

  const blockData = {
    localizedText,
    tableData: el.children,
    ietf: config.locale.ietf,
    isMain,
  };

  const app = document.createElement('logos-cards');
  app.className = `logos-cards-wrapper${blockData.isMain ? ' main' : ''}`;
  app.blockData = blockData;
  app.setAttribute('data-idx', sectionIndex);
  el.replaceWith(app);

  await deps;
  return app;
}

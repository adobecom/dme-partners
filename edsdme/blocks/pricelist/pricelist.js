import PricelistBlock from "./PricelistBlock.js";
import {getConfig, localizationPromises, populateLocalizedTextFromListItems} from "../utils/utils.js";
import {getLibs} from "../../scripts/utils.js";

function declarePricelist() {
  if (customElements.get('pricelist-block')) return;
  customElements.define('pricelist-block', PricelistBlock);
}
export default async function init(el) {
  console.log('element', el);
  const miloLibs = getLibs();
  const config = getConfig();


  const sectionIndex = el.parentNode.getAttribute('data-idx');
  const localizedText = {
    '{{filter}}': 'Filter',
    '{{filter-by}}': 'Filter by',
    '{{filters}}': 'Filters',
    '{{open-in}}': 'Open in',
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

  declarePricelist();

  const blockData = {
    localizedText,
    tableData: el.children,
    ietf: config.locale.ietf,
    pagination: 'load-more',
  };

  const app = document.createElement('pricelist-block');
  app.className = 'content pricelist-block-wrapper';
  app.blockData = blockData;
  app.setAttribute('data-idx', sectionIndex);
  el.replaceWith(app);
  await deps;
  return app;
}

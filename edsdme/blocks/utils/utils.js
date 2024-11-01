import { getLocale, setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');

const { createTag, localizeLink, getConfig } = await import(`${miloLibs}/utils/utils.js`);

export { createTag, localizeLink, getConfig };
const { replaceText } = await import(`${miloLibs}/features/placeholders.js`);
export { replaceText };

export function populateLocalizedTextFromListItems(el, localizedText) {
  const liList = Array.from(el.querySelectorAll('li'));
  liList.forEach((liEl) => {
    const liInnerText = liEl.innerText;
    if (!liInnerText) return;
    let liContent = liInnerText.trim().toLowerCase().replace(/ /g, '-');
    if (liContent.endsWith('_default')) liContent = liContent.slice(0, -8);
    localizedText[`{{${liContent}}}`] = liContent;
  });
}

export function generateRequestForSearchAPI(pageOptions, body) {
  const { env, locales } = getConfig();
  let domain = 'https://io-partners-dx.stage.adobe.com';
  if (env.name === 'prod') {
    domain = 'https://io-partners-dx.adobe.com';
  }
  const url = new URL(
    `${domain}/api/v1/web/dx-partners-runtime/search-apc/search-apc?`,
  );
  const localesData = getLocale(locales);
  const queryParams = new URLSearchParams(url.search);
  queryParams.append('geo', localesData.prefix && localesData.region);
  queryParams.append('language', localesData.ietf);

  // eslint-disable-next-line array-callback-return
  Object.keys(pageOptions).map((option) => {
    queryParams.append(option, pageOptions[option]);
  });

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  return fetch(url + queryParams, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include',
  });
}

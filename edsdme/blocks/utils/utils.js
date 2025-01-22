import { getLocale, setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');

const { createTag, localizeLink, getConfig } = await import(`${miloLibs}/utils/utils.js`);

export { createTag, localizeLink, getConfig };

export async function populateLocalizedTextFromPlaceholders(localizedText) {
  const { locales } = getConfig();
  const locale = getLocale(locales);
  const placeholderPath = `${locale.prefix}/edsdme/partners-shared/placeholders.json`;
  const placeholderUrl = new URL(placeholderPath, window.location.origin);

  const response = await fetch(placeholderUrl);
  if (!response.ok) {
    throw new Error(`Error message: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  jsonResponse.data.forEach((pair) => {
    if (pair.value) {
      localizedText[`{{${pair.key}}}`] = pair.value;
    }
  });
}

export function getRuntimeActionUrl(action) {
  const { env } = getConfig();
  let domain = 'https://io-partners-dx.stage.adobe.com';
  if (env.name === 'prod') {
    domain = 'https://io-partners-dx.adobe.com';
  }
  return new URL(
    `${domain}${action}`,
  );
}

export function generateRequestForSearchAPI(pageOptions, body) {
  const { locales } = getConfig();
  const url = getRuntimeActionUrl('/api/v1/web/dx-partners-runtime/search-apc/search-apc?');
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

// eslint-disable-next-line class-methods-use-this
export function setDownloadParam(url) {
  try {
    if (!url) return '';
    const urlWithParam = new URL(url);
    urlWithParam.search = 'download';
    // eslint-disable-next-line consistent-return
    return urlWithParam;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Invalid URL provided:', url, error.message);
    return '';
  }
}

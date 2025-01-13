import { partnerIsSignedIn } from './utils.js';
import { rewriteHrefDomainOnStage } from './links.js';

/**
 * Domain map where the key is the production domain,
 * and the value is the corresponding stage domain.
 */
const domainMap = {
  'cbconnection.adobe.com': 'cbconnection-stage.adobe.com',
  'partners.adobe.com': 'partners.stage.adobe.com',
};

/**
 * Domain configs where the key is the production domain,
 * and the value is config object for it.
 */
const domainConfigs = {
  'cbconnection.adobe.com': {
    localeMap: {
      de: 'de',
      cn: 'zh_cn',
      fr: 'fr',
      it: 'it',
      jp: 'jp',
      kr: 'ko',
      es: 'es',
    },
    expectedLocale: 'en',
    loginPath: '/bin/fusion/modalImsLogin',
  },
  'www.adobe.com': {
    localeMap: {
      emea: 'uk',
      fr: 'fr',
      de: 'de',
      it: 'it',
      es: 'es',
      kr: 'kr',
      cn: 'cn',
      jp: 'jp',
    },
  },
  'www.helpx.adobe.com': {
    localeMap: {
      emea: 'uk',
      fr: 'fr',
      de: 'de',
      it: 'it',
      es: 'es',
      kr: 'kr',
      cn: 'cn',
      jp: 'jp',
    },
  },
  'www.business.adobe.com': {
    localeMap: {
      emea: 'uk',
      fr: 'fr',
      de: 'de',
      it: 'it',
      es: 'es',
      kr: 'kr',
      cn: 'cn',
      jp: 'jp',
    },
  },
};

/**
 * Modifies the given URL object by updating its search params
 * (aimed to handle cbcconnection links and attach login path to them)
 * @param {URL} url - The URL object to be modified.
 */
// eslint-disable-next-line consistent-return
function setLoginPathIfSignedIn(url) {
  const loginPath = domainConfigs[url.hostname]?.loginPath;
  if (loginPath) {
    const isUserSignedIn = partnerIsSignedIn();
    if (isUserSignedIn && !url.pathname.includes(loginPath)) {
      const resource = url.pathname;
      url.searchParams.append('resource', resource);
      url.pathname = loginPath;
    }
  }
}

/**
 * Modifies the given URL object by updating its path with correct locale for url domain,
 * based on current page locale and locale maps that are defined for specific domains
 *
 * for cbcconnection it is expected that url already includes /en in path, so it will be updated to correct locale
 * for other domains it is not expected to have locale in path, so correct locale will be appended to  url.pathname
 * @param {URL} url - The URL object to be modified.
 */
function setLocale(url) {
  const localesToSkip = ['na', 'latam', 'apac'];
  const currentPageLocale = window.location.pathname.split('/')?.[1];
  if (localesToSkip.indexOf(currentPageLocale) !== -1) return;
  const domainConfig = domainConfigs[url.hostname];
  if (!domainConfig) return;
  const localeFromMap = domainConfig.localeMap[currentPageLocale];
  if (!localeFromMap) return;
  const pathParts = url.pathname.split('/').filter(Boolean);
  if (domainConfig.expectedLocale) {
    const localeFromHref = pathParts[0];
    if (localeFromHref !== domainConfig.expectedLocale) return;
    pathParts[0] = localeFromMap;
  } else {
    pathParts.unshift(localeFromMap);
  }
  url.pathname = `/${pathParts.join('/')}`;
}

/**
 * Takes string that represent url href, updates locale, login path and domain
 * @param href
 * @returns {*|string} modified href
 */
function getUpdatedHref(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  setLocale(url);
  setLoginPathIfSignedIn(url);
  // always as last step since we need original domains for mappings
  return rewriteHrefDomainOnStage(url.href, domainMap);
}

/**
 * Iterates throw all links on the page and update their hrefs if conditions are fulfilled
 * (conditions: appropriate domain, appropriate current page locale, environment and is user logged in)
 *
 */
export function rewriteLinks() {
  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    link.href = getUpdatedHref(link.href);
  });
}

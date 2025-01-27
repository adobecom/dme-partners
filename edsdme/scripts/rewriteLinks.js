import { partnerIsSignedIn } from './utils.js';
import { getConfig } from '../blocks/utils/utils.js';

/**
 * Domain map where the key is the production domain,
 * and the value is the corresponding stage domain.
 */
const domainMap = {
  'cbconnection.adobe.com': 'cbconnection-stage.adobe.com',
  'partners.adobe.com': 'partners.stage.adobe.com',
  'adobe.force.com': 'adobe--sfstage.sandbox.my.site.com',
  'io-partners-dx.adobe.com': 'io-partners-dx.stage.adobe.com',
  'channelpartners.adobe.com': 'channelpartners.stage2.adobe.com',
  'adobe--sfstage1.sandbox.my.salesforce-sites.com': 'adobe.my.salesforce-sites.com',
};

/**
 * Default rewriters for handling URL locale modifications.
 */
const defaultLocaleRewriters = {
  /**
   * Rewrites the URL to include the locale in the path prefix.
   *
   * @param {URL} url - The URL object to modify.
   * @param {string} locale - The locale to add to the path as prefix.
   * @param {Object} domainConfig - The domain configuration object.
   * @param {string} [domainConfig.expectedLocale] - The locale expected in the current path.
   */
  pathPrefix: (url, locale, domainConfig) => {
    if (!url || !locale) return;
    let { pathname } = url;
    if (domainConfig?.expectedLocale) {
      if (!url.pathname.startsWith(domainConfig.expectedLocale)) {
        return;
      }
      pathname = url.pathname.replace(domainConfig.expectedLocale, '');
    }
    url.pathname = locale + pathname;
  },

  /**
   * Rewrites the URL to include the locale as a query parameter.
   *
   * @param {URL} url - The URL object to modify.
   * @param {string} locale - The locale to add as a query parameter.
   * @param {Object} domainConfig - The domain configuration object.
   * @param {string} [domainConfig.queryParamKey] - The query parameter key to use for the locale.
   */
  queryParam: (url, locale, domainConfig) => {
    if (!url || !locale || !domainConfig?.queryParamKey) return;
    const params = new URLSearchParams(url.search);
    params.set(domainConfig.queryParamKey, locale);
    url.search = `?${params.toString()}`;
  },
};

const acomDomainConfig = {
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
  localeRewriter: defaultLocaleRewriters.pathPrefix,
};

/**
 * Domain configs where the key is the production domain,
 * and the value is config object for it.
 */
const domainConfigs = {
  'cbconnection.adobe.com': {
    localeMap: {
      de: '/de/',
      cn: '/zh_cn/',
      fr: '/fr/',
      it: '/it/',
      jp: '/jp/',
      kr: '/ko/',
      es: '/es/',
    },
    expectedLocale: '/en/',
    localeRewriter: defaultLocaleRewriters.pathPrefix,
    loginPath: '/bin/fusion/modalImsLogin',
  },
  'www.adobe.com': acomDomainConfig,
  'adobe.com': acomDomainConfig,
  'helpx.adobe.com': acomDomainConfig,
  'business.adobe.com': acomDomainConfig,
  'adobe--sfstage1.sandbox.my.salesforce-sites.com': {
    localeMap: {
      apac: 'en',
      cn: 'zh_CN',
      de: 'de',
      emea: 'en',
      es: 'es',
      fr: 'fr',
      it: 'it',
      jp: 'ja',
      kr: 'ko',
      latam: 'en',
      na: 'en',
    },
    localeRewriter: defaultLocaleRewriters.queryParam,
    queryParamKey: 'lang',
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
 * Modifies the given URL object with the correct locale,
 * based on the current page locale and locale maps that are defined for specific domains.
 * A locale rewritter must be defined in the domain configuration.
 *
 * for cbcconnection it is expected that url already includes /en in path,
 * so it will be updated to correct locale
 * for other domains it is not expected to have locale in path,
 * so correct locale will be appended to  url.pathname
 * @param {URL} url - The URL object to be modified.
 */
function setLocale(url) {
  if (window.location.pathname === '/' || window.location.pathname === '') return;
  const currentPageLocale = window.location.pathname.split('/')?.[1];
  const domainConfig = domainConfigs[url.hostname];
  if (!domainConfig) return;
  const localeFromMap = domainConfig.localeMap[currentPageLocale];
  if (!localeFromMap) return;
  const { localeRewriter } = domainConfig;
  if (localeRewriter && typeof localeRewriter === 'function') {
    localeRewriter(url, localeFromMap, domainConfig);
  }
}

/**
 * Rewrite a link href domain based on production to stage domain mappings.
 * @param {URL} url - The URL object to be modified.
 * Modifies URL href, or the original if the environment is prod,
 * there was a problem processing, or there is no domain mapping defined for it.
 */
export function rewriteUrlDomainOnNonProd(url) {
  const { env } = getConfig();

  if (env.name === 'prod') return;

  if (domainMap[url.hostname]) {
    url.hostname = domainMap[url.hostname];
  }
}

/**
 * Takes string that represent url href,
 * updates locale, login path and domain
 * @param href
 * @returns {*|string} modified href
 */
export function getUpdatedHref(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  setLocale(url);
  setLoginPathIfSignedIn(url);
  // always as last step since we need original domains for mappings
  rewriteUrlDomainOnNonProd(url);
  return url.toString();
}

/**
 * Iterates through all links on the page and updates their hrefs if conditions are fulfilled
 * (conditions: appropriate domain, appropriate current page locale,
 * environment and is user logged in)
 */
export function rewriteLinks(element) {
  const links = element.querySelectorAll('a[href]');
  links.forEach((link) => {
    link.href = getUpdatedHref(link.href);
  });
  return element;
}

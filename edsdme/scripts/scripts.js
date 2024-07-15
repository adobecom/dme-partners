import { setLibs, getLocale } from './utils.js';
import { applyPersonalization } from './personalization.js';

const prodHosts = [
  'main--dme-partners--adobecom.hlx.page',
  'main--dme-partners--adobecom.hlx.live',
  'partners.adobe.com',
];

const imsClientId = prodHosts.includes(window.location.host) ? 'MILO_PARTNERS_PROD' : 'MILO_PARTNERS_STAGE';

const CONFIG = {
  codeRoot: '/edsdme',
  contentRoot: '/edsdme/partners-shared',
  imsClientId: imsClientId,
  geoRouting: 'on',
  // fallbackRouting: 'off',
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    northamerica: { ietf: 'en', tk: 'hah7vzn.css' },
    emea: { ietf: 'en', tk: 'hah7vzn.css' },
    apac: { ietf: 'en', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
    zh: { ietf: 'zh-TW', tk: 'jay0ecd' },
    cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
    it: { ietf: 'it-IT', tk: 'bbf5pok.css' },
    es: { ietf: 'es-ES', tk: 'oln4yqj.css' },
    fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css' },
    uk: { ietf: 'en-GB', tk: 'pps7abe.css' },
    br: { ietf: 'pt-BR', tk: 'inq1xob.css' },
    pt: { ietf: 'pt-PT', tk: 'inq1xob.css' },
    la: { ietf: 'es', tk: 'oln4yqj.css' },
  },
};

// Add project-wide style path here.
const STYLES = '';

// Use 'https://milo.adobe.com/libs' if you cannot map '/libs' to milo's origin.
const LIBS = '/libs';


// Add any config options.

(function removeAccessToken() {
  if (window.location.hash.startsWith('#access_token')) {
    window.location.hash = '';
  }
}());

// Load LCP image immediately
(function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.removeAttribute('loading');
}());

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

(async function loadPage() {
  const { prefix: localePrefix } = getLocale(CONFIG.locales);
  await applyPersonalization(localePrefix);
  const { loadArea, setConfig } = await import(`${miloLibs}/utils/utils.js`);
  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
}());

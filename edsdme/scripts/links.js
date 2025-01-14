import { getConfig } from '../blocks/utils/utils.js';

/**
 * Domain mappings where the key is the production domain,
 * and the value is the corresponding stage domain.
 */
const domainMappings = {
  'adobe.force.com': 'adobe--sfstage.sandbox.my.site.com',
  'io-partners-dx.adobe.com': 'io-partners-dx.stage.adobe.com',
  // add mappings here as necessary
};

/**
 * Rewrite a link href domain based on production to stage domain mappings.
 * @param {string} href - The link href to rewrite.
 * @param domainMap map of domains to update
 * @returns {string} - The rewritten link href, or the original if the environment is prod,
 * there was a problem processing, or there is no domain mapping defined for it.
 */
export function rewriteHrefDomainOnStage(href, domainMap) {
  const { env } = getConfig();

  if (env.name === 'prod') return href;
  let url;

  try {
    url = new URL(href);
  } catch {
    return href;
  }

  if (domainMap[url.hostname]) {
    url.hostname = domainMap[url.hostname];
    return url.toString();
  }

  return href;
}

/**
 * Applies link rewriting to the global navigation,
 * based on production to stage domain mappings.
 * @param {HTMLElement} gnav - The global navigation.
 */
export function applyGnavLinkRewriting(gnav) {
  const links = gnav.querySelectorAll('a[href]');
  links.forEach((link) => {
    link.href = rewriteHrefDomainOnStage(link.href, domainMappings);
  });

  return gnav;
}

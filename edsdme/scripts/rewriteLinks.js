import { getConfig } from '../blocks/utils/utils.js';
import {partnerIsSignedIn} from "./utils.js";

export function rewriteLinks() {
  const environments = {
    cbcProd: 'https://cbconnection.adobe.com',
    cbcStage: 'https://cbconnection-stage.adobe.com',
    partnersProd: 'https://partners.adobe.com',
    partnersStage: 'https://partners.stage.adobe.com',
  };

  const { env } = getConfig();
  const isProd = env.name === 'prod';

  const updateLinks = (currentDomain, newDomain, loginPath) => {
    const isSignedIn =  partnerIsSignedIn();
    document.querySelectorAll(`[href^="${currentDomain}"]`).forEach((link) => {
      let url;
      try {
        url = new URL(link.href);
      } catch {
        return;
      }
      url.hostname = new URL(newDomain).hostname;
      if (isSignedIn && loginPath && !url.pathname.includes(loginPath)) {
        const resource = url.pathname;
        url.searchParams.append('resource', resource);
        url.pathname = loginPath;
      }
      link.href = url.toString();
    });
  };

  // Update cbc links
  const cbcDomain = isProd ? environments.cbcProd : environments.cbcStage;
  updateLinks(environments.cbcProd, cbcDomain, '/bin/fusion/modalImsLogin');

  // Update partners links if not prod
  if (!isProd) {
    updateLinks(environments.partnersProd, environments.partnersStage);
  }
}

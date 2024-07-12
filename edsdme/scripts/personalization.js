import { getPartnerDataCookieObject, getCurrentProgramType } from './utils.js';

const GNAV_PLACEHOLDERS = {
  CAL: 'cal',
  SALES_CENTER: 'salesCenter',
  COMPANY: 'company',
  GO_TO_SALES: 'goToSales'
}

const DEFAULT_GNAV_PLACEHOLDERS = {
  cal: 'Channel Authorisation letter',
  salesCenter: 'Sales Center',
  goToSales: 'Go to Sales Center',
}

const LEVEL = {
  GOLD: 'Gold',
  PLATINUM: 'Platinum'
}

const GNAV_PERSONALIZATION_CONFIG = {
  cal: {
    xPath: `//*[contains(text(),'$${GNAV_PLACEHOLDERS.CAL}')]`,
    options: {
      conditions: {
        level: LEVEL.GOLD,
        permissionRegion: ['North America', 'EMEA', 'China'],
      }
    }
  },
  salesCenter: {
    xPath: `//*[contains(text(),'$${GNAV_PLACEHOLDERS.SALES_CENTER}')]`,
    options: {
      conditions: {
        level: LEVEL.PLATINUM,
      },
      target: 'parentElement'
    }
  },
  company: {
    xPath: `//*[contains(text(),'$${GNAV_PLACEHOLDERS.COMPANY}')]`,
    options: {
      cookie: 'company'
    }
  },
  goToSales: {
    xPath: `//*[contains(text(),'$${GNAV_PLACEHOLDERS.GO_TO_SALES}')]`,
    options: {
      conditions: {
        level: LEVEL.PLATINUM,
      }
    }
  }
}

function parseGnavPlaceholders(placeholders) {
  if (!placeholders) {
    return DEFAULT_GNAV_PLACEHOLDERS;
  }
  const result = {};
  placeholders.data.forEach((placeholder) => {
    result[placeholder['key']] = placeholder['value'];
  });

  return result;
}

function getNodesByXPath(query, context) {
  const nodes = [];
  const xpathResult = document.evaluate(query, context ?? document);
  let current = xpathResult?.iterateNext();
  while(current) {
    nodes.push(current);
    current = xpathResult.iterateNext();
  }
  return nodes;
}

function getNodeByXPath(query, context) {
  const xpathResult = document.evaluate(query, context ?? document); 
  return xpathResult?.iterateNext();
}

function personalizeElement(el, placeholder, options) {
  const partnerData = getPartnerDataCookieObject(getCurrentProgramType());
  const { conditions, target, cookie } = options;
  const condition = conditions && Object.entries(conditions)?.every(([key, value]) => {
    if (Array.isArray(value)) {
      return value.includes(partnerData[key]);
    }
    return value === partnerData[key];
  });

  if (!condition && !cookie) {
    const targetElement = el[target] ?? el;
    targetElement.remove();
    return;
  }

  el.textContent = placeholder ?? partnerData[cookie];
}

export async function personalizeGnav(placeholders, localePrefix) {
  const gnavPlaceholders = parseGnavPlaceholders(placeholders);
  const gnavMeta = document.querySelector('meta[name="gnav-source"]');
  if (gnavMeta) {
    const gnavLoggedIn = document.querySelector('meta[name="gnav-loggedin-source"]');
    gnavMeta.content = gnavLoggedIn?.content ?? `${localePrefix}/edsdme/partners-shared/loggedin-gnav`;
  }

  const nav = document.querySelector('header');
  let changes = 0;
  const observer = new MutationObserver(async (_, observer) => {
    Object.entries(GNAV_PERSONALIZATION_CONFIG).forEach(([key,value]) => {
      const el = getNodeByXPath(value.xPath, nav);
      if (el) {
        personalizeElement(el, gnavPlaceholders[key], value.options);
        changes++;
      }
    });
    if (changes === 3) {
      observer.disconnect();
    }
  });
  observer.observe(nav, {childList: true, subtree: true});
}

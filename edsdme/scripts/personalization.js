import { getPartnerDataCookieObject, getCurrentProgramType, isMember } from './utils.js';

const PLACEHOLDERS = {
  CAL: 'cal',
  SALES_CENTER: 'salesCenter',
  COMPANY: 'company',
  GO_TO_SALES: 'goToSales',
  JOIN_NOW: 'joinNow',
  FIRST_NAME: 'firstName'
}

const DEFAULT_PLACEHOLDERS = {
  [PLACEHOLDERS.CAL]: 'Channel Authorisation letter',
  [PLACEHOLDERS.SALES_CENTER]: 'Sales Center',
  [PLACEHOLDERS.GO_TO_SALES]: 'Go to Sales Center',
  [PLACEHOLDERS.JOIN_NOW]: 'Join Now'
}


const LEVEL = {
  GOLD: 'Gold',
  PLATINUM: 'Platinum'
}

const GNAV_PERSONALIZATION_CONFIG = {
  [PLACEHOLDERS.CAL]: {
    xPath: `//*[contains(text(),'$${PLACEHOLDERS.CAL}')]`,
    options: {
      conditions: {
        level: LEVEL.GOLD,
        permissionRegion: ['North America', 'EMEA', 'China'],
      },
      member: true,
    }
  },
  [PLACEHOLDERS.SALES_CENTER]: {
    xPath: `//*[contains(text(),'$${PLACEHOLDERS.SALES_CENTER}')]`,
    options: {
      conditions: {
        level: LEVEL.PLATINUM
      },
      target: 'parentElement',
      member: true,
    }
  },
  [PLACEHOLDERS.COMPANY]: {
    xPath: `//*[contains(text(),'$${PLACEHOLDERS.COMPANY}')]`,
    options: {
      cookie: 'company',
      member: true
    }
  },
  [PLACEHOLDERS.GO_TO_SALES]: {
    xPath: `//*[contains(text(),'$${PLACEHOLDERS.GO_TO_SALES}')]`,
    options: {
      conditions: {
        level: LEVEL.PLATINUM,
      },
      member: true,
    }
  }
};

const PAGE_PERSONALIZATION_CONFIG = {
  [PLACEHOLDERS.JOIN_NOW]: {
    xPath: `//*[contains(text(), '$${PLACEHOLDERS.JOIN_NOW}')]`,
    options: {
      member: false,
    }
  },

  [PLACEHOLDERS.FIRST_NAME]: {
    xPath: `//*[contains(text(),'$${PLACEHOLDERS.FIRST_NAME}')]`,
    options: {
      cookie: 'firstName',
      member: true,
    }
  },
};


function parsePlaceholders(placeholders) {
  const result = {}
  placeholders?.data?.forEach((placeholder) => {
    result[placeholder['key']] = placeholder['value'];
  });

  return {...DEFAULT_PLACEHOLDERS, ...result};
}

function getNodesByXPath(query, context = document) {
  const nodes = [];
  const xpathResult = document.evaluate(query, context);
  let current = xpathResult?.iterateNext();
  while(current) {
    nodes.push(current);
    current = xpathResult.iterateNext();
  }
  return nodes;
}

function getNodeByXPath(query, context = document) {
  const xpathResult = document.evaluate(query, context); 
  return xpathResult?.iterateNext();
}

function shouldPersonalize() {
  const shouldPersonalizeGnav = isMember();
  const personalizePageElements = [];
  Object.entries(PAGE_PERSONALIZATION_CONFIG).forEach(([key, value]) => {
    const elements = getNodesByXPath(value.xPath)
      .map((el) => {
        return {
          placeholderKey: key,
          el,
          options: value.options
        }
      });
    personalizePageElements.push(...elements)
  });

  return { shouldPersonalizeGnav, personalizePageElements };
}

function personalizeElement(el, placeholder, options) {
  const partnerData = getPartnerDataCookieObject(getCurrentProgramType());
  const { placeholderKey, placeholderValue } = placeholder;
  const { conditions, target, cookie, member } = options;

  const condition = conditions && Object.entries(conditions)?.every(([key, value]) => {
    if (Array.isArray(value)) {
      return value.includes(partnerData[key]);
    }
    return value === partnerData[key];
  });

  if (condition === false || member !== isMember()) {
    const targetElement = el[target] ?? el;
    targetElement.remove();
    return;
  }

  el.textContent = el.textContent?.replace(`$${placeholderKey}`, placeholderValue ?? partnerData[cookie]);
}

function personalizePage(placeholders, elementObjects) {
  elementObjects.forEach((object) => { 
    const { el, options } = object;
    const placeholder = {
      placeholderKey: object.placeholderKey,
      placeholderValue: placeholders[object.placeholderKey]

    }
    personalizeElement(el, placeholder, options)
  })
}

function personalizeGnav(placeholders, localePrefix) {
  const gnavMeta = document.querySelector('meta[name="gnav-source"]');
  if (!gnavMeta) return;

  const gnavLoggedIn = document.querySelector('meta[name="gnav-loggedin-source"]');
  gnavMeta.content = gnavLoggedIn?.content ?? `${localePrefix}/edsdme/partners-shared/loggedin-gnav`;

  const nav = document.querySelector('header');
  let changes = 0;
  const observer = new MutationObserver((_, observer) => {
    Object.entries(GNAV_PERSONALIZATION_CONFIG).forEach(([key,value]) => {
      const el = getNodeByXPath(value.xPath, nav);
      if (!el) return;
      const placeholder = {
        placeholderKey: key,
        placeholderValue: placeholders[key]

      }
      personalizeElement(el, placeholder, value.options);
      changes++;
    });

    if (changes === 4) {
      observer.disconnect();
    }
  });
  observer.observe(nav, {childList: true, subtree: true});
}

export async function applyPersonalization(localePrefix) {
  const { shouldPersonalizeGnav, personalizePageElements } = shouldPersonalize();
  if (!shouldPersonalizeGnav && !personalizePageElements.length) return;

  let placeholders = {};
  const placeholdersReq = await fetch(`${localePrefix}/edsdme/partners-shared/personalization-placeholders.json`);
  try {
    placeholders = await placeholdersReq.json();
  } catch (_) {
    console.log('Couldn\'t fetch personalization placeholders');
  }

  const parsedPlaceholders = parsePlaceholders(placeholders);
  if (personalizePageElements.length) {
    personalizePage(parsedPlaceholders, personalizePageElements);
  }

  if (shouldPersonalizeGnav) {
    personalizeGnav(parsedPlaceholders, localePrefix);
  }
}


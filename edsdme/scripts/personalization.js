import {
  getCurrentProgramType,
  getPartnerDataCookieValue,
  isMember,
  partnerIsSignedIn,
  getPartnerDataCookieObject,
  signedInNonMember,
  isReseller,
  hasSalesCenterAccess,
  getNodesByXPath,
  isRenew,
}
  from './utils.js';
import { getConfig } from '../blocks/utils/utils.js';

const PAGE_PERSONALIZATION_PLACEHOLDERS = { firstName: '//*[contains(text(), "$firstName")]' };
const GNAV_PERSONALIZATION_PLACEHOLDERS = {
  company: '//*[contains(text(), "$company")]',
  level: '//*[contains(text(), "$level")]',
};

const LEVEL_CONDITION = 'partner-level';
const PERSONALIZATION_MARKER = 'partner-personalization';
const PROCESSED_MARKER = '-processed';
const PERSONALIZATION_HIDE = 'personalization-hide';
const PROGRAM = getCurrentProgramType();
const PARTNER_LEVEL = getPartnerDataCookieValue(PROGRAM, 'level');
const COOKIE_OBJECT = getPartnerDataCookieObject(PROGRAM);

const PERSONALIZATION_CONDITIONS = {
  'partner-not-member': signedInNonMember(),
  'partner-not-signed-in': !partnerIsSignedIn(),
  'partner-all-levels': isMember(),
  'partner-reseller': isReseller(PARTNER_LEVEL),
  'partner-sales-access': hasSalesCenterAccess(),
  'partner-level': (level) => PARTNER_LEVEL === level,
};

function personalizePlaceholders(placeholders, context = document) {
  Object.entries(placeholders).forEach(([key, value]) => {
    const placeholderValue = COOKIE_OBJECT[key];
    getNodesByXPath(value, context).forEach((el) => {
      if (!placeholderValue) {
        el.remove();
        return;
      }
      el.textContent = el.textContent.replace(`$${key}`, placeholderValue);
      el.classList.add(`${key.toLowerCase()}-placeholder`);
    });
  });
}

function shouldHide(conditions, conditionsConfig = PERSONALIZATION_CONDITIONS) {
  return conditions.every((condition) => {
    const conditionLevel = condition.startsWith(LEVEL_CONDITION) ? condition.split('-').pop() : '';
    return conditionLevel
      ? !conditionsConfig[LEVEL_CONDITION](conditionLevel) : !conditionsConfig[condition];
  });
}

// eslint-disable-next-line max-len
function hideElement(element, conditions, conditionsConfig = PERSONALIZATION_CONDITIONS, remove = false) {
  if (!element || !conditions?.length) return;
  if (shouldHide(conditions, conditionsConfig)) {
    if (remove) {
      element.remove();
    } else {
      element.classList.add(PERSONALIZATION_HIDE);
    }
  }
}

function hideSections(page) {
  const sections = Array.from(page.getElementsByClassName('section-metadata'));
  sections.forEach((section) => {
    let hide = false;
    Array.from(section.children).forEach((child) => {
      const col1 = child.firstElementChild;
      const col2 = child.lastElementChild;
      if (col1?.textContent !== 'style' || !col2?.textContent.includes(PERSONALIZATION_MARKER)) return;
      const conditions = col2?.textContent?.split(',').map((text) => text.trim());
      hide = shouldHide(conditions);
    });
    if (!hide) return;
    const parent = section.parentElement;
    Array.from(parent.children).forEach((el) => {
      el.remove();
    });
  });
}

function personalizePage(page) {
  const blocks = Array.from(page.getElementsByClassName(PERSONALIZATION_MARKER));
  blocks.forEach((el) => {
    const conditions = Object.values(el.classList);
    hideElement(el, conditions);
    el.classList.remove(PERSONALIZATION_MARKER);
    el.classList.add(`${PERSONALIZATION_MARKER}${PROCESSED_MARKER}`);
  });
  hideSections(page);
}

export function applyPagePersonalization() {
  const main = document.querySelector('main') ?? document;
  personalizePlaceholders(PAGE_PERSONALIZATION_PLACEHOLDERS, main);
  personalizePage(main);
}

function processPrimaryContact(el) {
  const isPrimary = COOKIE_OBJECT.primaryContact;
  el.classList.add(PERSONALIZATION_HIDE);
  if (!isPrimary) return;
  const primaryContactWrapper = document.createElement('div');
  const primaryContact = document.createElement('p');
  primaryContact.textContent = el.textContent;
  primaryContactWrapper.classList.add('primary-contact-wrapper');
  primaryContactWrapper.appendChild(primaryContact);
  el.replaceWith(primaryContactWrapper);
}

function processRenew(profile) {
  const { env } = getConfig();
  const renew = isRenew();
  const renewElements = Array.from(profile.querySelectorAll('.partner-renew'));
  renewElements.forEach((el) => {
    el.classList.add(PERSONALIZATION_HIDE);
    if (!renew) return;
    const { accountStatus } = renew;
    if (el.classList.contains(`partner-${accountStatus}`)) {
      el.classList.remove(PERSONALIZATION_HIDE);
    }
    if (env.name !== 'prod') {
      const anchor = el.querySelector('a');
      const url = new URL(anchor.href);
      url.hostname = 'channelpartners.stage2.adobe.com';
      anchor.href = url;
    }
  });
}

function processSalesAccess(el) {
  const salesAccess = hasSalesCenterAccess();
  const element = el.parentElement;
  if (!salesAccess) {
    element.classList.add(PERSONALIZATION_HIDE);
    return;
  }
  const divider = document.createElement('hr');
  element.insertBefore(divider, el);
}

function processAccountManagement(el) {
  const { env } = getConfig();
  if (env.name !== 'prod') {
    const url = new URL(el.href);
    url.hostname = 'channelpartners.stage2.adobe.com';
    el.href = url;
  }
}

function processGnavElements(elements) {
  const regex = /(?<=\().*?(?=\))/g;
  return elements.map((el) => {
    const matches = el.textContent.match(regex);
    if (!matches?.length) return {};
    const match = matches[0];
    el.textContent = el.textContent.replace(`(${match})`, '');
    const conditions = match.split(',').map((condition) => condition.trim());
    if (!conditions.length) return {};
    return { el, conditions };
  });
}

const PROFILE_PERSONALIZATION_ACTIONS = {
  'partner-primary': (el) => processPrimaryContact(el),
  'partner-sales-access': (el) => processSalesAccess(el),
  'partner-account-management': (el) => processAccountManagement(el),
};

function personalizeDropdownElements(profile) {
  const personalizationXPath = `//*[contains(text(), "${PERSONALIZATION_MARKER}")]`;
  const elements = getNodesByXPath(personalizationXPath, profile);
  const processedElements = processGnavElements(elements);
  processedElements.forEach(({ el, conditions }) => {
    if (!el || !conditions) return;
    const action = conditions.pop();
    PROFILE_PERSONALIZATION_ACTIONS[action]?.(el);
  });
}

const MAIN_NAV_PERSONALIZATION_CONDITIONS = {
  ...PERSONALIZATION_CONDITIONS,
  'partner-sales-access': hasSalesCenterAccess(),
};

function personalizeMainNav(gnav) {
  const personalizationXPath = `//*[contains(text(), "${PERSONALIZATION_MARKER}") and not(ancestor::*[contains(@class, "profile")])]`;
  const elements = getNodesByXPath(personalizationXPath, gnav);
  const processedElements = processGnavElements(elements);
  const separatorSelector = 'h5';

  processedElements.forEach(({ el, conditions }) => {
    if (!el || !conditions) return;

    if (el.tagName.toLowerCase() === separatorSelector) {
      // main nav dropdown menu group separators
      const { nextElementSibling } = el;
      const hide = shouldHide(conditions, MAIN_NAV_PERSONALIZATION_CONDITIONS);
      if (nextElementSibling?.tagName.toLowerCase() !== separatorSelector && hide) {
        nextElementSibling.remove();
      }
    }

    const wrapperEl = el.closest('h2, li');
    hideElement(wrapperEl || el, conditions, MAIN_NAV_PERSONALIZATION_CONDITIONS, true);
  });

  // link group blocks
  const linkGroups = gnav.querySelectorAll('.link-group.partner-personalization');
  Array.from(linkGroups).forEach((el) => {
    const conditions = Object.values(el.classList);
    hideElement(el, conditions, MAIN_NAV_PERSONALIZATION_CONDITIONS, true);
  });
}

function personalizeProfile(gnav) {
  const profile = gnav.querySelector('.profile');
  personalizePlaceholders(GNAV_PERSONALIZATION_PLACEHOLDERS, profile);
  personalizeDropdownElements(profile);
  processRenew(profile);
}

export function applyGnavPersonalization(gnav) {
  if (!isMember()) return gnav;
  const importedGnav = document.importNode(gnav, true);
  personalizeMainNav(importedGnav);
  personalizeProfile(importedGnav);
  return importedGnav;
}

import {
  getCurrentProgramType,
  getPartnerDataCookieValue,
  isMember,
  partnerIsSignedIn,
  getPartnerDataCookieObject,
  signedInNonMember,
  isReseller,
  getNodesByXPath,
  isRenew,
}
  from './utils.js';
import { getConfig } from '../blocks/utils/utils.js';
import { CONFIG } from '../blocks/partners-navigation/partners-navigation.js';
import { getMainNavItems } from '../blocks/partners-navigation/utilities/utilities.js';

const PAGE_PERSONALIZATION_PLACEHOLDERS = { firstName: '//*[contains(text(), "$firstName")]' };
const GNAV_PERSONALIZATION_PLACEHOLDERS = {
  company: '//*[contains(text(), "$company")]',
  level: '//*[contains(text(), "$level")]',
};

const LEVEL_CONDITION = 'partner-level';
const REGION_CONDITION = 'region';
const PERSONALIZATION_MARKER = 'partner-personalization';
const PERSONALIZATION_HIDE = 'personalization-hide';
const PROGRAM = getCurrentProgramType();
const PARTNER_LEVEL = getPartnerDataCookieValue(PROGRAM, 'level');
const COOKIE_OBJECT = getPartnerDataCookieObject(PROGRAM);

const PERSONALIZATION_CONDITIONS = {
  'partner-not-member': signedInNonMember(),
  'partner-not-signed-in': !partnerIsSignedIn(),
  'partner-all-levels': isMember(),
  'partner-reseller': isReseller(PARTNER_LEVEL),
  'partner-level': (level) => PARTNER_LEVEL === level,
  'region': (region) => getConfig()?.locale?.region === region,
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

function shouldHide(conditions) {
  return conditions.every((condition) => {
    const conditionLevel = condition.startsWith(LEVEL_CONDITION) ? condition.split('-').pop() : '';
    if (conditionLevel) return !PERSONALIZATION_CONDITIONS[LEVEL_CONDITION](conditionLevel);
    const region = condition.startsWith(REGION_CONDITION) ? condition.split('-').pop() : '';
    if (region) return !PERSONALIZATION_CONDITIONS[REGION_CONDITION](region);
    return !PERSONALIZATION_CONDITIONS[condition];
  });
}

function hideElement(element, conditions, remove = false) {
  if (!element || !conditions?.length) return;
  if (shouldHide(conditions)) {
    if (remove) {
      element.remove();
    } else {
      element.classList.add(PERSONALIZATION_HIDE)
    }
  }
}

function hideSections(page) {
  const sections = Array.from(page.getElementsByClassName('section-metadata'));
  sections.forEach((section) => {
    let hide = false;
    Array.from(section.children).forEach((child) => {
      const col1 = child.firstElementChild;
      let col2 = child.lastElementChild;
      if (col1?.textContent !== 'style' || !col2?.textContent.includes(PERSONALIZATION_MARKER)) return;
      const conditions = col2?.textContent?.split(',').map((text) => text.trim());
      hide = shouldHide(conditions);
    });
    if (!hide) return;
    const parent = section.parentElement;
    Array.from(parent.children).forEach((el) => {
      el.classList.add(PERSONALIZATION_HIDE);
    });
  });
}

function personalizePage(page) {
  const blocks = Array.from(page.getElementsByClassName(PERSONALIZATION_MARKER));
  blocks.forEach((el) => {
    const conditions = Object.values(el.classList);
    hideElement(el, conditions);
  });
  hideSections(page);
}

export function applyPagePersonalization() {
  const main = document.querySelector('main') ?? document;
  personalizePlaceholders(PAGE_PERSONALIZATION_PLACEHOLDERS, main);
  personalizePage(main);
}

function processPrimaryContact(el) {
  const isPrimary = COOKIE_OBJECT['primaryContact'];
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
  const salesAccess = COOKIE_OBJECT['salesCenterAccess'];
  const element = el.parentElement;
  if (!salesAccess) {
    element.classList.add(PERSONALIZATION_HIDE);
    return;
  }
  const { env } = getConfig();
  if (env.name !== 'prod') {
    const url = new URL(el.href);
    url.hostname = 'adobe--sfstage.sandbox.my.site.com';
    el.href = url;
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
    const match = el.textContent.match(regex)[0];
    if (!match) return {};
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue.replace(`(${match})`, '');
      }
    });
    const conditions = match.split(',').map((condition) => condition.trim());
    if (!conditions.length) return {};
    return { el, conditions }
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
  processedElements.forEach(({el, conditions}) => {
    if (!el || !conditions) return;
    const action = conditions.pop();
    PROFILE_PERSONALIZATION_ACTIONS[action]?.(el);
  });
}

function personalizeMainNavMenu(item) {
  // links
  const links = item.querySelectorAll('a');
  let elements = Array.from(links).filter(item => {
    return item.textContent.includes(PERSONALIZATION_MARKER);
  });
  const processedLinks = processGnavElements(elements);
  processedLinks.forEach(({ el, conditions }) => {
    if (!el || !conditions) return;
    const listItem = el.closest('li');
    hideElement(listItem || el, conditions, true);
  });

  // link group block
  const linkGroups = item.querySelectorAll('.link-group');
  elements = Array.from(linkGroups).filter(item => {
    return item.className.includes(PERSONALIZATION_MARKER);
  });
  elements.forEach((el) => {
    const conditions = Object.values(el.classList);
    hideElement(el, conditions, true);
  });
}

function personalizeMainNav(gnav) {
  const items = getMainNavItems(gnav, CONFIG.features);

  items.forEach((item) => {
    const itemTopParent = item.closest('div');
    const hasSyncDropdown = itemTopParent instanceof HTMLElement
      && itemTopParent.childElementCount > 1;
    if (hasSyncDropdown) {
      personalizeMainNavMenu(itemTopParent);
    }
  });

  const personalizedItems = Array.from(items).filter(item => {
    return item.textContent.includes(PERSONALIZATION_MARKER);
  });
  const processedElements = processGnavElements(personalizedItems);
  processedElements.forEach(({ el, conditions }) => {
    if (!el || !conditions) return;
    hideElement(el, conditions, true);
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


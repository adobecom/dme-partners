import {
  getCurrentProgramType,
  getPartnerDataCookieValue,
  isMember,
  partnerIsSignedIn,
  getPartnerDataCookieObject,
  signedInNonMember,
  isReseller,
  getNodesByXPath,
  isRenew
}
  from './utils.js';

const PAGE_PERSONALIZATION_PLACEHOLDERS = { firstName: '//*[contains(text(), "$firstName")]' };
const GNAV_PERSONALIZATION_PLACEHOLDERS = { 
  company: '//*[contains(text(), "$company")]',
  level: '//*[contains(text(), "$level")]'
};

const LEVEL_CONDITION = 'partner-level';
const PERSONALIZATION_MARKER = 'partner-personalization';
const PERSONALIZATION_HIDE = 'personalization-hide';
const PROGRAM = getCurrentProgramType();
const PARTNER_LEVEL = getPartnerDataCookieValue(PROGRAM, 'level');
const COOKIE_OBJECT = getPartnerDataCookieObject(PROGRAM);

const PERSONALIZATION_CONDITIONS = {
  'partner-not-member': signedInNonMember(),
  'partner-not-signed-in': !partnerIsSignedIn(),
  'partner-all-levels': isMember(),
  'partner-reseller': isReseller (PARTNER_LEVEL),
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

function shouldHide(conditions) {
  return conditions.every((condition) => {
    const conditionLevel = condition.startsWith(LEVEL_CONDITION) ? condition.split('-').pop() : '';
    return conditionLevel
      ? !PERSONALIZATION_CONDITIONS[LEVEL_CONDITION](conditionLevel) : !PERSONALIZATION_CONDITIONS[condition];
  });
}

function hideElement(element, conditions) {
  if (!element || !conditions?.length) return;
  shouldHide(conditions) && element.classList.add(PERSONALIZATION_HIDE);
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
  const renew = isRenew();
  const renewElements = Array.from(profile.querySelectorAll('.partner-renew'));
  renewElements.forEach((el) => {
    el.classList.add(PERSONALIZATION_HIDE);
    if (!renew) return;
    const { accountStatus } = renew;
    if (el.classList.contains(`partner-${accountStatus}`)) {
      el.classList.remove(PERSONALIZATION_HIDE);
    }
  });
}

function processSalesAccess(el) {
  const salesAccess = COOKIE_OBJECT['salesCenterAccess'];
  const element = el.parentElement;
  if (!salesAccess) {
    element.classList.add(PERSONALIZATION_HIDE);
    return;
  };
  const divider = document.createElement('hr');
  element.insertBefore(divider, el);
}

function processGnavElements(elements) {
  const regex = /(?<=\().*?(?=\))/g;
  return elements.map((el) => {
    const match = el.textContent.match(regex)[0];
    if (!match) return {};
    el.textContent = el.textContent.replace(`(${match})`, '');
    const conditions = match.split(',').map((condition) => condition.trim());
    if (!conditions.length) return {};
    return { el, conditions }
  });
}

const PROFILE_PERSONALIZATION_ACTIONS = {
  'partner-primary': (el) => processPrimaryContact(el),
  'partner-sales-access': (el) => processSalesAccess(el),
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

function personalizeProfile(gnav) {
  const profile = gnav.querySelector('.profile');
  personalizePlaceholders(GNAV_PERSONALIZATION_PLACEHOLDERS, profile);
  personalizeDropdownElements(profile);
  processRenew(profile);
}

export function applyGnavPersonalization(gnav) {
  if (!isMember()) return;
  personalizeProfile(gnav);
}


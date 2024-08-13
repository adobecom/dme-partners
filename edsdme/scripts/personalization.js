import {
  getCurrentProgramType,
  getPartnerDataCookieValue,
  isMember,
  partnerIsSignedIn,
  getPartnerDataCookieObject,
  signedInNonMember,
  isReseller ,
}
  from './utils.js';

const PAGE_PERSONALIZATION_PLACEHOLDERS = { firstName: '//*[contains(text(), "$firstName")]' };

const LEVEL_CONDITION = 'partner-level';
const PERSONALIZATION_MARKER = 'partner-personalization';
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

export function getNodesByXPath(query, context = document) {
  const nodes = [];
  const xpathResult = document.evaluate(query, context);
  let current = xpathResult?.iterateNext();
  while (current) {
    nodes.push(current);
    current = xpathResult.iterateNext();
  }
  return nodes;
}

function personalizePlaceholders(placeholders, context = document) {
  Object.entries(placeholders).forEach(([key, value]) => {
    const placeholderValue = COOKIE_OBJECT[key];
    getNodesByXPath(value, context).forEach((el) => {
      if (!placeholderValue) el.remove();
      el.textContent = el.textContent.replace(`$${key}`, placeholderValue);
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
  shouldHide(conditions) && element.classList.add('personalization-hide');
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
      el.classList.add('personalization-hide');
    });
  });
}


function personalizePage(page) {
  const blocks = Array.from(page.getElementsByClassName(PERSONALIZATION_MARKER));
  hideSections(page);
  blocks.forEach((el) => {
    const conditions = Object.values(el.classList);
    hideElement(el, conditions);
  });
}

export function applyPagePersonalization() {
  const main = document.querySelector('main') ?? document;
  personalizePlaceholders(PAGE_PERSONALIZATION_PLACEHOLDERS, main);
  personalizePage(main);
}

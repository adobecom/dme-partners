import { processPrimaryContact, processSalesAccess } from './personalizationUtils.js';
import {
  hasSalesCenterAccess,
  isMember,
  isReseller,
  partnerIsSignedIn,
  signedInNonMember,
} from './utils.js';
import { PARTNER_LEVEL } from '../blocks/utils/dmeConstants.js';

export const PAGE_PERSONALIZATION_PLACEHOLDERS = { firstName: '//*[contains(text(), "$firstName")]' };
export const GNAV_PERSONALIZATION_PLACEHOLDERS = {
  company: '//*[contains(text(), "$company")]',
  level: '//*[contains(text(), "$level")]',
};

export const LEVEL_CONDITION = 'partner-level';
export const PERSONALIZATION_MARKER = 'partner-personalization';
export const PROCESSED_MARKER = '-processed';

export const PERSONALIZATION_CONDITIONS = {
  'partner-not-member': signedInNonMember(),
  'partner-not-signed-in': !partnerIsSignedIn(),
  'partner-all-levels': isMember(),
  'partner-reseller': isReseller(PARTNER_LEVEL),
  'partner-sales-access': hasSalesCenterAccess(),
  'partner-level': (level) => PARTNER_LEVEL === level,
};

export const MAIN_NAV_PERSONALIZATION_CONDITIONS = {
  ...PERSONALIZATION_CONDITIONS,
  'partner-sales-access': hasSalesCenterAccess(),
};

export const PROFILE_PERSONALIZATION_ACTIONS = {
  'partner-primary': processPrimaryContact,
  'partner-sales-access': processSalesAccess,
};

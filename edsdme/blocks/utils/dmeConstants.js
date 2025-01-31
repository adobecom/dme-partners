import { getCurrentProgramType, getPartnerDataCookieValue } from '../../scripts/utils.js';

export const RT_SEARCH_ACTION_PATH = '/api/v1/web/dx-partners-runtime/search-apc/search-apc?';

export const PROGRAM = getCurrentProgramType();
export const PARTNER_LEVEL = getPartnerDataCookieValue(PROGRAM, 'level');

/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';

const PERSONALIZATION_HIDE_CLASS = 'personalization-hide';

function importModules() {
  const utils = require('../../edsdme/scripts/utils.js');
  const placeholderElement = document.querySelector('#welcome-firstname');
  jest.spyOn(utils, 'getNodesByXPath').mockImplementation(() => [placeholderElement]);
  const { applyPagePersonalization } = require('../../edsdme/scripts/personalization.js');

  return applyPagePersonalization;
}

describe('Test utils.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname:'/channelpartners',
      },
      writable: true
    });
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/personalization.html'),
      'utf8'
    );
    document.cookie = 'partner_data=';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });
  it('Populate placeholder if user is a member', () => {
    jest.isolateModules(() => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
          firstName: 'Test user'
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const placeholderElementAfter = document.querySelector('#welcome-firstname');
      expect(placeholderElementAfter.textContent.includes(cookieObject.CPP.firstName)).toBe(true);
    });
  });
  it('Remove placeholder if user is not a member', () => {
    jest.isolateModules(() => {
      const cookieObject = {
        SPP: {
          status: 'MEMBER',
          firstName: 'Test use'
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const placeholderElementAfter = document.querySelector('#welcome-firstname');
      expect(placeholderElementAfter).toBe(null);
    });
  });
  it('Show partner-not-signed-in block', () => {
    jest.isolateModules(() => {
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const notSignedInBlock = document.querySelector('.partner-not-signed-in');
      expect(notSignedInBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(false);
    });
  });

  it('Show partner-not-member block', () => {
    jest.isolateModules(() => {
      const cookieObject = {
        SPP: {
          status: 'MEMBER',
          firstName: 'Test use'
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const notMemberBlock = document.querySelector('.partner-not-member');
      expect(notMemberBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(false);
    });
  });
  it('Show partner-all-levels block', () => {
    jest.isolateModules(() => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
          firstName: 'Test use',
          level: 'Gold'
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const allLevelsBlock = document.querySelector('.partner-all-levels');
      expect(allLevelsBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(false);
    });
  });
  it('Show partner-level-gold block', () => {
    jest.isolateModules(() => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
          firstName: 'Test use',
          level: 'Gold'
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const goldBlock = document.querySelector('.partner-level-gold');
      expect(goldBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(false);
    });
  });
  it('Show partner-level-platinum but don\'t show partner-level-gold block', () => {
    jest.isolateModules(() => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
          firstName: 'Test use',
          level: 'Platinum'
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const goldBlock = document.querySelector('.partner-level-gold');
      const platinumBlock = document.querySelector('.partner-level-platinum');
      expect(platinumBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(false);
      expect(goldBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(true);
    });
  });
  it('Show partner-level-platinum section', () => {
    jest.isolateModules(() => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
          firstName: 'Test use',
          level: 'Platinum'
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const applyPagePersonalization = importModules();
      applyPagePersonalization();
      const platinumBlock = document.querySelector('#platinum-section');
      expect(platinumBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(false);
    });
  });
});


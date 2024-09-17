/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';

const PERSONALIZATION_HIDE_CLASS = 'personalization-hide';

function importModules(mockGetNodesByXPath = true) {
  const utils = require('../../edsdme/scripts/utils.js');

  if (mockGetNodesByXPath) {
    const placeholderElement = document.querySelector('#welcome-firstname');
    jest.spyOn(utils, 'getNodesByXPath').mockImplementation(() => [placeholderElement]);
  }

  const { applyPagePersonalization, applyGnavPersonalization } = require('../../edsdme/scripts/personalization.js');
  jest.mock('../../edsdme/blocks/utils/utils.js', () => ({ getConfig: jest.fn(() => ({ env: { name: 'prod' } })) }));

  return { applyPagePersonalization, applyGnavPersonalization };
}

describe('Test personalization.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window = Object.create(window);
    Object.defineProperties(window, {
      location: {
        value: { pathname: '/channelpartners', hostname: 'partners.adobe.com' },
        writable: true,
      },
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

  describe('applyPagePersonalization()', () => {
    it('Populate placeholder if user is a member', () => {
      jest.isolateModules(() => {
        const cookieObject = {
          CPP: {
            status: 'MEMBER',
            firstName: 'Test user'
          }
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyPagePersonalization } = importModules();
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
            firstName: 'Test user'
          }
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyPagePersonalization } = importModules();
        applyPagePersonalization();
        const placeholderElementAfter = document.querySelector('#welcome-firstname');
        expect(placeholderElementAfter).toBe(null);
      });
    });
    it('Show partner-not-signed-in block', () => {
      jest.isolateModules(() => {
        const { applyPagePersonalization } = importModules();
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
            firstName: 'Test user'
          }
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyPagePersonalization } = importModules();
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
            firstName: 'Test user',
            level: 'Gold'
          }
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyPagePersonalization } = importModules();
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
            firstName: 'Test user',
            level: 'Gold'
          }
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyPagePersonalization } = importModules();
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
            firstName: 'Test user',
            level: 'Platinum'
          }
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyPagePersonalization } = importModules();
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
            firstName: 'Test user',
            level: 'Platinum'
          }
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyPagePersonalization } = importModules();
        applyPagePersonalization();
        const platinumBlock = document.querySelector('#platinum-section');
        expect(platinumBlock.classList.contains(PERSONALIZATION_HIDE_CLASS)).toBe(false);
      });
    });
  });

  describe('applyGnavPersonalization()', () => {
    beforeEach(() => {
      const gnav = fs.readFileSync(
        path.resolve(__dirname, './mocks/gnav.html'),
        'utf8',
      );
      document.body.innerHTML = gnav;
    });

    it('Should hide partner-level-platinum gnav items for non-platinum user', () => {
      jest.isolateModules(() => {
        const cookieObject = {
          CPP: {
            status: 'MEMBER',
            firstName: 'Test user',
            level: 'Silver',
          },
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyGnavPersonalization } = importModules(false);

        let platinumText = document.querySelector('#text-platinum');
        const anchorsFilterPredicate = (el) => el.textContent.includes('cta primary platinum') || el.textContent.includes('cta secondary platinum') || el.textContent.includes('link platinum');
        let anchorsArray = Array.from(document.querySelectorAll('a')).filter(anchorsFilterPredicate);

        expect(platinumText).not.toBeNull();
        expect(anchorsArray.length).toBe(3);

        const result = applyGnavPersonalization(document.body, false);

        platinumText = result.querySelector('#text-platinum');
        anchorsArray = Array.from(document.querySelectorAll('a')).filter(anchorsFilterPredicate);

        expect(platinumText).toBeNull();
        expect(anchorsArray.length).toBe(0);
      });
    });

    it('Should hide partner-sales-access gnav items for users without sales center access', () => {
      jest.isolateModules(() => {
        const cookieObject = {
          CPP: {
            status: 'MEMBER',
            firstName: 'Test user',
            level: 'Silver',
            salesCenterAccess: false,
          },
        };
        document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
        const { applyGnavPersonalization } = importModules(false);

        let heading = document.querySelector('#sales-center');
        let list = document.querySelector('#sales-center + ul');
        const anchorsFilterPredicate = (el) => el.textContent.includes('partner-sales-access');
        let anchorsArray = Array.from(document.querySelectorAll('a')).filter(anchorsFilterPredicate);

        expect(heading).not.toBeNull();
        expect(list).not.toBeNull();
        expect(anchorsArray.length).toBe(5);

        const result = applyGnavPersonalization(document.body, false);

        heading = result.querySelector('#sales-center');
        list = result.querySelector('#sales-center + ul');
        anchorsArray = Array.from(result.querySelectorAll('a')).filter(anchorsFilterPredicate);

        expect(heading).toBeNull();
        expect(list).toBeNull();
        expect(anchorsArray.length).toBe(1);
      });
    });
  });
});

/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';
import { updateFooter, updateNavigation, hasSalesCenterAccess } from '../../edsdme/scripts/utils.js';
describe('Test utils.js', () => {
  beforeEach(() => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname:'/channelpartners',
      },
      writable: true
    });
  });
  describe('Test update footer and gnav', () => {
    beforeEach(() => {
      document.head.innerHTML = fs.readFileSync(
        path.resolve(__dirname, './mocks/head.html'),
        'utf8'
      );
    });
    it('Public footer is shown for non member', async () => {
      const cookieObject = {
        SPP: {
          status: 'MEMBER',
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const footerPath =  document.querySelector('meta[name="footer-source"]')?.content
      updateFooter(locales);
      const footerPathModified =  document.querySelector('meta[name="footer-source"]')?.content
      expect(footerPath).toEqual(footerPathModified);
    });
    it('Protected footer is shown for members', async () => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const footerPath = document.querySelector('meta[name="footer-source"]')?.content;
      updateFooter(locales);
      const footerPathModified = document.querySelector('meta[name="footer-source"]')?.content;
      expect(footerPath).not.toEqual(footerPathModified);
      const protectedFooterPath = document.querySelector('meta[name="footer-loggedin-source"]')?.content;
      expect(footerPathModified).toEqual(protectedFooterPath);
    });
    it('Protected footer is fetched based on locale if footer-loggeding-source metadata is not present', async () => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      window.location.pathname = '/de/channelpartners/';
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const footerPath = document.querySelector('meta[name="footer-source"]')?.content;
      const protectedFooter = document.querySelector('meta[name="footer-loggedin-source"]');
      protectedFooter.remove();
      updateFooter(locales);
      const footerPathModified = document.querySelector('meta[name="footer-source"]')?.content;
      expect(footerPath).not.toEqual(footerPathModified);
      expect(footerPathModified).toEqual('/de/edsdme/partners-shared/loggedin-footer');
    });
    it('Public navigation is shown for non member', async () => {
      const cookieObject = {
        SPP: {
          status: 'MEMBER',
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const gnavPath =  document.querySelector('meta[name="gnav-source"]')?.content
      updateNavigation(locales);
      const gnavPathModified =  document.querySelector('meta[name="gnav-source"]')?.content
      expect(gnavPath).toEqual(gnavPathModified);
    });
    it('Protected navigation is shown for members', async () => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const gnavPath = document.querySelector('meta[name="gnav-source"]')?.content;
      updateNavigation(locales);
      const gnavPathModified = document.querySelector('meta[name="gnav-source"]')?.content;
      expect(gnavPath).not.toEqual(gnavPathModified);
      const protectedGnavPath = document.querySelector('meta[name="gnav-loggedin-source"]')?.content;
      expect(gnavPathModified).toEqual(protectedGnavPath);
    });
    it('Protected footer is fetched based on locale if gnav-loggeding-source metadata is not present', async () => {
      const cookieObject = {
        CPP: {
          status: 'MEMBER',
        }
      };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      window.location.pathname = '/de/channelpartners/';
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const gnavPath = document.querySelector('meta[name="gnav-source"]')?.content;
      const protectedGnav = document.querySelector('meta[name="gnav-loggedin-source"]');
      protectedGnav.remove();
      updateNavigation(locales);
      const gnavPathModified = document.querySelector('meta[name="gnav-source"]')?.content;
      expect(gnavPath).not.toEqual(gnavPathModified);
      expect(gnavPathModified).toEqual('/de/edsdme/partners-shared/loggedin-gnav');
    });
  });
  describe('hasSalesCenterAccess()', () => {
    it('Should have access if sales center is present in partner data cookie', async () => {
      const cookieObject = { CPP: { salesCenterAccess: true } };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      expect(hasSalesCenterAccess()).toBe(true);
    });
    it('Should not have access if sales center is not present in partner data cookie', async () => {
      const cookieObject = { CPP: { salesCenterAccess: false } };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      expect(hasSalesCenterAccess()).toBe(false);
    });
  });
});

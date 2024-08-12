/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';
import { updateFooter } from '../../edsdme/scripts/utils.js';
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
  });
});


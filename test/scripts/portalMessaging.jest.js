/**
 * @jest-environment jsdom
 */
import {
  getGlobalBanner,
  prependContent,
  getSanctionedBanner,
  getRenewBanner,
} from '../../edsdme/scripts/portalMessaging.js';
import {
  getMetadataContent,
  getCurrentProgramType,
  getPartnerCookieValue,
  getLocale,
  isRenew,
} from '../../edsdme/scripts/utils.js';

jest.mock('../../edsdme/scripts/utils.js', () => ({
  getMetadataContent: jest.fn(),
  getCurrentProgramType: jest.fn(),
  getPartnerCookieValue: jest.fn(),
  SANCTIONED_COUNTRIES: ['ru', 'by'],
  getLocale: jest.fn(() => ({ prefix: '' })),
  isRenew: jest.fn(() => null),
}));

global.fetch = jest.fn();

describe('Test portalMessaging.js', () => {
  let warnSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockReset();
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    getCurrentProgramType.mockReturnValue('vip');
    getPartnerCookieValue.mockReturnValue('us');
    getMetadataContent.mockReturnValue(null);
    getLocale.mockReturnValue({ prefix: '' });
    isRenew.mockReturnValue(null);

    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('getGlobalBanner', () => {
    it('returns undefined when metadata content is missing', async () => {
      getMetadataContent.mockReturnValue(null);

      const result = await getGlobalBanner();

      expect(result).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        'global-banner should be displayed but banner fragment path is not found',
      );
    });

    it('returns undefined when metadata content is NONE', async () => {
      getMetadataContent.mockReturnValue('NONE');

      const result = await getGlobalBanner();

      expect(result).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns undefined when metadata content is none (case-insensitive)', async () => {
      getMetadataContent.mockReturnValue('  none  ');

      const result = await getGlobalBanner();

      expect(result).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('warns and returns undefined when path does not start with /', async () => {
      getMetadataContent.mockReturnValue('relative/path');

      const result = await getGlobalBanner();

      expect(result).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith('Invalid global-banner path: relative/path');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('logs error and warns when fragment fetch fails', async () => {
      getMetadataContent.mockReturnValue('/fragments/global-banner');
      global.fetch.mockResolvedValue({ ok: false, status: 404 });

      const result = await getGlobalBanner();

      expect(result).toBeUndefined();
      expect(errorSpy).toHaveBeenCalledWith('Fetching fragment failed, status 404');
      expect(warnSpy).toHaveBeenCalledWith('Banner fragment for /fragments/global-banner not found');
    });

    it('returns banner content element on success', async () => {
      getMetadataContent.mockReturnValue('/fragments/global-banner');
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body><main><div id="banner">Banner</div></main></body></html>'),
      });

      const result = await getGlobalBanner();

      expect(result).not.toBeNull();
      expect(result.id).toBe('banner');
    });
  });

  describe('prependContent', () => {
    it('returns early when no main element exists', async () => {
      document.body.innerHTML = '';
      getMetadataContent.mockReturnValue('/fragments/global-banner');

      await prependContent();

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('prepends global banner to main when available', async () => {
      document.body.innerHTML = '<main><div id="existing">Content</div></main>';
      getMetadataContent.mockImplementation((key) => (key === 'global-banner' ? '/fragments/global-banner' : null));
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body><main><div id="banner">Banner</div></main></body></html>'),
      });

      await prependContent();

      expect(document.querySelector('main').firstElementChild.id).toBe('banner');
    });

    it('does not modify main when global banner is unavailable', async () => {
      document.body.innerHTML = '<main><div id="existing">Content</div></main>';
      getMetadataContent.mockImplementation((key) => (key === 'global-banner' ? 'NONE' : null));

      await prependContent();

      expect(document.querySelector('main').firstElementChild.id).toBe('existing');
    });

    it('prepends both global banner and sanctioned banner when available', async () => {
      document.body.innerHTML = '<main><div id="existing">Content</div></main>';
      getPartnerCookieValue.mockReturnValue('ru');
      getMetadataContent.mockImplementation((key) => {
        if (key === 'global-banner') return '/fragments/global-banner';
        return null;
      });

      global.fetch.mockImplementation((url) => {
        if (url === '/fragments/global-banner') {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve('<html><body><main><div id="global-banner">Global Banner</div></main></body></html>'),
          });
        }
        if (url === '/edsdme/partners-shared/fragments/banner-account-sanctioned') {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve('<html><body><main><div id="sanctioned-banner">Sanctioned Banner</div></main></body></html>'),
          });
        }
        return Promise.reject(new Error(`Unknown url: ${url}`));
      });

      await prependContent();

      const main = document.querySelector('main');
      expect(main.children[0].id).toBe('sanctioned-banner');
      expect(main.children[1].id).toBe('global-banner');
      expect(main.children[2].id).toBe('existing');
    });
  });

  describe('getSanctionedBanner', () => {
    it("Don't show sanctioned banner if partner has countryCode US", async () => {
      getPartnerCookieValue.mockReturnValue('us');

      const result = await getSanctionedBanner();

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('Show sanctioned banner if partner has countryCode RU', async () => {
      getPartnerCookieValue.mockReturnValue('ru');
      getMetadataContent.mockReturnValue(null);
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body><main><div class="notification">Sanctioned Banner Test</div></main></body></html>'),
      });

      const result = await getSanctionedBanner();

      expect(result).toBeTruthy();
      expect(result.classList.contains('notification')).toBe(true);
      expect(result.textContent).toEqual('Sanctioned Banner Test');
      expect(global.fetch).toHaveBeenCalledWith('/edsdme/partners-shared/fragments/banner-account-sanctioned');
    });

    it('Show sanctioned banner if partner has countryCode BY', async () => {
      getPartnerCookieValue.mockReturnValue('by');
      getMetadataContent.mockReturnValue(null);
      getLocale.mockReturnValue({ prefix: '/de' });
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body><main><div class="notification">Sanctioned BY Test</div></main></body></html>'),
      });

      const result = await getSanctionedBanner();

      expect(result).toBeTruthy();
      expect(result.classList.contains('notification')).toBe(true);
      expect(result.textContent).toEqual('Sanctioned BY Test');
      expect(global.fetch).toHaveBeenCalledWith('/de/edsdme/partners-shared/fragments/banner-account-sanctioned');
    });

    it('Use custom metadata path for sanctioned banner if present', async () => {
      getPartnerCookieValue.mockReturnValue('ru');
      getMetadataContent.mockReturnValue('/custom/path/to/sanctioned-banner');
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body><main><div id="sanctioned-banner">Custom Path Banner</div></main></body></html>'),
      });

      const result = await getSanctionedBanner();

      expect(result).toBeTruthy();
      expect(result.id).toBe('sanctioned-banner');
      expect(result.textContent).toEqual('Custom Path Banner');
      expect(global.fetch).toHaveBeenCalledWith('/custom/path/to/sanctioned-banner');
    });

    it('Sanctioned banner fetch error', async () => {
      getPartnerCookieValue.mockReturnValue('ru');
      getMetadataContent.mockReturnValue(null);
      global.fetch.mockResolvedValue({ ok: false, status: 404 });

      const result = await getSanctionedBanner();

      expect(result).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith('Fetching fragment failed, status 404');
      expect(warnSpy).toHaveBeenCalledWith(
        'Banner fragment for /edsdme/partners-shared/fragments/banner-account-sanctioned not found',
      );
    });
  });

  describe('getRenewBanner', () => {
    it('returns early for sanctioned country', async () => {
      getPartnerCookieValue.mockReturnValue('ru');
      isRenew.mockReturnValue({ accountStatus: 'expired', daysNum: '5' });

      const result = await getRenewBanner();

      expect(result).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns early when renew data is missing', async () => {
      getPartnerCookieValue.mockReturnValue('us');
      isRenew.mockReturnValue(null);

      const result = await getRenewBanner();

      expect(result).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('injects expired renewal banner into main and replaces $daysNum', async () => {
      document.body.innerHTML = '<main><div id="existing">Existing</div></main>';
      getPartnerCookieValue.mockReturnValue('us');
      getLocale.mockReturnValue({ prefix: '' });
      getMetadataContent.mockReturnValue(null);
      isRenew.mockReturnValue({ accountStatus: 'expired', daysNum: '7' });

      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<div class="notification">Expires in $daysNum days</div>'),
      });

      const result = await getRenewBanner();

      expect(result).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost/edsdme/partners-shared/fragments/banner-account-expires.plain.html',
      );

      const main = document.querySelector('main');
      expect(main.firstElementChild.querySelector('.notification')).toBeTruthy();
      expect(main.textContent).toContain('Expires in 7 days');
    });

    it('uses metadata path when present (suspended)', async () => {
      document.body.innerHTML = '<main><div id="existing">Existing</div></main>';
      getPartnerCookieValue.mockReturnValue('us');
      isRenew.mockReturnValue({ accountStatus: 'suspended', daysNum: '3' });
      getMetadataContent.mockImplementation((key) => {
        if (key === 'banner-account-suspended') return '/custom/suspended-banner';
        return null;
      });

      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<div class="notification">Suspended for $daysNum days</div>'),
      });

      await getRenewBanner();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost/custom/suspended-banner.plain.html');
      expect(document.querySelector('main').textContent).toContain('Suspended for 3 days');
    });

    it('returns null and logs error when renew fetch fails', async () => {
      document.body.innerHTML = '<main></main>';
      getPartnerCookieValue.mockReturnValue('us');
      getMetadataContent.mockReturnValue(null);
      isRenew.mockReturnValue({ accountStatus: 'expired', daysNum: '10' });

      global.fetch.mockResolvedValue({ ok: false, statusText: 'Not Found' });

      const result = await getRenewBanner();

      expect(result).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith(
        'There has been a problem with your fetch operation:',
        expect.any(Error),
      );
    });
  });
});

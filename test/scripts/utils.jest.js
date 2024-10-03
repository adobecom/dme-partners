/**
 * @jest-environment jsdom
 */
import path from 'path';
import fs from 'fs';
import {
  formatDate,
  getProgramType,
  updateFooter,
  updateNavigation,
  getProgramHomePage,
  getCurrentProgramType,
  getCookieValue,
  getPartnerDataCookieObject,
  isMember,
  getPartnerDataCookieValue,
  partnerIsSignedIn,
  signedInNonMember,
  isReseller,
  getMetadata,
  getMetadataContent,
  redirectLoggedinPartner,
  isRenew,
  hasSalesCenterAccess,
  getRenewBanner,
  updateIMSConfig,
  getLocale,
  preloadResources,
  getCaasUrl,
  getNodesByXPath,
  setLibs,
} from '../../edsdme/scripts/utils.js';

describe('Test utils.js', () => {
  beforeEach(() => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/channelpartners',
        // eslint-disable-next-line no-return-assign
        assign: (pathname) => window.location.pathname = pathname,
        origin: 'https://partners.stage.adobe.com',
        href: 'https://partners.stage.adobe.com/channelpartners',
      },
      writable: true,
    });
  });
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });
  it('Milo libs', () => {
    window.location.hostname = 'partners.stage.adobe.com';
    const libs = setLibs('/libs');
    expect(libs).toEqual('https://main--milo--adobecom.hlx.live/libs');
  });
  describe('Test update footer and gnav', () => {
    beforeEach(() => {
      document.head.innerHTML = fs.readFileSync(
        path.resolve(__dirname, './mocks/head.html'),
        'utf8',
      );
    });
    it('Public footer is shown for non member', async () => {
      const cookieObject = { SPP: { status: 'MEMBER' } };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const footerPath = document.querySelector('meta[name="footer-source"]')?.content;
      updateFooter(locales);
      const footerPathModified = document.querySelector('meta[name="footer-source"]')?.content;
      expect(footerPath).toEqual(footerPathModified);
    });
    it('Protected footer is shown for members', async () => {
      const cookieObject = { CPP: { status: 'MEMBER' } };
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
    it('Public footer is fetched based on locale', async () => {
      const cookieObject = { CPP: { status: 'NOT_MEMBER' } };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      window.location.pathname = '/de/channelpartners/';
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const footerPath = document.querySelector('meta[name="footer-source"]')?.content;
      updateFooter(locales);
      const footerPathModified = document.querySelector('meta[name="footer-source"]')?.content;
      expect(footerPath).not.toEqual(footerPathModified);
      expect(footerPathModified).toEqual('/de/edsdme/partners-shared/footer');
    });
    it('Protected footer is fetched based on locale if footer-loggeding-source metadata is not present', async () => {
      const cookieObject = { CPP: { status: 'MEMBER' } };
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
      const cookieObject = { SPP: { status: 'MEMBER' } };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const gnavPath = document.querySelector('meta[name="gnav-source"]')?.content;
      updateNavigation(locales);
      const gnavPathModified = document.querySelector('meta[name="gnav-source"]')?.content;
      expect(gnavPath).toEqual(gnavPathModified);
    });
    it('Protected navigation is shown for members', async () => {
      const cookieObject = { CPP: { status: 'MEMBER' } };
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
    it('Public gnav is fetched based on locale', async () => {
      const cookieObject = { CPP: { status: 'NOT_MEMBER' } };
      document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
      window.location.pathname = '/de/channelpartners/';
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
      };
      const gnavPath = document.querySelector('meta[name="gnav-source"]')?.content;
      updateNavigation(locales);
      const gnavPathModified = document.querySelector('meta[name="gnav-source"]')?.content;
      expect(gnavPath).not.toEqual(gnavPathModified);
      expect(gnavPathModified).toEqual('/de/edsdme/partners-shared/public-gnav');
    });
    it('Protected gnav is fetched based on locale if gnav-loggeding-source metadata is not present', async () => {
      const cookieObject = { CPP: { status: 'MEMBER' } };
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
  it('formatDate should return correct locale date string', () => {
    const cardDate = '2024-07-09T12:35:03.000Z';
    expect(formatDate(cardDate)).toEqual('Jul 9, 2024');
  });
  it('Should get correct program based on url path', () => {
    const pathSpp = '/solutionpartners/test';
    expect(getProgramType(pathSpp)).toEqual('spp');
    const pathTpp = '/technologypartners/test';
    expect(getProgramType(pathTpp)).toEqual('tpp');
    const pathCpp = '/channelpartners/test';
    expect(getProgramType(pathCpp)).toEqual('cpp');
    const invalidPath = '/invalidpartners/test';
    expect(getProgramType(invalidPath)).toEqual('');
  });
  it('Should get correct program home page based on url path', () => {
    const pathSpp = '/solutionpartners/test';
    expect(getProgramHomePage(pathSpp)).toEqual('/solutionpartners/');
    const pathTpp = '/technologypartners/test';
    expect(getProgramHomePage(pathTpp)).toEqual('/technologypartners/');
    const pathCpp = '/channelpartners/test';
    expect(getProgramHomePage(pathCpp)).toEqual('/channelpartners/');
    const invalidPath = '/invalidpartners/test';
    expect(getProgramHomePage(invalidPath)).toEqual('');
  });
  it('Should get current program based on url path', () => {
    window.location.pathname = '/channelpartners/';
    expect(getCurrentProgramType()).toEqual('cpp');
  });
  it('Should get correct cookie value for given cookie name', () => {
    document.cookie = 'test_cookie=test_value';
    expect(getCookieValue('test_cookie')).toEqual('test_value');
  });
  it('Should get empty string if cookie JSON is not valid', () => {
    document.cookie = 'partner_data={cpp: {test1:test test2:test}}';
    expect(getPartnerDataCookieValue('cpp', 'test_cookie')).toEqual('');
  });
  it('Should return partner data cookie object', () => {
    const cookieObject = { CPP: { status: 'MEMBER' } };
    document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
    expect(getPartnerDataCookieObject('cpp')).toStrictEqual(cookieObject.CPP);
  });
  it('Check if user is a member', () => {
    const cookieObjectMember = { CPP: { status: 'MEMBER' } };
    document.cookie = `partner_data=${JSON.stringify(cookieObjectMember)}`;
    expect(isMember()).toEqual(true);
    const cookieObjectNotMember = { CPP: { status: 'NOT_PARTNER' } };
    document.cookie = `partner_data=${JSON.stringify(cookieObjectNotMember)}`;
    expect(isMember()).toEqual(false);
  });
  it('Check if partner is signed id', () => {
    document.cookie = 'partner_data=test';
    expect(partnerIsSignedIn()).toBeTruthy();
  });
  it('Check if signed in partner is non member', () => {
    const cookieObjectNotMember = { CPP: { status: 'NOT_PARTNER' } };
    document.cookie = `partner_data=${JSON.stringify(cookieObjectNotMember)}`;
    expect(signedInNonMember()).toBeTruthy();
  });
  it('Check if partner is reseller', () => {
    expect(isReseller('gold')).toEqual(true);
    expect(isReseller('distributor')).toEqual(false);
  });
  it('Get meta tag content value', () => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'test';
    metaTag.content = 'test-content';
    document.head.appendChild(metaTag);
    expect(getMetadataContent('test')).toEqual('test-content');
  });
  it('Get meta tag node', () => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'test';
    metaTag.content = 'test-content';
    document.head.appendChild(metaTag);
    expect(getMetadata('test')).toStrictEqual(metaTag);
  });
  it('Don\'t redirect logged in partner to protected home if he is not a member', () => {
    const cookieObjectNotMember = { CPP: { status: 'NOT_MEMBER' } };
    document.cookie = `partner_data=${JSON.stringify(cookieObjectNotMember)}`;
    expect(redirectLoggedinPartner()).toBeFalsy();
  });
  it('Don\'t redirect logged in partner to protected home if metadata is not set', () => {
    const cookieObjectMember = { CPP: { status: 'MEMBER' } };
    document.cookie = `partner_data=${JSON.stringify(cookieObjectMember)}`;
    expect(redirectLoggedinPartner()).toBeFalsy();
  });
  it('Redirect logged in partner to protected home', () => {
    window.location.pathname = '/channelpartners/';
    const cookieObjectMember = { CPP: { status: 'MEMBER' } };
    document.cookie = `partner_data=${JSON.stringify(cookieObjectMember)}`;
    const metaTag = document.createElement('meta');
    metaTag.name = 'adobe-target-after-login';
    metaTag.content = '/channelpartners/home';
    document.head.appendChild(metaTag);
    redirectLoggedinPartner();
    expect(window.location.pathname).toEqual(metaTag.content);
  });
  it('Check if partners account is expired', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    const cookieObject = {
      CPP: {
        primaryContact: true,
        status: 'MEMBER',
        level: 'gold',
        accountAnniversary: expiredDate,
      },
    };
    document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
    const { accountStatus, daysNum } = isRenew();
    expect(accountStatus).toEqual('expired');
    expect(daysNum).toBeLessThanOrEqual(30);
  });
  it('Check if partners account is suspended', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 30);
    const cookieObject = {
      CPP: {
        primaryContact: true,
        status: 'MEMBER',
        level: 'gold',
        accountAnniversary: expiredDate,
      },
    };
    document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
    const { accountStatus, daysNum } = isRenew();
    expect(accountStatus).toEqual('suspended');
    expect(daysNum).toBeLessThanOrEqual(60);
  });
  it('Don\'t show renew banner if partner has valid account', async () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 40);
    const cookieObject = {
      CPP: {
        primaryContact: true,
        status: 'MEMBER',
        level: 'gold',
        accountAnniversary: expiredDate,
      },
    };
    document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
    expect(await getRenewBanner()).toBeFalsy();
  });
  it('Show renew banner', async () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    const cookieObject = {
      CPP: {
        primaryContact: true,
        status: 'MEMBER',
        level: 'gold',
        accountAnniversary: expiredDate,
      },
    };
    document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
    const getConfig = () => ({ locale: '' });
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      text: () => Promise.resolve('<div class="aside">Test</div>'),
    }));

    const main = document.createElement('main');
    document.body.appendChild(main);
    await getRenewBanner(getConfig, jest.fn());
    const banner = document.querySelector('.renew-banner');
    expect(banner).toBeTruthy();
  });
  it('Don\'t show renew banner', async () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 80);
    const cookieObject = {
      CPP: {
        primaryContact: true,
        status: 'MEMBER',
        level: 'gold',
        accountAnniversary: expiredDate,
      },
    };
    document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
    const getConfig = () => ({ locale: '' });
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      text: () => Promise.resolve('<div class="aside">Test</div>'),
    }));

    const main = document.createElement('main');
    document.body.appendChild(main);
    await getRenewBanner(getConfig, jest.fn());
    const banner = document.querySelector('.renew-banner');
    expect(banner).toBeFalsy();
  });
  it('Renew banner fetch error', async () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    const cookieObject = {
      CPP: {
        primaryContact: true,
        status: 'MEMBER',
        level: 'gold',
        accountAnniversary: expiredDate,
      },
    };
    document.cookie = `partner_data=${JSON.stringify(cookieObject)}`;
    const getConfig = () => ({ locale: '' });
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    const main = document.createElement('main');
    document.body.appendChild(main);
    expect(await getRenewBanner(getConfig, jest.fn())).toEqual(null);
  });
  it('Update ims config if user is not signed in', () => {
    jest.useFakeTimers();
    window.adobeIMS = {
      isSignedInUser: () => false,
      adobeIdData: {},
    };
    const metaTag = document.createElement('meta');
    metaTag.name = 'adobe-target-after-login';
    metaTag.content = '/channelpartners/home';
    document.head.appendChild(metaTag);
    updateIMSConfig();
    jest.advanceTimersByTime(1000);
    const redirectUrl = new URL(window.adobeIMS.adobeIdData.redirect_uri);
    expect(redirectUrl.pathname).toEqual(metaTag.content);
    expect(redirectUrl.searchParams.has('partnerLogin')).toEqual(true);
  });
  it('Update ims config if user is signed in', () => {
    jest.useFakeTimers();
    window.adobeIMS = {
      isSignedInUser: () => true,
      adobeIdData: {},
    };
    const metaTag = document.createElement('meta');
    metaTag.name = 'adobe-target-after-logout';
    metaTag.content = '/channelpartners/home';
    document.head.appendChild(metaTag);
    updateIMSConfig();
    jest.advanceTimersByTime(1000);
    const redirectUrl = new URL(window.adobeIMS.adobeIdData.redirect_uri);
    expect(redirectUrl.pathname).toEqual(metaTag.content);
  });
  it('Get locale', () => {
    const locales = {
      '': { ietf: 'en-US', tk: 'hah7vzn.css' },
      de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    };
    window.location.pathname = '/de/channelpartners';
    const locale = getLocale(locales);
    expect(locale).toStrictEqual({ ietf: 'de-DE', tk: 'hah7vzn.css', prefix: '/de', region: 'de' });
  });
  it('Return default locale', () => {
    const locale = getLocale();
    expect(locale).toStrictEqual({ ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' });
  });
  it('Get caas url', () => {
    document.cookie = 'partner_data={"CPP":{"accountAnniversary":1890777600000%2C"company":"Yugo CPP Stage Platinum Spain"%2C"firstName":"CPP Stage"%2C"lastName":"Spain Platinum"%2C"level":"Platinum"%2C"permissionRegion":"Europe West"%2C"primaryContact":true%2C"salesCenterAccess":true%2C"status":"MEMBER"}}';
    const locales = {
      '': { ietf: 'en-US', tk: 'hah7vzn.css' },
      de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    };
    const locale = getLocale(locales);
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/announcements.html'),
      'utf8',
    );
    const el = document.querySelector('.announcements');
    const block = {
      el,
      collectionTag: '"caas:adobe-partners/collections/announcements"',
      ietf: locale.ietf,
    };
    const caasUrl = getCaasUrl(block);
    expect(caasUrl).toEqual('https://www.adobe.com/chimera-api/collection?originSelection=dme-partners&draft=false&debug=true&flatFile=false&expanded=true&complexQuery=%28%22caas%3Aadobe-partners%2Fcollections%2Fannouncements%22%2BAND%2B%22caas%3Aadobe-partners%2Fcpp%22%2BAND%2B%22caas%3Aadobe-partners%2Fqa-content%22%29%2BAND%2B%28%22caas%3Aadobe-partners%2Fcpp%2Fregion%2Feurope-west%22%29%2BAND%2B%28%22caas%3Aadobe-partners%2Fcpp%2Fpartner-level%2Fplatinum%22%2BOR%2B%22caas%3Aadobe-partners%2Fcpp%2Fpartner-level%2Fpublic%22%29&language=en&country=US');
  });
  it('Preload resources', async () => {
    const locales = {
      '': { ietf: 'en-US', tk: 'hah7vzn.css' },
      de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    };
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, './mocks/announcements.html'),
      'utf8',
    );
    await preloadResources(locales, '/libs');
    const linkPreload = document.head.querySelectorAll('link[rel="preload"]');
    const linkModulepreload = document.head.querySelector('link[rel="modulepreload"]');
    expect(linkPreload[0].href).toContain('placeholders.json');
    expect(linkPreload[1].href).toContain('adobe.com/chimera-api');
    expect(linkModulepreload.href).toContain('lit-all.min.js');
  });
  it('Get nodes by XPath', () => {
    const testDiv = document.createElement('div');
    testDiv.textContent = 'Test123';
    testDiv.id = 'test-id';
    document.body.appendChild(testDiv);
    const query = '//*[contains(text(), "Test123")]';
    const elements = getNodesByXPath(query, document.body);
    expect(elements.length).toEqual(1);
    expect(elements[0].id).toEqual('test-id');
  });
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

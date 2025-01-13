/**
 * @jest-environment jsdom
 */
import { rewriteLinks } from '../../edsdme/scripts/rewriteLinks.js';
import { getConfig } from '../../edsdme/blocks/utils/utils.js';
import { partnerIsSignedIn } from '../../edsdme/scripts/utils.js';

jest.mock('../../edsdme/blocks/utils/utils.js', () => ({ getConfig: jest.fn() }));
jest.mock('../../edsdme/scripts/utils.js', () => ({ partnerIsSignedIn: jest.fn(() => ({ 'partner name': { company: 'test' } })) }));

// Mock DOM
document.body.innerHTML = `
  <a href="https://cbconnection.adobe.com/home/search">cbc prod Link</a>
  <a href="https://partners.adobe.com">Partner prod Link</a>
  <a href="https://cbconnection.adobe.com/bin/fusion/modalImsLogin?resource=/home/search">cbc  Login Link</a>
  <a href = 'https://cbconnection.adobe.com/en/news/enablement-news-partner-lock'></a>
`;

describe('Test rewrite links', () => {
  beforeEach(() => {
    getConfig.mockReturnValue({ env: { name: 'stage' } });
    partnerIsSignedIn.mockReturnValue({ 'partner name': { company: 'test' } });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/cn/test-path',
        href: 'http://example.com/cn/test-path',
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    document.body.innerHTML = `
  <a href="https://cbconnection.adobe.com/home/search">cbc prod Link</a>
  <a href="https://partners.adobe.com">Partner prod Link</a>
  <a href="https://cbconnection.adobe.com/bin/fusion/modalImsLogin?resource=/home/search">cbc  Login Link</a>
  <a href = 'https://cbconnection.adobe.com/en/news/enablement-news-partner-lock'></a>
`;
  });

  test('should update  prod links to cbc  stage in non-prod, with resource query param and login path,'
    + 'it should update locale if exist for cbc connection', () => {
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=%2Fhome%2Fsearch');
    expect(links[3].href).toBe('https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=%2Fzh_cn%2Fnews%2Fenablement-news-partner-lock');
  });

  test('should update only domain when login path is already there', () => {
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[2].href).toBe('https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=/home/search');
  });

  test('should  update partners prod link when on non prod', () => {
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[1].href).toBe('https://partners.stage.adobe.com/');
  });

  test('should  not update partners prod domain and cbc prod domain when on  prod.'
    + ' Should update locale if exist for cbcconnection', () => {
    getConfig.mockReturnValue({ env: { name: 'prod' } });
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[1].href).toBe('https://partners.adobe.com/');
    expect(links[3].href).toBe('https://cbconnection.adobe.com/bin/fusion/modalImsLogin?resource=%2Fzh_cn%2Fnews%2Fenablement-news-partner-lock');
  });
  test('should update partners prod domain and cbc prod domain but not login path when not logged in when on stage,'
    + 'it should update locale, if exist, for cbconnection', () => {
    partnerIsSignedIn.mockReturnValue(null);

    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/home/search');
    expect(links[1].href).toBe('https://partners.stage.adobe.com/');
    expect(links[3].href).toBe('https://cbconnection-stage.adobe.com/zh_cn/news/enablement-news-partner-lock');
  });

  test('should update locales only for domains that are in the map', () => {
    partnerIsSignedIn.mockReturnValue(null);
    document.body.innerHTML = `
  <a href="https://cbconnection.adobe.com/en/home/search/">cbc prod Link</a>
  <a href="https://partners.adobe.com/en/">Partner prod Link</a>
  <a href="https://www.adobe.com/">adobe</a>
  <a href="https://www.helpx.adobe.com/">helpx</a>
  <a href="https://www.business.adobe.com/">business</a>
  <a href="https://www.business.adobe.com/">not in list of locales</a>
  <a href="https://www.business.adobe.com/">not in list of locales</a>

`;
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/zh_cn/home/search');
    expect(links[1].href).toBe('https://partners.stage.adobe.com/en/');
    expect(links[2].href).toBe('https://www.adobe.com/cn');
    expect(links[3].href).toBe('https://www.helpx.adobe.com/cn');
    expect(links[4].href).toBe('https://www.business.adobe.com/cn');
    expect(links[5].href).toBe('https://www.business.adobe.com/cn');
    expect(links[6].href).toBe('https://www.business.adobe.com/cn');
  });
  test('should not update cbc link locale when locale mapping dont exist for current locale ', () => {
    document.body.innerHTML = `
  <a href="https://cbconnection.adobe.com/en/home/search/">cbc prod Link</a>
  <a href="https://www.business.adobe.com/">cbc prod Link</a>
`;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/pr/test-path',
        href: 'http://example.com/pr/test-path',
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
    partnerIsSignedIn.mockReturnValue(null);
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/en/home/search/');
    expect(links[1].href).toBe('https://www.business.adobe.com/');
  });
  test('should not update  link locale when current locale is na or international sites ', () => {
    document.body.innerHTML = `
  <a href="https://cbconnection.adobe.com/en/home/search/">cbc prod Link</a>
  <a href="https://www.business.adobe.com/emea">cbc prod Link</a>
`;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/latam/test-path',
        href: 'http://example.com/latam/test-path',
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
    partnerIsSignedIn.mockReturnValue(null);
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/en/home/search/');
    expect(links[1].href).toBe('https://www.business.adobe.com/emea');
  });
  test('should not update  link locale when current locale is na or international sites ', () => {
    document.body.innerHTML = `
  <a href="https://cbconnection.adobe.com/en/home/search/">cbc prod Link</a>
  <a href="https://www.business.adobe.com/emea">cbc prod Link</a>
`;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/latam/test-path',
        href: 'http://example.com/latam/test-path',
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
    partnerIsSignedIn.mockReturnValue(null);
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/en/home/search/');
    expect(links[1].href).toBe('https://www.business.adobe.com/emea');
  });

  test('should not update cbc link locale when it have different locale than en ', () => {
    document.body.innerHTML = `
  <a href="https://cbconnection.adobe.com/fr/home/search/">cbc prod Link</a>
`;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/emea/test-path',
        href: 'http://example.com/emea/test-path',
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
    partnerIsSignedIn.mockReturnValue(null);
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/fr/home/search/');
  });
  test('should  update adobe,helpx and business.adobe link locale when current page locale is emea, and for cbc '
    + 'it shouldnt be transformed ', () => {
    document.body.innerHTML = `
  <a href="https://www.business.adobe.com">cbc prod Link</a>
  <a href="https://www.helpx.adobe.com">cbc prod Link</a>
  <a href="https://www.adobe.com">cbc prod Link</a>
  <a href="https://cbconnection.adobe.com/en/home/search/">cbc prod Link</a>
`;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/emea/test-path',
        href: 'http://example.com/emea/test-path',
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
    partnerIsSignedIn.mockReturnValue(null);
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://www.business.adobe.com/uk');
    expect(links[1].href).toBe('https://www.helpx.adobe.com/uk');
    expect(links[2].href).toBe('https://www.adobe.com/uk');
    expect(links[3].href).toBe('https://cbconnection-stage.adobe.com/en/home/search/');
  });
});

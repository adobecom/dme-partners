/**
 * @jest-environment jsdom
 */
import { rewriteLinks } from '../../edsdme/scripts/rewriteLinks.js';
import { getConfig } from '../../edsdme/blocks/utils/utils.js';
import {partnerIsSignedIn} from "../../edsdme/scripts/utils.js";

jest.mock('../../edsdme/blocks/utils/utils.js', () => ({ getConfig: jest.fn() }));
jest.mock('../../edsdme/scripts/utils.js', () => ({ partnerIsSignedIn: jest.fn() }));

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
    partnerIsSignedIn.mockReturnValue({ "partner name": { company: 'test' } });
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

  test('should update  prod links to cbc  stage in non-prod, with resource query param and login path', () => {
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=%2Fhome%2Fsearch');
    expect(links[3].href).toBe('https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=%2Fen%2Fnews%2Fenablement-news-partner-lock');
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

  test('should  not update partners prod domain and cbc prod domain when on  stage', () => {
    getConfig.mockReturnValue({ env: { name: 'prod' } });
    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[1].href).toBe('https://partners.adobe.com/');
    expect(links[3].href).toBe('https://cbconnection.adobe.com/bin/fusion/modalImsLogin?resource=%2Fen%2Fnews%2Fenablement-news-partner-lock');
  });
  test('should update partners prod domain and cbc prod domain but not login path when not logged in', () => {
    partnerIsSignedIn.mockReturnValue(null);

    rewriteLinks();
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://cbconnection-stage.adobe.com/home/search');
    expect(links[1].href).toBe('https://partners.stage.adobe.com/');
    expect(links[3].href).toBe('https://cbconnection-stage.adobe.com/en/news/enablement-news-partner-lock');
  });
});

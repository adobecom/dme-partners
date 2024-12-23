/**
 * @jest-environment jsdom
 */

import { applyGnavLinkRewriting, rewriteLinkHref } from '../../edsdme/scripts/links.js';
import { getConfig } from '../../edsdme/blocks/utils/utils.js';

jest.mock('../../edsdme/blocks/utils/utils.js', () => ({ getConfig: jest.fn() }));

describe('Test links.js', () => {
  beforeEach(() => {
    getConfig.mockReturnValue({ env: { name: 'stage' } });
  });

  describe('rewriteLinkHref', () => {
    test('should return link href unchanged in production environment', () => {
      getConfig.mockReturnValue({ env: { name: 'prod' } });

      const href = 'https://adobe.force.com/path';
      const result = rewriteLinkHref(href);

      expect(result).toBe(href);
    });

    test('should rewrite sales for link hrefs', () => {
      const href = 'https://adobe.force.com/path';
      const result = rewriteLinkHref(href);

      expect(result).toBe('https://adobe--sfstage.sandbox.my.site.com/path');
    });

    test('should rewrite runtime link hrefs', () => {
      const href = 'https://io-partners-dx.adobe.com/path';
      const result = rewriteLinkHref(href);

      expect(result).toBe('https://io-partners-dx.stage.adobe.com/path');
    });

    test('should return unchanged link hrefs if invalid', () => {
      const href = 'invalid-url';
      const result = rewriteLinkHref(href);

      expect(result).toBe(href);
    });

    test('should return unchanged link hrefs if domain is not mapped', () => {
      const href = 'https://unmapped-domain.com/path';
      const result = rewriteLinkHref(href);

      expect(result).toBe(href);
    });
  });

  describe('applyGnavLinkRewriting', () => {
    const gnav = document.createElement('div');
    const gnavHTML = `
        <a href="https://adobe.force.com/path"></a>
        <a href="https://io-partners-dx.adobe.com/path"></a>
        <a href="https://unmapped-domain.com/path"></a>
      `;
    gnav.innerHTML = gnavHTML;

    test('should not rewrite links in the production environment', () => {
      getConfig.mockReturnValue({ env: { name: 'prod' } });

      const result = applyGnavLinkRewriting(gnav);

      expect(result.innerHTML).toBe(gnavHTML);
    });

    test('should rewrite links in the stage environment', () => {
      const result = applyGnavLinkRewriting(gnav);

      expect(result.innerHTML).toBe(`
        <a href="https://adobe--sfstage.sandbox.my.site.com/path"></a>
        <a href="https://io-partners-dx.stage.adobe.com/path"></a>
        <a href="https://unmapped-domain.com/path"></a>
      `);
    });
  });
});

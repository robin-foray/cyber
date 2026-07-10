import { describe, expect, it } from 'vitest';
import { devToolLinks, hrefToPageName, isDevToolHref, isDevToolPageName } from './dev-tools-pages';

describe('dev-tools-pages', () => {
    it('maps hrefs to page names', () => {
        expect(hrefToPageName('/')).toBe('welcome');
        expect(hrefToPageName('/dev-tools/hash-generator')).toBe('dev-tools/hash-generator');
    });

    it('recognizes dev-tool pages', () => {
        expect(isDevToolPageName('dev-tools/console')).toBe(true);
        expect(isDevToolPageName('welcome')).toBe(false);
        expect(isDevToolHref('/dev-tools/qr-generator')).toBe(true);
    });

    it('lists every dev-tool route', () => {
        expect(devToolLinks).toHaveLength(7);
        expect(devToolLinks.every((tool) => isDevToolPageName(tool.page))).toBe(true);
    });
});

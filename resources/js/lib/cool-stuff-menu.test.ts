import { describe, expect, it } from 'vitest';
import { coolStuffLinks, coolStuffMenu, findCoolStuffCategoryIdForHref, isCoolStuffHref } from './cool-stuff-menu';

describe('cool-stuff-menu', () => {
    it('groups links into categories', () => {
        expect(coolStuffMenu.length).toBeGreaterThanOrEqual(4);
        expect(coolStuffMenu.map((category) => category.label)).toContain('DEV_TOOLS');
        expect(coolStuffMenu.map((category) => category.label)).toContain('UI');
    });

    it('flattens all cool stuff links', () => {
        expect(coolStuffLinks.length).toBe(11);
        expect(coolStuffLinks.some((item) => item.page === 'dev-tools/regex-lab')).toBe(true);
    });

    it('finds category for href', () => {
        expect(findCoolStuffCategoryIdForHref('/dev-tools/color-converter')).toBe('ui');
        expect(findCoolStuffCategoryIdForHref('/dev-tools/console')).toBe('dev-tools');
    });

    it('detects cool stuff routes', () => {
        expect(isCoolStuffHref('/dev-tools/hash-generator')).toBe(true);
        expect(isCoolStuffHref('/profile')).toBe(false);
    });
});

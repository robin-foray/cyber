import { describe, expect, it } from 'vitest';
import { hrefToPageName, isCyberShellPageName, isInstantNavigationHref } from './cyber-pages-registry';

describe('cyber-pages-registry', () => {
    it('maps terminal href to welcome', () => {
        expect(hrefToPageName('/')).toBe('welcome');
        expect(isCyberShellPageName('welcome')).toBe(true);
    });

    it('supports profile and auth pages', () => {
        expect(hrefToPageName('/profile')).toBe('profile');
        expect(isCyberShellPageName('auth/login')).toBe(true);
    });

    it('skips hash-only navigation', () => {
        expect(isInstantNavigationHref('/#projects')).toBe(false);
        expect(isInstantNavigationHref('/')).toBe(true);
        expect(isInstantNavigationHref('/dev-tools/console')).toBe(true);
    });
});

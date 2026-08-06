import { describe, expect, it } from 'vitest';
import { hrefToPageName, isCyberShellPageName, isInstantNavigationHref } from './cyber-pages-registry';

describe('cyber-pages-registry', () => {
    it('maps terminal href to welcome', () => {
        expect(hrefToPageName('/')).toBe('welcome');
        expect(isCyberShellPageName('welcome')).toBe(true);
    });

    it('keeps login outside the cyber shell registry', () => {
        expect(hrefToPageName('/profile')).toBe('profile');
        expect(hrefToPageName('/login')).toBe('login');
        expect(isCyberShellPageName('auth/login')).toBe(false);
        expect(isInstantNavigationHref('/login')).toBe(false);
        expect(isInstantNavigationHref('/profile')).toBe(true);
    });

    it('skips hash-only navigation', () => {
        expect(isInstantNavigationHref('/#projects')).toBe(false);
        expect(isInstantNavigationHref('/')).toBe(true);
        expect(isInstantNavigationHref('/dev-tools/console')).toBe(true);
    });

    it('maps catalog routes to shell pages', () => {
        expect(hrefToPageName('/machines')).toBe('machines/gallery');
        expect(hrefToPageName('/tech-stack')).toBe('tech-stack/index');
        expect(hrefToPageName('/useful-sites')).toBe('useful-sites/index');
        expect(hrefToPageName('/free-apis')).toBe('free-apis/index');
        expect(isInstantNavigationHref('/machines')).toBe(true);
    });
});

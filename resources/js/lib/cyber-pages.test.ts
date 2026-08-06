import { describe, expect, it } from 'vitest';
import { usesCyberShellLayout } from './cyber-pages';

describe('usesCyberShellLayout', () => {
    it('matches cyber shell pages', () => {
        expect(usesCyberShellLayout('welcome')).toBe(true);
        expect(usesCyberShellLayout('profile')).toBe(true);
        expect(usesCyberShellLayout('auth/login')).toBe(true);
        expect(usesCyberShellLayout('auth/register')).toBe(false);
        expect(usesCyberShellLayout('dev-tools/console')).toBe(true);
        expect(usesCyberShellLayout('dev-tools/hash-generator')).toBe(true);
        expect(usesCyberShellLayout('machines/gallery')).toBe(true);
        expect(usesCyberShellLayout('tech-stack/index')).toBe(true);
        expect(usesCyberShellLayout('useful-sites/index')).toBe(true);
        expect(usesCyberShellLayout('free-apis/index')).toBe(true);
    });

    it('does not match admin pages', () => {
        expect(usesCyberShellLayout('dashboard')).toBe(false);
        expect(usesCyberShellLayout('settings/profile')).toBe(false);
    });
});

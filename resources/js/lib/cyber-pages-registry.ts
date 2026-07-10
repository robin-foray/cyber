import type { ComponentType } from 'react';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import Profile from '@/pages/profile';
import Welcome from '@/pages/welcome';
import { devToolPages } from '@/lib/dev-tools-pages';

export const cyberShellPages = {
    welcome: Welcome,
    profile: Profile,
    'auth/login': Login,
    'auth/register': Register,
    ...devToolPages,
} as const;

export type CyberShellPageName = keyof typeof cyberShellPages;

export function hrefToPageName(href: string) {
    const path = href.split('?')[0]?.split('#')[0]?.replace(/^\//, '') ?? '';

    return path === '' ? 'welcome' : path;
}

export function isCyberShellPageName(pageName: string): pageName is CyberShellPageName {
    return pageName in cyberShellPages;
}

export function isInstantNavigationHref(href: string) {
    if (href.includes('#')) {
        return false;
    }

    return isCyberShellPageName(hrefToPageName(href));
}

export function resolveCyberShellPage(pageName: string): ComponentType | null {
    if (!isCyberShellPageName(pageName)) {
        return null;
    }

    return cyberShellPages[pageName];
}

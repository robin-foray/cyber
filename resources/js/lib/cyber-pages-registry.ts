import { devToolPages } from '@/lib/dev-tools-pages';
import FreeApisIndex from '@/pages/free-apis/index';
import MachineGallery from '@/pages/machines/gallery';
import Profile from '@/pages/profile';
import TechStackIndex from '@/pages/tech-stack/index';
import UsefulSitesIndex from '@/pages/useful-sites/index';
import Welcome from '@/pages/welcome';
import type { ComponentType } from 'react';

export const cyberShellPages = {
    welcome: Welcome,
    profile: Profile,
    'machines/gallery': MachineGallery,
    'tech-stack/index': TechStackIndex,
    'useful-sites/index': UsefulSitesIndex,
    'free-apis/index': FreeApisIndex,
    ...devToolPages,
} as const;

export type CyberShellPageName = keyof typeof cyberShellPages;

export function hrefToPageName(href: string) {
    let path = href.split('?')[0]?.split('#')[0] ?? '';

    if (/^https?:\/\//i.test(path)) {
        try {
            path = new URL(path).pathname;
        } catch {
            // Keep the original path when URL parsing fails.
        }
    }

    path = path.replace(/^\//, '');

    if (path === '') {
        return 'welcome';
    }

    if (path === 'machines') {
        return 'machines/gallery';
    }

    if (path === 'tech-stack') {
        return 'tech-stack/index';
    }

    if (path === 'useful-sites') {
        return 'useful-sites/index';
    }

    if (path === 'free-apis') {
        return 'free-apis/index';
    }

    return path;
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

import type { ComponentType } from 'react';
import Console from '@/pages/dev-tools/console';
import CronGuru from '@/pages/dev-tools/cron-guru';
import Deployments from '@/pages/dev-tools/deployments';
import HashGenerator from '@/pages/dev-tools/hash-generator';
import ImageCompressor from '@/pages/dev-tools/image-compressor';
import QrGenerator from '@/pages/dev-tools/qr-generator';
import Runtime from '@/pages/dev-tools/runtime';

export const devToolLinks = [
    { label: 'CONSOLE', href: '/dev-tools/console', page: 'dev-tools/console' },
    { label: 'RUNTIME', href: '/dev-tools/runtime', page: 'dev-tools/runtime' },
    { label: 'HASH_GENERATOR', href: '/dev-tools/hash-generator', page: 'dev-tools/hash-generator' },
    { label: 'QR_GENERATOR', href: '/dev-tools/qr-generator', page: 'dev-tools/qr-generator' },
    { label: 'CRON_GURU', href: '/dev-tools/cron-guru', page: 'dev-tools/cron-guru' },
    { label: 'IMAGE_COMPRESSOR', href: '/dev-tools/image-compressor', page: 'dev-tools/image-compressor' },
    { label: 'DEPLOYMENTS', href: '/dev-tools/deployments', page: 'dev-tools/deployments' },
] as const;

export type DevToolPageName = (typeof devToolLinks)[number]['page'];

export const devToolPages: Record<DevToolPageName, ComponentType> = {
    'dev-tools/console': Console,
    'dev-tools/runtime': Runtime,
    'dev-tools/hash-generator': HashGenerator,
    'dev-tools/qr-generator': QrGenerator,
    'dev-tools/cron-guru': CronGuru,
    'dev-tools/image-compressor': ImageCompressor,
    'dev-tools/deployments': Deployments,
};

export function hrefToPageName(href: string) {
    const path = href.split('?')[0]?.split('#')[0]?.replace(/^\//, '') ?? '';

    return path === '' ? 'welcome' : path;
}

export function isDevToolPageName(pageName: string): pageName is DevToolPageName {
    return pageName in devToolPages;
}

export function isDevToolHref(href: string) {
    return isDevToolPageName(hrefToPageName(href));
}

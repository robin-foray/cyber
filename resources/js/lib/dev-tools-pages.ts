import type { ComponentType } from 'react';
import ColorConverter from '@/pages/dev-tools/color-converter';
import Console from '@/pages/dev-tools/console';
import CronGuru from '@/pages/dev-tools/cron-guru';
import Deployments from '@/pages/dev-tools/deployments';
import HashGenerator from '@/pages/dev-tools/hash-generator';
import HtmlSyntaxChecker from '@/pages/dev-tools/html-syntax-checker';
import ImageCompressor from '@/pages/dev-tools/image-compressor';
import PhpSyntaxChecker from '@/pages/dev-tools/php-syntax-checker';
import QrGenerator from '@/pages/dev-tools/qr-generator';
import Runtime from '@/pages/dev-tools/runtime';

export const devToolLinks = [
    { label: 'CONSOLE', href: '/dev-tools/console', page: 'dev-tools/console' },
    { label: 'RUNTIME', href: '/dev-tools/runtime', page: 'dev-tools/runtime' },
    { label: 'HASH_GENERATOR', href: '/dev-tools/hash-generator', page: 'dev-tools/hash-generator' },
    { label: 'QR_GENERATOR', href: '/dev-tools/qr-generator', page: 'dev-tools/qr-generator' },
    { label: 'CRON_GURU', href: '/dev-tools/cron-guru', page: 'dev-tools/cron-guru' },
    { label: 'IMAGE_COMPRESSOR', href: '/dev-tools/image-compressor', page: 'dev-tools/image-compressor' },
    { label: 'PHP_SYNTAX', href: '/dev-tools/php-syntax-checker', page: 'dev-tools/php-syntax-checker' },
    { label: 'HTML_SYNTAX', href: '/dev-tools/html-syntax-checker', page: 'dev-tools/html-syntax-checker' },
    { label: 'COLOR_CONVERTER', href: '/dev-tools/color-converter', page: 'dev-tools/color-converter' },
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
    'dev-tools/php-syntax-checker': PhpSyntaxChecker,
    'dev-tools/html-syntax-checker': HtmlSyntaxChecker,
    'dev-tools/color-converter': ColorConverter,
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

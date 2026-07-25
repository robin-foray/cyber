import type { ComponentType } from 'react';
import { coolStuffLinks } from '@/lib/cool-stuff-menu';
import ColorConverter from '@/pages/dev-tools/color-converter';
import Console from '@/pages/dev-tools/console';
import CronGuru from '@/pages/dev-tools/cron-guru';
import Deployments from '@/pages/dev-tools/deployments';
import HashGenerator from '@/pages/dev-tools/hash-generator';
import HtmlSyntaxChecker from '@/pages/dev-tools/html-syntax-checker';
import ImageCompressor from '@/pages/dev-tools/image-compressor';
import PhpSyntaxChecker from '@/pages/dev-tools/php-syntax-checker';
import QrGenerator from '@/pages/dev-tools/qr-generator';
import RegexLab from '@/pages/dev-tools/regex-lab';
import Runtime from '@/pages/dev-tools/runtime';
import SqlBuilder from '@/pages/dev-tools/sql-builder';
import { hrefToPageName } from '@/lib/cyber-pages-registry';

export const devToolLinks = coolStuffLinks;

export type DevToolPageName = (typeof coolStuffLinks)[number]['page'];

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
    'dev-tools/regex-lab': RegexLab,
    'dev-tools/sql-builder': SqlBuilder,
    'dev-tools/deployments': Deployments,
};

export function isDevToolPageName(pageName: string): pageName is DevToolPageName {
    return pageName in devToolPages;
}

export function isDevToolHref(href: string) {
    return isDevToolPageName(hrefToPageName(href));
}

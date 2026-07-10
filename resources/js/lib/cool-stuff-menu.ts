export type CoolStuffLink = {
    label: string;
    href: string;
    page: string;
};

export type CoolStuffCategory = {
    id: string;
    label: string;
    items: readonly CoolStuffLink[];
};

export const coolStuffMenu = [
    {
        id: 'dev-tools',
        label: 'DEV_TOOLS',
        items: [
            { label: 'CONSOLE', href: '/dev-tools/console', page: 'dev-tools/console' },
            { label: 'RUNTIME', href: '/dev-tools/runtime', page: 'dev-tools/runtime' },
            { label: 'HASH_GENERATOR', href: '/dev-tools/hash-generator', page: 'dev-tools/hash-generator' },
            { label: 'QR_GENERATOR', href: '/dev-tools/qr-generator', page: 'dev-tools/qr-generator' },
            { label: 'CRON_GURU', href: '/dev-tools/cron-guru', page: 'dev-tools/cron-guru' },
            { label: 'IMAGE_COMPRESSOR', href: '/dev-tools/image-compressor', page: 'dev-tools/image-compressor' },
            { label: 'DEPLOYMENTS', href: '/dev-tools/deployments', page: 'dev-tools/deployments' },
        ],
    },
    {
        id: 'syntax',
        label: 'SYNTAX',
        items: [
            { label: 'PHP_SYNTAX', href: '/dev-tools/php-syntax-checker', page: 'dev-tools/php-syntax-checker' },
            { label: 'HTML_SYNTAX', href: '/dev-tools/html-syntax-checker', page: 'dev-tools/html-syntax-checker' },
        ],
    },
    {
        id: 'ui',
        label: 'UI',
        items: [{ label: 'COLOR_CONVERTER', href: '/dev-tools/color-converter', page: 'dev-tools/color-converter' }],
    },
    {
        id: 'pattern',
        label: 'PATTERN',
        items: [{ label: 'REGEX_LAB', href: '/dev-tools/regex-lab', page: 'dev-tools/regex-lab' }],
    },
] as const satisfies readonly CoolStuffCategory[];

export const coolStuffLinks = coolStuffMenu.flatMap((category) => category.items);

export const coolStuffStorageKey = 'foray.cool-stuff.open';
export const coolStuffCategoriesStorageKey = 'foray.cool-stuff.categories';

export function findCoolStuffCategoryIdForHref(href: string) {
    const hrefPath = href.split('?')[0]?.split('#')[0] ?? '';

    return coolStuffMenu.find((category) => category.items.some((item) => item.href === hrefPath))?.id ?? null;
}

export function isCoolStuffHref(currentUrl: string) {
    const currentPath = currentUrl.split('?')[0]?.split('#')[0] ?? '';

    return coolStuffLinks.some((item) => currentPath === item.href || currentPath.startsWith(`${item.href}/`));
}

export function readCoolStuffCategoryState(): Record<string, boolean> {
    if (typeof window === 'undefined') {
        return {};
    }

    const storedValue = window.localStorage.getItem(coolStuffCategoriesStorageKey);

    if (!storedValue) {
        return {};
    }

    try {
        const parsed: unknown = JSON.parse(storedValue);

        if (!parsed || typeof parsed !== 'object') {
            return {};
        }

        return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, Boolean(value)]));
    } catch {
        return {};
    }
}

export function writeCoolStuffCategoryState(state: Record<string, boolean>) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(coolStuffCategoriesStorageKey, JSON.stringify(state));
}

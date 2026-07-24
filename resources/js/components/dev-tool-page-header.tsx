import { resolveCmsIcon } from '@/lib/cms-icons';
import { type CmsDevToolPage, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

const fallbacks: Record<string, CmsDevToolPage> = {
    console: {
        headerLabel: 'DEV_TOOL_01 // JSON_FORMATTER',
        pageTitle: 'JSON Formatter',
        headingPrefix: 'JSON',
        headingAccent: 'Formatter',
        sampleInput: null,
        icon: 'FileJson2',
    },
};

export function useDevToolPage(slug: string): CmsDevToolPage {
    const { cms } = usePage<SharedData>().props;

    return cms.devToolPages[slug] ?? fallbacks[slug] ?? {
        headerLabel: slug.toUpperCase(),
        pageTitle: slug,
        headingPrefix: slug,
        headingAccent: null,
        sampleInput: null,
        icon: 'Terminal',
    };
}

type DevToolPageHeaderProps = {
    slug: string;
    actions?: ReactNode;
};

export function DevToolPageHeader({ slug, actions }: DevToolPageHeaderProps) {
    const page = useDevToolPage(slug);
    const Icon = resolveCmsIcon(page.icon);

    return (
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                    <Icon size={18} />
                    {page.headerLabel}
                </div>
                {page.headingPrefix && (
                    <h1 className="font-display text-4xl font-bold text-white uppercase">
                        {page.headingPrefix}{' '}
                        {page.headingAccent && <span className="glow-text text-primary">{page.headingAccent}</span>}
                    </h1>
                )}
            </div>
            {actions}
        </div>
    );
}

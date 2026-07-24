import { hrefToPageName, isCyberShellPageName, isInstantNavigationHref } from '@/lib/cyber-pages-registry';
import { router } from '@inertiajs/react';
import { createContext, type MouseEvent, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type InstantNavigationContextValue = {
    optimisticPage: string | null;
    optimisticHref: string | null;
    instantVisit: (href: string) => void;
};

const InstantNavigationContext = createContext<InstantNavigationContextValue | null>(null);

function shouldOpenInNewTab(event: MouseEvent) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function InstantNavigationProvider({ children }: { children: ReactNode }) {
    const [optimisticPage, setOptimisticPage] = useState<string | null>(null);
    const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

    const clearOptimistic = useCallback((pageName: string) => {
        setOptimisticPage((current) => (current === pageName ? null : current));
        setOptimisticHref((current) => (current && hrefToPageName(current) === pageName ? null : current));
    }, []);

    const instantVisit = useCallback(
        (href: string) => {
            const pageName = hrefToPageName(href);

            if (isInstantNavigationHref(href)) {
                setOptimisticPage(pageName);
                setOptimisticHref(href);
            }

            router.visit(href, {
                preserveScroll: true,
                onFinish: () => clearOptimistic(pageName),
                onCancel: () => clearOptimistic(pageName),
                onError: () => clearOptimistic(pageName),
            });
        },
        [clearOptimistic],
    );

    const value = useMemo(
        () => ({
            optimisticPage,
            optimisticHref,
            instantVisit,
        }),
        [instantVisit, optimisticHref, optimisticPage],
    );

    return <InstantNavigationContext.Provider value={value}>{children}</InstantNavigationContext.Provider>;
}

export function useInstantNavigation() {
    const context = useContext(InstantNavigationContext);

    if (!context) {
        throw new Error('useInstantNavigation must be used within InstantNavigationProvider');
    }

    return context;
}

export function useInstantCyberClick(href: string) {
    const { instantVisit } = useInstantNavigation();

    return (event: MouseEvent<HTMLAnchorElement>) => {
        if (!isInstantNavigationHref(href) || shouldOpenInNewTab(event)) {
            return;
        }

        event.preventDefault();
        instantVisit(href);
    };
}

/** @deprecated Use useInstantCyberClick */
export function useInstantDevToolClick(href: string) {
    return useInstantCyberClick(href);
}

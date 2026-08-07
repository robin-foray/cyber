import { isInstantNavigationHref } from '@/lib/cyber-pages-registry';
import { router } from '@inertiajs/react';
import { createContext, type MouseEvent, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type InstantNavigationContextValue = {
    /** @deprecated Kept for compatibility; always null. Do not use for page swaps. */
    optimisticPage: string | null;
    optimisticHref: string | null;
    instantVisit: (href: string) => void;
};

const InstantNavigationContext = createContext<InstantNavigationContextValue | null>(null);

function shouldOpenInNewTab(event: MouseEvent) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function InstantNavigationProvider({ children }: { children: ReactNode }) {
    const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

    const clearOptimistic = useCallback((href: string) => {
        setOptimisticHref((current) => (current === href ? null : current));
    }, []);

    const instantVisit = useCallback(
        (href: string) => {
            // Only highlight the destination in the shell — never swap the React
            // page component before Inertia delivers matching props.
            if (isInstantNavigationHref(href)) {
                setOptimisticHref(href);
            }

            router.visit(href, {
                preserveScroll: true,
                onFinish: () => clearOptimistic(href),
                onCancel: () => clearOptimistic(href),
                onError: () => clearOptimistic(href),
            });
        },
        [clearOptimistic],
    );

    const value = useMemo(
        () => ({
            optimisticPage: null,
            optimisticHref,
            instantVisit,
        }),
        [instantVisit, optimisticHref],
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

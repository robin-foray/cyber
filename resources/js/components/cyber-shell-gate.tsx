import CyberShell from '@/components/cyber-shell';
import { useInstantNavigation } from '@/contexts/instant-navigation-context';
import { isCyberShellPageName, resolveCyberShellPage } from '@/lib/cyber-pages-registry';
import { usesCyberShellLayout } from '@/lib/cyber-pages';
import { usePage } from '@inertiajs/react';
import { type ComponentType, createElement } from 'react';

type CyberShellGateProps = {
    Component: ComponentType;
    key: number;
    props: Record<string, unknown>;
};

export default function CyberShellGate({ Component, key: componentKey, props }: CyberShellGateProps) {
    const { component } = usePage();
    const { optimisticPage } = useInstantNavigation();
    const activePageName = optimisticPage ?? component;
    const EagerPage = isCyberShellPageName(activePageName) ? resolveCyberShellPage(activePageName) : null;

    const page = EagerPage
        ? createElement(EagerPage, { key: activePageName, ...props })
        : createElement(Component, { key: componentKey, ...props });

    if (usesCyberShellLayout(activePageName)) {
        return <CyberShell>{page}</CyberShell>;
    }

    return page;
}

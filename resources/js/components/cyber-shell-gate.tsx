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

export default function CyberShellGate({ Component, props }: Omit<CyberShellGateProps, 'key'>) {
    const { component } = usePage();
    const { optimisticPage } = useInstantNavigation();
    const activePageName = optimisticPage ?? component;
    const RegistryPage = isCyberShellPageName(activePageName) ? resolveCyberShellPage(activePageName) : null;
    const PageComponent = RegistryPage ?? Component;

    const page = createElement(PageComponent, { key: activePageName, ...props });

    if (usesCyberShellLayout(activePageName)) {
        return <CyberShell key="foray-cyber-shell">{page}</CyberShell>;
    }

    return page;
}

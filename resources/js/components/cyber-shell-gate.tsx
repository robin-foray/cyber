import CyberShell from '@/components/cyber-shell';
import { usesCyberShellLayout } from '@/lib/cyber-pages';
import { usePage } from '@inertiajs/react';
import { type ComponentType, createElement } from 'react';

type CyberShellGateProps = {
    Component: ComponentType;
    key: number;
    props: Record<string, unknown>;
};

/**
 * Persistent CyberShell wrapper for cyber pages.
 *
 * Important: do NOT swap the page component from optimistic navigation.
 * Optimistic href is only for sidebar/topbar highlighting. Rendering the next
 * page with the current visit's props (e.g. MachineGallery without `machines`)
 * throws and leaves a blank gray screen until a full reload.
 */
export default function CyberShellGate({ Component, props }: Omit<CyberShellGateProps, 'key'>) {
    const { component } = usePage();
    const page = createElement(Component, { key: component, ...props });

    if (usesCyberShellLayout(component)) {
        return <CyberShell key="foray-cyber-shell">{page}</CyberShell>;
    }

    return page;
}

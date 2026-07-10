import CyberShell from '@/components/cyber-shell';
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
    const page = createElement(Component, { key: componentKey, ...props });

    if (usesCyberShellLayout(component)) {
        return <CyberShell>{page}</CyberShell>;
    }

    return page;
}

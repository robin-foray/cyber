import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import CyberShellGate from '@/components/cyber-shell-gate';
import { InstantNavigationProvider } from '@/contexts/instant-navigation-context';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const lazyPages = import.meta.glob('./pages/**/*.tsx');
const eagerCyberPages = import.meta.glob(
    [
        './pages/welcome.tsx',
        './pages/profile.tsx',
        './pages/auth/login.tsx',
        './pages/machines/gallery.tsx',
        './pages/tech-stack/index.tsx',
        './pages/useful-sites/index.tsx',
        './pages/free-apis/index.tsx',
        './pages/dev-tools/*.tsx',
    ],
    {
        eager: true,
    },
);
const inertiaPages = {
    ...lazyPages,
    ...eagerCyberPages,
};

type CyberShellGateProps = {
    Component: ComponentType;
    key: number;
    props: Record<string, unknown>;
};

function RenderCyberPage({ Component, props }: Omit<CyberShellGateProps, 'key'>) {
    return <CyberShellGate Component={Component} props={props} />;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, inertiaPages),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <InstantNavigationProvider>
                <App {...props}>{RenderCyberPage}</App>
            </InstantNavigationProvider>,
        );
    },
    progress: false,
});

// This will set light / dark mode on load...
initializeTheme();

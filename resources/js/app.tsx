import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { usesCyberShellLayout } from '@/lib/cyber-pages';
import cyberShellLayout from '@/layouts/cyber-shell-layout';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const lazyPages = import.meta.glob('./pages/**/*.tsx');
const eagerCyberPages = import.meta.glob(['./pages/welcome.tsx', './pages/profile.tsx', './pages/dev-tools/*.tsx'], {
    eager: true,
});
const inertiaPages = {
    ...lazyPages,
    ...eagerCyberPages,
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(`./pages/${name}.tsx`, inertiaPages);

        if (usesCyberShellLayout(name)) {
            page.default.layout = cyberShellLayout;
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: false,
});

// This will set light / dark mode on load...
initializeTheme();

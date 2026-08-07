/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {
    defineConfig
} from 'vite';
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
        },
        watch: {
            ignored: ['**/public/stacks/**', '**/public/build/**', '**/storage/**'],
        },
    },
    test: {
        environment: 'node',
        include: ['resources/js/**/*.test.ts'],
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    build: {
        // Cyber shell pages stay eager for instant Inertia nav; split vendors so
        // no single chunk trips Vite's default 500 kB warning.
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return;
                    }

                    if (id.includes('react-dom') || id.includes('/react/') || id.includes('\\react\\') || id.includes('scheduler')) {
                        return 'vendor-react';
                    }

                    if (id.includes('@inertiajs')) {
                        return 'vendor-inertia';
                    }

                    if (id.includes('lucide-react')) {
                        return 'vendor-icons';
                    }

                    return 'vendor';
                },
            },
        },
    },
});

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
        // Cyber shell pages are intentionally eager for instant Inertia navigation,
        // so the main app chunk is large. Do not use manualChunks here — splitting
        // React/Inertia vendors caused a blank gray screen after login.
        chunkSizeWarningLimit: 1000,
    },
});

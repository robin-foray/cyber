import CyberShell from '@/components/cyber-shell';
import type { ReactNode } from 'react';

/**
 * Persistent Inertia layout — keeps CyberShell/sidebar mounted across page visits
 * so SpecularButton WebGL canvases do not remount (white flash).
 */
export function cyberLayout(page: ReactNode) {
    return <CyberShell>{page}</CyberShell>;
}

import CyberShell from '@/components/cyber-shell';
import { type ReactNode } from 'react';

export default function cyberShellLayout(page: ReactNode) {
    return <CyberShell>{page}</CyberShell>;
}

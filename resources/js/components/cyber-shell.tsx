import { useCyberNavigation } from '@/hooks/use-cyber-navigation';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect, useState } from 'react';
import CyberFooter from './cyber/footer';
import { CyberPageSkeleton } from './cyber/skeleton';
import LetterGlitchBackground from './cyber/letter-glitch-background';
import CyberSidebar from './cyber/sidebar';
import CyberTopbar from './cyber/topbar';

type CyberShellProps = {
    children: ReactNode;
};

const sidebarStorageKey = 'foray.sidebar.open';

export default function CyberShell({ children }: CyberShellProps) {
    const { auth } = usePage<SharedData>().props;
    const { url } = usePage();
    const showSkeleton = useCyberNavigation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        const storedValue = window.localStorage.getItem(sidebarStorageKey);

        if (storedValue !== null) {
            return storedValue === 'true';
        }

        return window.innerWidth >= 768;
    });

    useEffect(() => {
        window.localStorage.setItem(sidebarStorageKey, String(isSidebarOpen));
    }, [isSidebarOpen]);

    function setSidebarOpen(open: boolean) {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(sidebarStorageKey, String(open));
        }

        setIsSidebarOpen(open);
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <CyberSidebar
                currentUrl={url}
                isOpen={isSidebarOpen}
                user={auth.user}
                onClose={() => setSidebarOpen(false)}
                onOpen={() => setSidebarOpen(true)}
            />

            <div className={`flex min-h-screen flex-col transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
                <CyberTopbar currentUrl={url} isSidebarOpen={isSidebarOpen} user={auth.user} onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="relative w-full flex-1 overflow-hidden">
                    <LetterGlitchBackground />
                    <div className="relative z-10 mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:p-8">
                        <div className="relative">
                            {children}
                            {showSkeleton && (
                                <div className="absolute inset-0 z-20 bg-background/90">
                                    <CyberPageSkeleton />
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <CyberFooter />
            </div>
        </div>
    );
}

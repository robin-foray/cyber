import { type SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import { Activity, Menu } from 'lucide-react';

type CyberTopbarProps = {
    currentUrl: string;
    isSidebarOpen: boolean;
    user: SharedData['auth']['user'];
    onOpenSidebar: () => void;
};

export default function CyberTopbar({ currentUrl, isSidebarOpen, user, onOpenSidebar }: CyberTopbarProps) {
    const sectionLabel = getSectionLabel(currentUrl);

    return (
        <header className={`sticky top-0 z-40 border-b border-primary/10 bg-background/80 backdrop-blur-xl ${isSidebarOpen ? 'topbar-inverse-corner' : ''}`}>
            <div className="flex min-h-14 items-center gap-4 px-4 py-2 sm:gap-6 sm:px-8">
                {!isSidebarOpen && (
                    <button
                        type="button"
                        aria-label="Open sidebar"
                        onClick={onOpenSidebar}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-[0_0_10px_rgba(204,255,0,0.18)] md:hidden"
                    >
                        <Menu size={16} />
                    </button>
                )}

                <div className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-widest text-primary">
                    <Activity size={14} />
                    {sectionLabel}
                </div>

                <div className="relative flex-1 overflow-hidden border-x border-primary/10 py-1">
                    <div className="dev-ticker flex w-max items-center gap-8 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                        <span>// build: stable</span>
                        <span className="text-primary">npm_run_dev --watch</span>
                        <span>inertia.react.pipeline_online</span>
                        <span className="text-primary">latency: 0.4ms</span>
                        <span>deploy_queue: clear</span>
                        <span>// build: stable</span>
                        <span className="text-primary">npm_run_dev --watch</span>
                        <span>inertia.react.pipeline_online</span>
                    </div>
                </div>

                <Link
                    href={user ? route('dashboard') : route('login')}
                    className="shrink-0 rounded-lg bg-primary px-6 py-2 text-[10px] font-bold text-black uppercase transition-all hover:shadow-[0_0_15px_#ccff00]"
                >
                    {user ? 'Dashboard' : 'Establish_Link'}
                </Link>
            </div>
        </header>
    );
}

function getSectionLabel(currentUrl: string) {
    const path = currentUrl.split('?')[0].split('#')[0];

    if (path.startsWith('/dev-tools')) {
        return 'DEV_TOOLS';
    }

    if (path.startsWith('/login')) {
        return 'ACCESS_GATE';
    }

    if (path.startsWith('/register')) {
        return 'NODE_REGISTRATION';
    }

    if (path.startsWith('/profile')) {
        return 'PROFILE';
    }

    return 'TERMINAL';
}

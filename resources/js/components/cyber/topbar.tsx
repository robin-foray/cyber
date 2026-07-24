import DevTicker from '@/components/cyber/dev-ticker';
import { useInstantCyberClick } from '@/contexts/instant-navigation-context';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Activity, Menu, UserRound } from 'lucide-react';

type CyberTopbarProps = {
    currentUrl: string;
    isSidebarOpen: boolean;
    user: SharedData['auth']['user'];
    onOpenSidebar: () => void;
};

export default function CyberTopbar({ currentUrl, isSidebarOpen, user, onOpenSidebar }: CyberTopbarProps) {
    const { cms } = usePage<SharedData>().props;
    const sectionLabel = getSectionLabel(currentUrl, cms.topbarLabels);
    const tickerItems = [...cms.tickers.topbar, ...cms.tickers.topbar];
    const authHref = user ? '/profile' : '/login';
    const handleAuthClick = useInstantCyberClick(authHref);
    const authLabel = user ? 'Open profile' : 'Login';

    return (
        <header
            className={`border-primary/10 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl ${isSidebarOpen ? 'topbar-inverse-corner' : ''}`}
        >
            <div className="flex min-h-14 items-center gap-3 px-4 py-2 sm:gap-6 sm:px-8">
                {!isSidebarOpen && (
                    <button
                        type="button"
                        aria-label="Open sidebar"
                        onClick={onOpenSidebar}
                        className="border-primary/30 bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-[0_0_10px_rgba(204,255,0,0.18)] md:hidden"
                    >
                        <Menu size={16} />
                    </button>
                )}

                <div className="text-primary flex shrink-0 items-center gap-2 text-xs font-bold tracking-widest">
                    <Activity size={14} />
                    <span className="max-w-[7rem] truncate sm:max-w-none">{sectionLabel}</span>
                </div>

                <div className="border-primary/10 relative min-w-0 flex-1 overflow-hidden border-x py-1">
                    <DevTicker className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">
                        {tickerItems.map((item, index) => (
                            <span key={`${item.text}-${index}`} className={item.isHighlighted ? 'text-primary' : undefined}>
                                {item.text}
                            </span>
                        ))}
                    </DevTicker>
                </div>

                <Link
                    href={authHref}
                    prefetch="mount"
                    cacheFor="5m"
                    onClick={handleAuthClick}
                    aria-label={authLabel}
                    title={authLabel}
                    className="bg-primary text-black flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-all hover:shadow-[0_0_15px_#ccff00] md:hidden"
                >
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <UserRound size={16} />
                    )}
                </Link>

                <Link
                    href={authHref}
                    prefetch="mount"
                    cacheFor="5m"
                    onClick={handleAuthClick}
                    className="bg-primary hidden shrink-0 rounded-lg px-6 py-2 text-[10px] font-bold text-black uppercase transition-all hover:shadow-[0_0_15px_#ccff00] md:inline-flex"
                >
                    {user ? 'Node_Profile' : 'Establish_Link'}
                </Link>
            </div>
        </header>
    );
}

function getSectionLabel(currentUrl: string, labels: SharedData['cms']['topbarLabels']) {
    const path = currentUrl.split('?')[0].split('#')[0];

    if (path.startsWith('/dev-tools')) {
        return labels.devTools;
    }

    if (path.startsWith('/login')) {
        return labels.accessGate;
    }

    if (path.startsWith('/register')) {
        return labels.nodeRegistration;
    }

    if (path.startsWith('/profile')) {
        return labels.profile;
    }

    return labels.terminal;
}

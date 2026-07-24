import CoolStuffMenu, { coolStuffStorageKey } from '@/components/cyber/cool-stuff-menu';
import { useInstantCyberClick } from '@/contexts/instant-navigation-context';
import { resolveCmsIcon } from '@/lib/cms-icons';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Facebook, Github, Instagram, Twitter, Zap } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import ForayBrand from './foray-brand';
import { ChevronLeft } from 'lucide-react';

type CyberSidebarProps = {
    currentUrl: string;
    isOpen: boolean;
    user: SharedData['auth']['user'];
    onClose: () => void;
    onOpen: () => void;
};

const socialIconMap = {
    Github,
    Twitter,
    Instagram,
    Facebook,
} as const;

export default function CyberSidebar({ currentUrl, isOpen, user, onClose, onOpen }: CyberSidebarProps) {
    const { cms } = usePage<SharedData>().props;
    const [isCoolStuffOpen, setIsCoolStuffOpen] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const storedValue = window.localStorage.getItem(coolStuffStorageKey);
        const legacyValue = window.localStorage.getItem('foray.dev-tools.open');

        if (storedValue !== null) {
            return storedValue === 'true';
        }

        return legacyValue === 'true';
    });

    useEffect(() => {
        window.localStorage.setItem(coolStuffStorageKey, String(isCoolStuffOpen));
    }, [isCoolStuffOpen]);

    function setCoolStuffOpen(open: boolean) {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(coolStuffStorageKey, String(open));
        }

        setIsCoolStuffOpen(open);
    }

    const navigation = cms.navigation.filter((item) => !item.requiresAuth || user);
    let coolStuffRendered = false;

    return (
        <aside
            className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-primary/20 bg-surface-low/95 backdrop-blur-md transition-all duration-300 ${
                isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
            } ${isOpen ? 'overflow-visible' : 'overflow-hidden md:overflow-visible'}`}
        >
            {isOpen && (
                <button
                    type="button"
                    aria-label="Collapse sidebar"
                    onClick={onClose}
                    className="absolute top-[22px] right-5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_8px_#ccff00] transition-all hover:scale-110"
                >
                    <ChevronLeft size={12} />
                </button>
            )}

            <div className={`mb-3 flex shrink-0 flex-col px-3 pt-4 pb-3 ${!isOpen ? 'items-center' : ''}`}>
                <ForayBrand isOpen={isOpen} onOpen={onOpen} />

                {isOpen && <NodeIdentity user={user} />}
            </div>

            <nav className="min-h-0 flex-grow space-y-1.5 overflow-y-auto px-3 pb-3 [scrollbar-width:thin] [scrollbar-color:rgba(204,255,0,0.35)_transparent]">
                {navigation.map((item) => {
                    if (item.isGroup) {
                        if (coolStuffRendered) {
                            return null;
                        }

                        coolStuffRendered = true;

                        return (
                            <CoolStuffMenu
                                key={item.id}
                                currentUrl={currentUrl}
                                isOpen={isCoolStuffOpen}
                                onCollapsedOpen={() => {
                                    setCoolStuffOpen(true);
                                    onOpen();
                                }}
                                onToggle={() => setCoolStuffOpen(!isCoolStuffOpen)}
                                full={isOpen}
                            />
                        );
                    }

                    return (
                        <NavItem
                            key={item.id}
                            icon={resolveCmsIcon(item.icon)}
                            label={item.label}
                            href={item.href ?? '/'}
                            active={isActiveHref(currentUrl, item.href ?? '/')}
                            full={isOpen}
                        />
                    );
                })}
            </nav>

            <SocialLinks full={isOpen} links={cms.socialLinks} />
        </aside>
    );
}

function NodeIdentity({ user }: { user: SharedData['auth']['user'] }) {
    const label = user?.name ?? 'GUEST_NODE';
    const role = user?.is_admin ? 'ADMIN' : (user?.role ?? 'VISITOR').toString().toUpperCase();
    const title = user?.title ?? 'SYSTEM: ONLINE';
    const href = user ? '/profile' : '/login';
    const handleClick = useInstantCyberClick(href);

    return (
        <Link
            href={href}
            prefetch="mount"
            cacheFor="5m"
            onClick={handleClick}
            className="block w-full overflow-hidden rounded-xl border border-primary/10 bg-surface/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
        >
            <p className="truncate text-[10px] tracking-widest text-primary uppercase opacity-70">Node_Identity</p>
            <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    {user?.avatar_url ? <img src={user.avatar_url} alt={label} className="h-full w-full object-cover" /> : <Zap size={18} />}
                </div>
                <div className="min-w-0">
                    <h2 className="font-display truncate text-base font-bold">{label}</h2>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#ccff00]" />
                        <span className="truncate text-[10px] opacity-60">
                            {role} // {title}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function NavItem({
    icon: Icon,
    label,
    href,
    active = false,
    full,
}: {
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    href: string;
    active?: boolean;
    full: boolean;
}) {
    const handleClick = useInstantCyberClick(href);

    return (
        <Link
            href={href}
            prefetch="mount"
            cacheFor="5m"
            onClick={handleClick}
            aria-label={label}
            title={label}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${full ? '' : 'justify-center'} ${
                active ? 'bg-primary text-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)]' : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
            }`}
        >
            <Icon size={18} />
            {full && <span className="text-[11px] font-bold tracking-widest">{label}</span>}
        </Link>
    );
}

function SocialLinks({ full, links }: { full: boolean; links: SharedData['cms']['socialLinks'] }) {
    return (
        <div className={`shrink-0 border-t border-white/5 p-3 ${full ? '' : 'px-3'}`}>
            <div className={`grid gap-2 ${full ? 'grid-cols-4' : 'grid-cols-1'}`}>
                {links.map((link) => {
                    const Icon = socialIconMap[link.platform as keyof typeof socialIconMap] ?? Github;

                    return (
                        <a
                            key={link.platform}
                            href={link.url ?? '#'}
                            aria-label={link.platform}
                            title={link.platform}
                            className="flex min-h-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-on-surface-variant transition-all hover:border-primary/50 hover:bg-primary hover:text-black hover:shadow-[0_0_14px_rgba(204,255,0,0.45)]"
                        >
                            <Icon size={14} />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

function isActiveHref(currentUrl: string, href: string) {
    const currentPath = currentUrl.split('?')[0].split('#')[0];
    const hrefPath = href.split('?')[0].split('#')[0];

    if (hrefPath === '/') {
        return currentPath === '/';
    }

    return currentPath === hrefPath || currentPath.startsWith(`${hrefPath}/`);
}

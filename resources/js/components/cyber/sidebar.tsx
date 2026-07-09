import { resolveCmsIcon } from '@/lib/cms-icons';
import { type CmsNavigationItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronLeft,
    Check,
    Facebook,
    Github,
    Instagram,
    Twitter,
    Zap,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import ForayBrand from './foray-brand';

type CyberSidebarProps = {
    currentUrl: string;
    isOpen: boolean;
    user: SharedData['auth']['user'];
    onClose: () => void;
    onOpen: () => void;
};

const devToolsStorageKey = 'foray.dev-tools.open';

const socialIconMap = {
    Github,
    Twitter,
    Instagram,
    Facebook,
} as const;

export default function CyberSidebar({ currentUrl, isOpen, user, onClose, onOpen }: CyberSidebarProps) {
    const { cms } = usePage<SharedData>().props;
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.localStorage.getItem(devToolsStorageKey) === 'true';
    });

    useEffect(() => {
        window.localStorage.setItem(devToolsStorageKey, String(isDevToolsOpen));
    }, [isDevToolsOpen]);

    function setDevToolsOpen(open: boolean) {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(devToolsStorageKey, String(open));
        }

        setIsDevToolsOpen(open);
    }

    const navigation = cms.navigation.filter((item) => !item.requiresAuth || user);

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
                {navigation.map((item) =>
                    item.isGroup ? (
                        <DevToolsMenu
                            key={item.id}
                            item={item}
                            currentUrl={currentUrl}
                            isOpen={isDevToolsOpen}
                            onCollapsedOpen={() => {
                                setDevToolsOpen(true);
                                onOpen();
                            }}
                            onToggle={() => setDevToolsOpen(!isDevToolsOpen)}
                            full={isOpen}
                        />
                    ) : (
                        <NavItem
                            key={item.id}
                            icon={resolveCmsIcon(item.icon)}
                            label={item.label}
                            href={item.href ?? '/'}
                            active={isActiveHref(currentUrl, item.href ?? '/')}
                            full={isOpen}
                        />
                    ),
                )}
            </nav>

            <SocialLinks full={isOpen} links={cms.socialLinks} />
        </aside>
    );
}

function NodeIdentity({ user }: { user: SharedData['auth']['user'] }) {
    const label = user?.name ?? 'GUEST_NODE';
    const role = user?.is_admin ? 'ADMIN' : (user?.role ?? 'VISITOR').toString().toUpperCase();
    const title = user?.title ?? 'SYSTEM: ONLINE';

    return (
        <Link href={user ? '/profile' : '/login'} className="block w-full overflow-hidden rounded-xl border border-primary/10 bg-surface/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5">
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

function NavItem({ icon: Icon, label, href, active = false, full }: { icon: React.ComponentType<{ size?: number }>; label: string; href: string; active?: boolean; full: boolean }) {
    return (
        <Link
            href={href}
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

function DevToolsMenu({
    item,
    currentUrl,
    isOpen,
    onCollapsedOpen,
    onToggle,
    full,
}: {
    item: CmsNavigationItem;
    currentUrl: string;
    isOpen: boolean;
    onCollapsedOpen: () => void;
    onToggle: () => void;
    full: boolean;
}) {
    const Icon = resolveCmsIcon(item.icon, resolveCmsIcon('Construction'));
    const isActive = currentUrl.startsWith('/dev-tools');

    return (
        <div className="space-y-1">
            <button
                type="button"
                aria-label={item.label}
                title={item.label}
                onClick={() => {
                    if (full) {
                        onToggle();
                        return;
                    }

                    onCollapsedOpen();
                }}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-primary/5 hover:text-primary ${
                    full ? '' : 'justify-center'
                } ${isActive ? 'bg-primary text-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)]' : 'text-on-surface-variant'}`}
            >
                <Icon size={18} />
                {full && (
                    <>
                        <span className="flex-1 text-left text-[11px] font-bold tracking-widest">{item.label}</span>
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {full && isOpen && (
                <div className="ml-6 space-y-0.5 border-l border-primary/10 pl-3">
                    {item.children.map((tool) => {
                        const isChecked = isActiveHref(currentUrl, tool.href);

                        return (
                            <Link
                                key={tool.label}
                                href={tool.href}
                                aria-current={isChecked ? 'page' : undefined}
                                className={`flex min-h-7 items-center gap-2 rounded-lg border px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all hover:bg-primary/5 hover:text-primary ${
                                    isChecked
                                        ? 'border-primary/25 bg-primary/12 text-primary shadow-[inset_0_0_0_1px_rgba(204,255,0,0.12)]'
                                        : 'border-transparent text-on-surface-variant/70'
                                }`}
                            >
                                <span className="min-w-0 flex-1 truncate">{tool.label}</span>
                                {isChecked && <Check size={12} className="shrink-0 drop-shadow-[0_0_5px_rgba(204,255,0,0.7)]" />}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
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

import { type SharedData } from '@/types';
import { useInstantCyberClick } from '@/contexts/instant-navigation-context';
import { devToolLinks } from '@/lib/dev-tools-pages';
import { Link } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronLeft,
    Check,
    Command,
    Construction,
    Facebook,
    FileText,
    Github,
    Instagram,
    Share2,
    Terminal,
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

export default function CyberSidebar({ currentUrl, isOpen, user, onClose, onOpen }: CyberSidebarProps) {
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
                <NavItem icon={<Terminal size={18} />} label="TERMINAL" href="/" active={isActiveHref(currentUrl, '/')} full={isOpen} />
                <DevToolsMenu
                    currentUrl={currentUrl}
                    isOpen={isDevToolsOpen}
                    onCollapsedOpen={() => {
                        setDevToolsOpen(true);
                        onOpen();
                    }}
                    onToggle={() => setDevToolsOpen(!isDevToolsOpen)}
                    full={isOpen}
                />
                <NavItem icon={<Share2 size={18} />} label="PROJECTS" href="/#projects" full={isOpen} />
                <NavItem icon={<FileText size={18} />} label="SYSTEM_LOGS" href="/#logs" full={isOpen} />
                {user && <NavItem icon={<Command size={18} />} label="PROFILE" href="/profile" active={isActiveHref(currentUrl, '/profile')} full={isOpen} />}
            </nav>

            <SocialLinks full={isOpen} />
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

function NavItem({ icon, label, href, active = false, full }: { icon: ReactNode; label: string; href: string; active?: boolean; full: boolean }) {
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
            {icon}
            {full && <span className="text-[11px] font-bold tracking-widest">{label}</span>}
        </Link>
    );
}

function DevToolsMenu({
    currentUrl,
    isOpen,
    onCollapsedOpen,
    onToggle,
    full,
}: {
    currentUrl: string;
    isOpen: boolean;
    onCollapsedOpen: () => void;
    onToggle: () => void;
    full: boolean;
}) {
    const isActive = currentUrl.startsWith('/dev-tools');

    return (
        <div className="space-y-1">
            <button
                type="button"
                aria-label="DEV_TOOLS"
                title="DEV_TOOLS"
                onClick={() => {
                    if (full) {
                        onToggle();
                        return;
                    }

                    onCollapsedOpen();
                }}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-primary/5 hover:text-primary ${
                    full ? '' : 'justify-center'
                } ${
                    isActive
                        ? 'bg-primary text-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)]'
                        : 'text-on-surface-variant'
                }`}
            >
                <Construction size={18} />
                {full && (
                    <>
                        <span className="flex-1 text-left text-[11px] font-bold tracking-widest">DEV_TOOLS</span>
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {full && isOpen && (
                <div className="ml-6 space-y-0.5 border-l border-primary/10 pl-3">
                    {devToolLinks.map((tool) => (
                        <DevToolLink key={tool.label} currentUrl={currentUrl} tool={tool} />
                    ))}
                </div>
            )}
        </div>
    );
}

function DevToolLink({
    currentUrl,
    tool,
}: {
    currentUrl: string;
    tool: (typeof devToolLinks)[number];
}) {
    const handleClick = useInstantCyberClick(tool.href);
    const isChecked = isActiveHref(currentUrl, tool.href);

    return (
        <Link
            href={tool.href}
            prefetch="mount"
            cacheFor="5m"
            onClick={handleClick}
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
}

function SocialLinks({ full }: { full: boolean }) {
    const links = [
        { label: 'Github', icon: <Github size={14} /> },
        { label: 'Twitter', icon: <Twitter size={14} /> },
        { label: 'Instagram', icon: <Instagram size={14} /> },
        { label: 'Facebook', icon: <Facebook size={14} /> },
    ];

    return (
        <div className={`shrink-0 border-t border-white/5 p-3 ${full ? '' : 'px-3'}`}>
            <div className={`grid gap-2 ${full ? 'grid-cols-4' : 'grid-cols-1'}`}>
                {links.map((link) => (
                    <a
                        key={link.label}
                        href="#"
                        aria-label={link.label}
                        title={link.label}
                        className="flex min-h-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-on-surface-variant transition-all hover:border-primary/50 hover:bg-primary hover:text-black hover:shadow-[0_0_14px_rgba(204,255,0,0.45)]"
                    >
                        {link.icon}
                    </a>
                ))}
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

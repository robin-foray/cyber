import { type SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronLeft,
    Check,
    Command,
    Construction,
    Cpu,
    Facebook,
    FileText,
    Github,
    Globe,
    Instagram,
    Layers,
    Network,
    Terminal,
    Twitter,
    Zap,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import ForayBrand from './foray-brand';
import Dock from './dock';
import SpecularButton from './specular-button';

type CyberSidebarProps = {
    currentUrl: string;
    isOpen: boolean;
    user: SharedData['auth']['user'];
    onClose: () => void;
    onOpen: () => void;
};

const devLinks = [
    { label: 'CONSOLE', href: '/dev-tools/console' },
    { label: 'RUNTIME', href: '/dev-tools/runtime' },
    { label: 'HASH_GENERATOR', href: '/dev-tools/hash-generator' },
    { label: 'CRON_GURU', href: '/dev-tools/cron-guru' },
    { label: 'IMAGE_COMPRESSOR', href: '/dev-tools/image-compressor' },
    { label: 'DEPLOYMENTS', href: '/dev-tools/deployments' },
];

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

            <div className={`mb-1.5 flex shrink-0 flex-col px-2.5 pt-3 pb-1.5 ${!isOpen ? 'items-center' : ''}`}>
                <ForayBrand isOpen={isOpen} onOpen={onOpen} />

                {isOpen && <NodeIdentity user={user} />}
            </div>

            <nav className={`flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isOpen ? 'px-2.5' : 'items-center px-0'}`}>
                <NavItem icon={<Terminal size={isOpen ? 14 : 16} />} label="TERMINAL" href="/" active={isActiveHref(currentUrl, '/')} full={isOpen} />
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
                <NavItem icon={<Cpu size={isOpen ? 14 : 16} />} label="MACHINES" href="/machines" active={isActiveHref(currentUrl, '/machines')} full={isOpen} />
                <NavItem icon={<Layers size={isOpen ? 14 : 16} />} label="TECH_STACK" href="/tech-stack" active={isActiveHref(currentUrl, '/tech-stack')} full={isOpen} />
                <NavItem icon={<Globe size={isOpen ? 14 : 16} />} label="USEFUL_SITES" href="/useful-sites" active={isActiveHref(currentUrl, '/useful-sites')} full={isOpen} />
                <NavItem icon={<Network size={isOpen ? 14 : 16} />} label="FREE_APIS" href="/free-apis" active={isActiveHref(currentUrl, '/free-apis')} full={isOpen} />
                <NavItem icon={<FileText size={isOpen ? 14 : 16} />} label="SYSTEM_LOGS" href="/#logs" full={isOpen} />
                {user && <NavItem icon={<Command size={isOpen ? 14 : 16} />} label="PROFILE" href="/profile" active={isActiveHref(currentUrl, '/profile')} full={isOpen} />}
            </nav>

            <SocialLinks full={isOpen} />
        </aside>
    );
}

function NodeIdentity({ user }: { user: SharedData['auth']['user'] }) {
    const label = user?.name ?? 'GUEST_NODE';
    const role = user?.is_admin ? 'ADMIN' : (user?.role ?? 'VISITOR').toString().toUpperCase();
    const title = user?.title ?? 'SYSTEM: ONLINE';

    return (
        <Link href={user ? '/profile' : '/login'} className="mt-1 block w-full overflow-hidden rounded-lg border border-primary/10 bg-surface/50 px-2.5 py-2 transition-all hover:border-primary/30 hover:bg-primary/5">
            <p className="truncate text-[9px] tracking-widest text-primary uppercase opacity-70">Node_Identity</p>
            <div className="mt-1.5 flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    {user?.avatar_url ? <img src={user.avatar_url} alt={label} className="h-full w-full object-cover" /> : <Zap size={13} />}
                </div>
                <div className="min-w-0">
                    <h2 className="font-display truncate text-sm font-bold leading-tight">{label}</h2>
                    <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#ccff00]" />
                        <span className="truncate text-[9px] opacity-60">
                            {role} // {title}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function NavItem({ icon, label, href, active = false, full }: { icon: ReactNode; label: string; href: string; active?: boolean; full: boolean }) {
    return (
        <SpecularButton
            href={href}
            aria-label={label}
            title={label}
            active={active}
            size="xs"
            radius={full ? 10 : 8}
            className={full ? '' : 'specular-button--nav-icon justify-center'}
            labelClassName={full ? 'justify-start' : 'justify-center'}
            autoAnimate={active}
        >
            {icon}
            {full && <span className="text-[10px] font-bold tracking-widest">{label}</span>}
        </SpecularButton>
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
        <div className="flex flex-col gap-2.5">
            <SpecularButton
                type="button"
                aria-label="DEV_TOOLS"
                title="DEV_TOOLS"
                active={isActive}
                autoAnimate={isActive}
                size="xs"
                radius={full ? 10 : 8}
                className={full ? '' : 'specular-button--nav-icon justify-center'}
                labelClassName={full ? 'justify-start' : 'justify-center'}
                onClick={() => {
                    if (full) {
                        onToggle();
                        return;
                    }

                    onCollapsedOpen();
                }}
            >
                <Construction size={full ? 14 : 16} />
                {full && (
                    <>
                        <span className="flex-1 text-left text-[10px] font-bold tracking-widest">DEV_TOOLS</span>
                        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </SpecularButton>

            {full && isOpen && (
                <div className="ml-4 flex flex-col gap-1 border-l border-primary/10 pl-2">
                    {devLinks.map((tool) => {
                        const isChecked = isActiveHref(currentUrl, tool.href);

                        return (
                            <Link
                                key={tool.label}
                                href={tool.href}
                                aria-current={isChecked ? 'page' : undefined}
                                className={`flex min-h-6 items-center gap-1.5 rounded-md border px-2 py-1 text-[8px] font-bold tracking-widest uppercase transition-all hover:bg-primary/5 hover:text-primary ${
                                    isChecked
                                        ? 'border-primary/25 bg-primary/12 text-primary shadow-[inset_0_0_0_1px_rgba(204,255,0,0.12)]'
                                        : 'border-transparent text-on-surface-variant/70'
                                }`}
                            >
                                <span className="min-w-0 flex-1 truncate">{tool.label}</span>
                                {isChecked && <Check size={10} className="shrink-0 drop-shadow-[0_0_5px_rgba(204,255,0,0.7)]" />}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SocialLinks({ full }: { full: boolean }) {
    const links = [
        { label: 'Github', icon: <Github size={13} /> },
        { label: 'Twitter', icon: <Twitter size={13} /> },
        { label: 'Instagram', icon: <Instagram size={13} /> },
        { label: 'Facebook', icon: <Facebook size={13} /> },
    ];

    return (
        <div className={`flex shrink-0 justify-center overflow-visible px-2 pb-3 pt-1 ${full ? '' : 'px-1.5'}`}>
            <Dock
                orientation={full ? 'horizontal' : 'vertical'}
                baseItemSize={full ? 30 : 28}
                magnification={full ? 38 : 34}
                distance={full ? 90 : 70}
                panelHeight={full ? 42 : 38}
                items={links.map((link) => ({
                    label: link.label,
                    icon: link.icon,
                    onClick: () => undefined,
                }))}
            />
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

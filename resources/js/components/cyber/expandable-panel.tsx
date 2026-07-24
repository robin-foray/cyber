import { ChevronDown } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

type CyberExpandablePanelProps = {
    storageKey: string;
    title: string;
    subtitle?: string;
    defaultOpen?: boolean;
    className?: string;
    headerClassName?: string;
    children: ReactNode;
    trailing?: ReactNode;
};

function readStoredOpen(storageKey: string, defaultOpen: boolean) {
    if (typeof window === 'undefined') {
        return defaultOpen;
    }

    const stored = window.localStorage.getItem(storageKey);

    if (stored === null) {
        return defaultOpen;
    }

    return stored === 'true';
}

export default function CyberExpandablePanel({
    storageKey,
    title,
    subtitle,
    defaultOpen = true,
    className = '',
    headerClassName = '',
    children,
    trailing,
}: CyberExpandablePanelProps) {
    const [isOpen, setIsOpen] = useState(() => readStoredOpen(storageKey, defaultOpen));

    useEffect(() => {
        window.localStorage.setItem(storageKey, String(isOpen));
    }, [isOpen, storageKey]);

    return (
        <section className={`overflow-hidden rounded-3xl border border-white/5 bg-surface ${className}`}>
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-primary/5 sm:px-8 sm:py-5 ${headerClassName}`}
            >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_#ccff00]" />
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold tracking-widest text-primary uppercase">{title}</span>
                    {subtitle && (
                        <span className="mt-1 block text-[10px] font-bold tracking-widest text-on-surface-variant/70 uppercase">{subtitle}</span>
                    )}
                </span>
                {trailing}
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-primary/10 px-5 pb-6 pt-5 sm:px-8 sm:pb-8">{children}</div>
                </div>
            </div>
        </section>
    );
}

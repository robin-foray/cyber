import { useInstantCyberClick } from '@/contexts/instant-navigation-context';
import {
    coolStuffMenu,
    coolStuffStorageKey,
    findCoolStuffCategoryIdForHref,
    isCoolStuffHref,
    readCoolStuffCategoryState,
    writeCoolStuffCategoryState,
    type CoolStuffLink,
} from '@/lib/cool-stuff-menu';
import { Link } from '@inertiajs/react';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

type CoolStuffMenuProps = {
    currentUrl: string;
    isOpen: boolean;
    onCollapsedOpen: () => void;
    onToggle: () => void;
    full: boolean;
};

export default function CoolStuffMenu({ currentUrl, isOpen, onCollapsedOpen, onToggle, full }: CoolStuffMenuProps) {
    const isActive = isCoolStuffHref(currentUrl);
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => readCoolStuffCategoryState());

    useEffect(() => {
        const activeCategoryId = findCoolStuffCategoryIdForHref(currentUrl.split('?')[0]?.split('#')[0] ?? '');

        if (!activeCategoryId) {
            return;
        }

        setOpenCategories((current) => {
            if (current[activeCategoryId]) {
                return current;
            }

            const next = { ...current, [activeCategoryId]: true };
            writeCoolStuffCategoryState(next);

            return next;
        });
    }, [currentUrl]);

    useEffect(() => {
        writeCoolStuffCategoryState(openCategories);
    }, [openCategories]);

    function toggleCategory(categoryId: string) {
        setOpenCategories((current) => ({
            ...current,
            [categoryId]: !current[categoryId],
        }));
    }

    return (
        <div className="space-y-1">
            <button
                type="button"
                aria-label="COOL_STUFF"
                title="COOL_STUFF"
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
                <Sparkles size={18} />
                {full && (
                    <>
                        <span className="flex-1 text-left text-[11px] font-bold tracking-widest">COOL_STUFF</span>
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {full && isOpen && (
                <div className="ml-3 space-y-2 border-l border-primary/10 pl-3">
                    {coolStuffMenu.map((category) => (
                        <CoolStuffCategorySection
                            key={category.id}
                            category={category}
                            currentUrl={currentUrl}
                            isOpen={openCategories[category.id] ?? false}
                            onToggle={() => toggleCategory(category.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export { coolStuffStorageKey };

function CoolStuffCategorySection({
    category,
    currentUrl,
    isOpen,
    onToggle,
}: {
    category: (typeof coolStuffMenu)[number];
    currentUrl: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const hasActiveItem = category.items.some((item) => isActiveHref(currentUrl, item.href));

    return (
        <div className="space-y-1">
            <button
                type="button"
                onClick={onToggle}
                className={`flex min-h-8 w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all hover:bg-primary/5 hover:text-primary ${
                    hasActiveItem
                        ? 'border-primary/20 bg-primary/8 text-primary'
                        : 'border-primary/10 text-on-surface-variant/80'
                }`}
            >
                <span className="flex-1 text-left">{category.label}</span>
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="space-y-0.5 pl-2">
                    {category.items.map((item) => (
                        <CoolStuffLinkItem key={item.page} currentUrl={currentUrl} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CoolStuffLinkItem({ currentUrl, item }: { currentUrl: string; item: CoolStuffLink }) {
    const handleClick = useInstantCyberClick(item.href);
    const isChecked = isActiveHref(currentUrl, item.href);

    return (
        <Link
            href={item.href}
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
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {isChecked && <Check size={12} className="shrink-0 drop-shadow-[0_0_5px_rgba(204,255,0,0.7)]" />}
        </Link>
    );
}

function isActiveHref(currentUrl: string, href: string) {
    const currentPath = currentUrl.split('?')[0]?.split('#')[0] ?? '';
    const hrefPath = href.split('?')[0]?.split('#')[0] ?? '';

    return currentPath === hrefPath || currentPath.startsWith(`${hrefPath}/`);
}

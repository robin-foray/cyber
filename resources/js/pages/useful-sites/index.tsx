import CategoryChip from '@/components/cyber/category-chip';
import { Head, router } from '@inertiajs/react';
import {
    Box,
    Braces,
    Code2,
    ExternalLink,
    Film,
    Globe,
    Image,
    Layers,
    LayoutGrid,
    Link2,
    Package,
    PenTool,
} from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sites_count?: number;
};

type SiteItem = {
    id: number;
    name: string;
    slug: string;
    url: string;
    summary: string | null;
    icon: string;
    category: string | null;
    category_slug: string | null;
    host: string | null;
};

type Props = {
    categories: Category[];
    sites: SiteItem[];
    activeCategory: string | null;
};

const iconMap: Record<string, ReactNode> = {
    film: <Film size={22} />,
    image: <Image size={22} />,
    layout: <LayoutGrid size={22} />,
    layers: <Layers size={22} />,
    pen: <PenTool size={22} />,
    box: <Box size={22} />,
    package: <Package size={22} />,
    globe: <Globe size={22} />,
    code: <Code2 size={22} />,
    braces: <Braces size={22} />,
    link: <Link2 size={22} />,
};

export default function UsefulSitesIndex({ categories = [], sites = [], activeCategory = null }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(sites[0]?.id ?? null);
    const selected = useMemo(() => sites.find((site) => site.id === selectedId) ?? sites[0] ?? null, [selectedId, sites]);
    const detailRef = useRef<HTMLElement | null>(null);
    const skipScrollRef = useRef(true);

    useEffect(() => {
        if (skipScrollRef.current) {
            skipScrollRef.current = false;
            return;
        }

        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [selectedId]);

    function selectSite(id: number) {
        setSelectedId(id);
    }

    function selectCategory(slug: string | null) {
        router.get(
            '/useful-sites',
            slug ? { category: slug } : {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Useful Sites" />

            <section className="space-y-6">
                <div className="cyber-grid rounded-3xl border border-primary/15 bg-surface/80 p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-2 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                                <Globe size={18} />
                                USEFUL_SITES
                            </div>
                            <p className="max-w-2xl text-sm text-on-surface-variant">
                                Quick-launch registry for everyday tools. Open a card to inspect, then jump out via link.
                            </p>
                        </div>
                        <div className="rounded-xl border border-primary/20 bg-black/40 px-3 py-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                            {sites.length} links // {categories.length} groups
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-wrap gap-2">
                        <CategoryChip active={!activeCategory} onClick={() => selectCategory(null)}>
                            ALL
                        </CategoryChip>
                        {categories.map((category) => (
                            <CategoryChip
                                key={category.id}
                                active={activeCategory === category.slug}
                                onClick={() => selectCategory(category.slug)}
                            >
                                {category.name.toUpperCase().replaceAll(' ', '_')}
                            </CategoryChip>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,340px)]">
                    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(9.5rem,9.5rem))] lg:justify-start">
                        {sites.map((site, index) => {
                            const isActive = selected?.id === site.id;

                            return (
                                <motion.button
                                    key={site.id}
                                    type="button"
                                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ delay: index * 0.04, duration: 0.45, ease: 'easeOut' }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => selectSite(site.id)}
                                    onDoubleClick={() => window.open(site.url, '_blank', 'noopener,noreferrer')}
                                    className={`group relative flex h-40 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                                        isActive
                                            ? 'border-primary bg-primary text-black shadow-[0_0_24px_rgba(204,255,0,0.28)]'
                                            : 'border-primary/15 bg-black/40 text-on-surface-variant hover:border-primary/45 hover:bg-primary/8 hover:text-primary'
                                    }`}
                                >
                                    <div className="relative z-10 flex w-full items-start justify-between gap-2">
                                        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {iconMap[site.icon] ?? <Link2 size={22} />}
                                        </span>
                                        <ExternalLink size={12} className={isActive ? 'opacity-70' : 'opacity-40'} />
                                    </div>
                                    <div className="relative z-10 mt-4 w-full">
                                        <p className="font-display truncate text-base font-bold tracking-wide uppercase">{site.name}</p>
                                        <p className={`mt-1 truncate text-[9px] font-bold tracking-widest uppercase ${isActive ? 'text-black/55' : 'text-on-surface-variant/50'}`}>
                                            {site.category}
                                        </p>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    <motion.aside
                        ref={detailRef}
                        key={selected?.id ?? 'empty'}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="scroll-mt-24 rounded-3xl border border-primary/20 bg-surface-low/80 p-6 shadow-[0_0_28px_rgba(204,255,0,0.08)]"
                    >
                        {selected ? (
                            <div className="space-y-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-primary uppercase">{selected.category}</p>
                                        <h2 className="font-display mt-1 text-3xl font-bold uppercase">{selected.name}</h2>
                                        <p className="mt-1 truncate text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">{selected.host}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                                        {iconMap[selected.icon] ?? <Link2 size={22} />}
                                    </div>
                                </div>

                                <p className="text-sm leading-relaxed text-on-surface-variant">{selected.summary}</p>

                                <a
                                    href={selected.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary px-4 py-2.5 text-[10px] font-bold tracking-widest text-black uppercase transition hover:shadow-[0_0_18px_rgba(204,255,0,0.35)]"
                                >
                                    Open Site <ExternalLink size={14} />
                                </a>
                            </div>
                        ) : (
                            <p className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">No sites in this group</p>
                        )}
                    </motion.aside>
                </div>
            </section>
        </>
    );
}

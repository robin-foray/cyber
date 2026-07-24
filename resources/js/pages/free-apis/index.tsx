import CategoryChip from '@/components/cyber/category-chip';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Braces,
    Check,
    Cloud,
    Code2,
    Coins,
    Copy,
    ExternalLink,
    Globe,
    GraduationCap,
    Map,
    MessageSquare,
    Network,
    Package,
    PawPrint,
    Rocket,
    Search,
    Smile,
    Tv,
    Utensils,
    Users,
    Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    accent: string;
    apis_count?: number;
};

type ApiItem = {
    id: number;
    name: string;
    slug: string;
    url: string;
    base_url: string | null;
    sample_endpoint: string | null;
    summary: string | null;
    auth: string;
    https: boolean;
    cors: boolean;
    icon: string;
    category: string | null;
    category_slug: string | null;
    accent: string;
    host: string | null;
};

type Props = {
    categories: Category[];
    apis: ApiItem[];
    activeCategory: string | null;
};

const iconMap: Record<string, ReactNode> = {
    globe: <Globe size={22} />,
    code: <Code2 size={22} />,
    braces: <Braces size={22} />,
    package: <Package size={22} />,
    paw: <PawPrint size={22} />,
    zap: <Zap size={22} />,
    coins: <Coins size={22} />,
    network: <Network size={22} />,
    map: <Map size={22} />,
    cloud: <Cloud size={22} />,
    smile: <Smile size={22} />,
    message: <MessageSquare size={22} />,
    tv: <Tv size={22} />,
    rocket: <Rocket size={22} />,
    book: <BookOpen size={22} />,
    utensils: <Utensils size={22} />,
    users: <Users size={22} />,
    graduation: <GraduationCap size={22} />,
};

const authFilters = [
    { value: 'all', label: 'ALL_AUTH' },
    { value: 'none', label: 'NO_AUTH' },
    { value: 'apiKey', label: 'API_KEY' },
    { value: 'oauth', label: 'OAUTH' },
    { value: 'bearer', label: 'BEARER' },
] as const;

function authLabel(auth: string): string {
    switch (auth) {
        case 'apiKey':
            return 'API KEY';
        case 'oauth':
            return 'OAUTH';
        case 'bearer':
            return 'BEARER';
        default:
            return 'NO AUTH';
    }
}

export default function FreeApisIndex({ categories, apis, activeCategory }: Props) {
    const [query, setQuery] = useState('');
    const [authFilter, setAuthFilter] = useState<(typeof authFilters)[number]['value']>('all');
    const [corsOnly, setCorsOnly] = useState(false);
    const [copied, setCopied] = useState(false);

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return apis.filter((api) => {
            if (authFilter !== 'all' && api.auth !== authFilter) {
                return false;
            }

            if (corsOnly && !api.cors) {
                return false;
            }

            if (!needle) {
                return true;
            }

            return [api.name, api.summary, api.category, api.host, api.base_url]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(needle));
        });
    }, [apis, authFilter, corsOnly, query]);

    const [selectedId, setSelectedId] = useState<number | null>(filtered[0]?.id ?? null);
    const selected = useMemo(
        () => filtered.find((api) => api.id === selectedId) ?? filtered[0] ?? null,
        [filtered, selectedId],
    );
    const detailRef = useRef<HTMLElement | null>(null);
    const skipScrollRef = useRef(true);

    useEffect(() => {
        if (!filtered.some((api) => api.id === selectedId)) {
            setSelectedId(filtered[0]?.id ?? null);
        }
    }, [filtered, selectedId]);

    useEffect(() => {
        if (skipScrollRef.current) {
            skipScrollRef.current = false;
            return;
        }

        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [selectedId]);

    function selectCategory(slug: string | null) {
        router.get(
            '/free-apis',
            slug ? { category: slug } : {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    async function copySample(endpoint: string) {
        try {
            await navigator.clipboard.writeText(endpoint);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    }

    return (
        <>
            <Head title="Free APIs" />

            <section className="space-y-6">
                <div className="cyber-grid min-w-0 overflow-hidden rounded-3xl border border-primary/15 bg-surface/80 p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                                <Network size={18} className="shrink-0" />
                                FREE_API_REGISTRY
                            </div>
                            <p className="max-w-2xl text-sm text-on-surface-variant">
                                Curated free public APIs — filter by layer, auth and CORS. Inspect samples, copy endpoints, open docs.
                                Source inspiration:{' '}
                                <a
                                    href="https://free-apis.github.io/#/browse"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary underline-offset-2 hover:underline"
                                >
                                    free-apis.github.io
                                </a>
                            </p>
                        </div>
                        <div className="rounded-xl border border-primary/20 bg-black/40 px-3 py-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                            {filtered.length}/{apis.length} endpoints // {categories.length} layers
                        </div>
                    </div>

                    <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="relative min-w-0 flex-1">
                            <Search size={14} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-primary/70" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search name, host, summary…"
                                className="w-full min-w-0 rounded-xl border border-primary/20 bg-black/45 py-2.5 pr-3 pl-9 text-base text-on-surface outline-none placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:shadow-[0_0_16px_rgba(204,255,0,0.12)] sm:text-sm"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => setCorsOnly((value) => !value)}
                            className={`shrink-0 rounded-xl border px-3 py-2.5 text-[10px] font-bold tracking-widest uppercase transition ${
                                corsOnly
                                    ? 'border-primary bg-primary text-black'
                                    : 'border-primary/20 bg-black/40 text-primary hover:border-primary/45'
                            }`}
                        >
                            CORS_ONLY
                        </button>
                    </div>

                    <div className="mb-4 flex min-w-0 flex-wrap gap-2">
                        {authFilters.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setAuthFilter(filter.value)}
                                className={`max-w-full truncate rounded-lg border px-2.5 py-1.5 text-[9px] font-bold tracking-widest uppercase transition ${
                                    authFilter === filter.value
                                        ? 'border-primary bg-primary/15 text-primary'
                                        : 'border-white/10 bg-black/30 text-on-surface-variant hover:border-primary/35 hover:text-primary'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex min-w-0 flex-wrap gap-2">
                        <CategoryChip active={!activeCategory} onClick={() => selectCategory(null)}>
                            ALL_LAYERS
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

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
                    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(9.5rem,9.5rem))] lg:justify-start">
                        {filtered.map((api, index) => {
                            const isActive = selected?.id === api.id;

                            return (
                                <motion.button
                                    key={api.id}
                                    type="button"
                                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ delay: index * 0.03, duration: 0.45, ease: 'easeOut' }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedId(api.id)}
                                    onDoubleClick={() => window.open(api.url, '_blank', 'noopener,noreferrer')}
                                    className={`group relative flex h-40 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                                        isActive
                                            ? 'border-primary bg-primary text-black shadow-[0_0_24px_rgba(204,255,0,0.28)]'
                                            : 'border-primary/15 bg-black/40 text-on-surface-variant hover:border-primary/45 hover:bg-primary/8 hover:text-primary'
                                    }`}
                                >
                                    <span
                                        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl"
                                        style={{ background: isActive ? '#000' : api.accent }}
                                    />
                                    <div className="relative z-10 flex w-full items-start justify-between gap-2">
                                        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {iconMap[api.icon] ?? <Globe size={22} />}
                                        </span>
                                        <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase ${isActive ? 'bg-black/15' : 'bg-primary/10 text-primary'}`}>
                                            {authLabel(api.auth)}
                                        </span>
                                    </div>
                                    <div className="relative z-10 mt-3 w-full">
                                        <p className="font-display truncate text-base font-bold tracking-wide uppercase">{api.name}</p>
                                        <p className={`mt-1 truncate text-[9px] font-bold tracking-widest uppercase ${isActive ? 'text-black/55' : 'text-on-surface-variant/50'}`}>
                                            {api.category}
                                        </p>
                                        <div className="mt-2 flex gap-1">
                                            {api.https && (
                                                <span className={`rounded px-1 py-0.5 text-[7px] font-bold tracking-widest ${isActive ? 'bg-black/15' : 'bg-white/5'}`}>
                                                    HTTPS
                                                </span>
                                            )}
                                            {api.cors && (
                                                <span className={`rounded px-1 py-0.5 text-[7px] font-bold tracking-widest ${isActive ? 'bg-black/15' : 'bg-white/5'}`}>
                                                    CORS
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}

                        {filtered.length === 0 && (
                            <p className="col-span-full text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">
                                No endpoints match current filters
                            </p>
                        )}
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
                                        {iconMap[selected.icon] ?? <Globe size={22} />}
                                    </div>
                                </div>

                                <p className="text-sm leading-relaxed text-on-surface-variant">{selected.summary}</p>

                                <div className="flex flex-wrap gap-2">
                                    <Badge label={authLabel(selected.auth)} />
                                    {selected.https && <Badge label="HTTPS" />}
                                    {selected.cors && <Badge label="CORS" />}
                                </div>

                                {selected.base_url && (
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold tracking-widest text-primary uppercase">Base URL</p>
                                        <p className="truncate rounded-xl border border-white/5 bg-black/35 px-3 py-2 font-mono text-[11px] text-on-surface-variant">
                                            {selected.base_url}
                                        </p>
                                    </div>
                                )}

                                {selected.sample_endpoint && (
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold tracking-widest text-primary uppercase">Sample</p>
                                        <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-black/35 p-2">
                                            <p className="min-w-0 flex-1 break-all font-mono text-[10px] leading-relaxed text-on-surface-variant">
                                                {selected.sample_endpoint}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => copySample(selected.sample_endpoint!)}
                                                className="shrink-0 rounded-lg border border-primary/25 p-2 text-primary transition hover:bg-primary/10"
                                                aria-label="Copy sample endpoint"
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={selected.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary px-4 py-2.5 text-[10px] font-bold tracking-widest text-black uppercase transition hover:shadow-[0_0_18px_rgba(204,255,0,0.35)]"
                                    >
                                        Open Docs <ExternalLink size={14} />
                                    </a>
                                    {selected.sample_endpoint && (
                                        <a
                                            href={selected.sample_endpoint}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-[10px] font-bold tracking-widest text-primary uppercase transition hover:bg-primary hover:text-black"
                                        >
                                            Try Sample <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">No endpoints in this layer</p>
                        )}
                    </motion.aside>
                </div>
            </section>
        </>
    );
}

function Badge({ label }: { label: string }) {
    return (
        <span className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[9px] font-bold tracking-widest text-primary uppercase">
            {label}
        </span>
    );
}

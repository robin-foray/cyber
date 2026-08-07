import CategoryChip from '@/components/cyber/category-chip';
import { StackIcon } from '@/lib/stack-icon';
import { Head, router } from '@inertiajs/react';
import { ExternalLink, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    accent: string;
    count: number;
};

type StackItem = {
    id: number;
    name: string;
    slug: string;
    signal: string | null;
    summary: string | null;
    bullets: string[];
    docs_url: string | null;
    icon: string;
    level: number;
    category: string | null;
    category_slug: string | null;
    accent: string;
};

type Props = {
    categories: Category[];
    stacks: StackItem[];
    activeCategory: string | null;
};

export default function TechStackIndex({ categories = [], stacks = [], activeCategory = null }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(stacks[0]?.id ?? null);
    const selected = useMemo(() => stacks.find((stack) => stack.id === selectedId) ?? stacks[0] ?? null, [selectedId, stacks]);
    const detailRef = useRef<HTMLElement | null>(null);
    const skipScrollRef = useRef(true);

    useEffect(() => {
        if (skipScrollRef.current) {
            skipScrollRef.current = false;
            return;
        }

        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [selectedId]);

    function selectStack(id: number) {
        setSelectedId(id);
    }

    function selectCategory(slug: string | null) {
        router.get(
            '/tech-stack',
            slug ? { category: slug } : {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Tech Stack" />

            <section className="space-y-6">
                <div className="cyber-grid rounded-3xl border border-primary/15 bg-surface/80 p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-2 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                                <Layers size={18} />
                                TECH_STACK_REGISTRY
                            </div>
                            <p className="max-w-2xl text-sm text-on-surface-variant">
                                Categorized engineering modules with live interaction. Filter by layer, inspect telemetry, open docs.
                            </p>
                        </div>
                        <div className="rounded-xl border border-primary/20 bg-black/40 px-3 py-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                            {stacks.length} modules // {categories.length} layers
                        </div>
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

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,340px)]">
                    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(9.5rem,9.5rem))] lg:justify-start">
                        {stacks.map((stack, index) => {
                            const isActive = selected?.id === stack.id;

                            return (
                                <motion.button
                                    key={stack.id}
                                    type="button"
                                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ delay: index * 0.04, duration: 0.45, ease: 'easeOut' }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => selectStack(stack.id)}
                                    className={`group relative flex h-40 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                                        isActive
                                            ? 'border-primary bg-primary text-black shadow-[0_0_24px_rgba(204,255,0,0.28)]'
                                            : 'border-primary/15 bg-black/40 text-on-surface-variant hover:border-primary/45 hover:bg-primary/8 hover:text-primary'
                                    }`}
                                >
                                    <span
                                        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl"
                                        style={{ background: isActive ? '#000' : stack.accent }}
                                    />
                                    <div className="relative z-10 flex w-full items-start justify-between gap-2">
                                        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            <StackIcon icon={stack.icon} />
                                        </span>
                                        <span className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase ${isActive ? 'bg-black/15' : 'bg-primary/10 text-primary'}`}>
                                            {stack.category}
                                        </span>
                                    </div>
                                    <div className="relative z-10 mt-4 w-full">
                                        <p className="font-display text-base font-bold tracking-wide uppercase">{stack.name}</p>
                                        <p className={`mt-1 truncate text-[9px] font-bold tracking-widest uppercase ${isActive ? 'text-black/55' : 'text-on-surface-variant/50'}`}>
                                            {stack.signal}
                                        </p>
                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/20">
                                            <motion.div
                                                className={`h-full rounded-full ${isActive ? 'bg-black' : 'bg-primary'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stack.level}%` }}
                                                transition={{ delay: 0.15 + index * 0.03, duration: 0.6 }}
                                            />
                                        </div>
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
                                        <p className="mt-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">{selected.signal}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                                        <StackIcon icon={selected.icon} className="h-7 w-7" />
                                    </div>
                                </div>

                                <p className="text-sm leading-relaxed text-on-surface-variant">{selected.summary}</p>

                                <div>
                                    <p className="mb-2 text-[10px] font-bold tracking-widest text-primary uppercase">Capabilities</p>
                                    <ul className="space-y-2">
                                        {selected.bullets.map((bullet) => (
                                            <li key={bullet} className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/35 px-3 py-2 text-[11px] font-bold tracking-wide text-on-surface-variant uppercase">
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#ccff00]" />
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                        <span className="text-on-surface-variant">Integrity</span>
                                        <span className="text-primary">{selected.level}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-black/40">
                                        <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${selected.level}%` }} transition={{ duration: 0.55 }} />
                                    </div>
                                </div>

                                {selected.docs_url && (
                                    <a
                                        href={selected.docs_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-[10px] font-bold tracking-widest text-primary uppercase transition hover:bg-primary hover:text-black"
                                    >
                                        Open Docs <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        ) : (
                            <p className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">No modules in this layer</p>
                        )}
                    </motion.aside>
                </div>
            </section>
        </>
    );
}

import { cyberLayout } from '@/layouts/cyber-layout';
import { Head, Link } from '@inertiajs/react';
import { Cpu, Database, ExternalLink, Layers, Play, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

type StackTech = {
    id: number;
    name: string;
    slug: string;
    signal: string | null;
    summary: string | null;
    bullets: string[];
    docs: string | null;
    icon: string;
    level: number;
    category: string | null;
    category_slug?: string | null;
    accent?: string;
};

type StackCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    accent: string;
    stacks: StackTech[];
};

type Props = {
    categories: StackCategory[];
    stacks: StackTech[];
    integrity: Array<{
        id: number;
        name: string;
        slug: string;
        icon: string;
        level: number;
        category: string | null;
        signal: string | null;
    }>;
    telemetry: {
        status: string;
        node: string;
        protocol: string;
        avg_integrity: number;
        counts: {
            stacks: number;
            layers: number;
            machines: number;
            free_apis: number;
            useful_sites: number;
        };
        top_layer: string | null;
        scanned_at: string;
    };
};

function stackIconSrc(icon: string): string | null {
    if (!icon) {
        return null;
    }

    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/')) {
        return icon;
    }

    if (icon.includes('/') || /\.(svg|png|webp|jpe?g)$/i.test(icon)) {
        return `/${icon.replace(/^\/+/, '')}`;
    }

    return null;
}

function StackIcon({ icon, className = 'h-7 w-7' }: { icon: string; className?: string }) {
    const src = stackIconSrc(icon);

    if (src) {
        return <img src={src} alt="" className={`${className} object-contain`} loading="lazy" />;
    }

    return <Cpu size={26} />;
}

export default function Welcome({ categories, stacks, integrity, telemetry }: Props) {
    const inputPayload = useMemo(
        () =>
            JSON.stringify(
                {
                    node: telemetry.node,
                    protocol: telemetry.protocol,
                    scan: ['stacks', 'machines', 'free_apis', 'useful_sites'],
                    layers: categories.map((category) => category.slug),
                },
                null,
                2,
            ),
        [categories, telemetry.node, telemetry.protocol],
    );

    const outputPayload = useMemo(
        () =>
            JSON.stringify(
                {
                    verified: true,
                    status: telemetry.status,
                    avg_integrity: `${telemetry.avg_integrity}%`,
                    registry: telemetry.counts,
                    top_layer: telemetry.top_layer,
                    scanned_at: telemetry.scanned_at,
                },
                null,
                2,
            ),
        [telemetry],
    );

    return (
        <>
            <Head title="Neural Dev Dashboard">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <section
                    className="glow-box group relative min-h-[430px] overflow-hidden rounded-3xl border border-primary/20 bg-surface-low p-8 transition-all duration-500 md:p-12"
                    style={{
                        backgroundImage: "url('/assets/hero-cyber-archer.png')",
                        backgroundPosition: '50% 50%',
                        backgroundSize: '108%',
                    }}
                >
                    <span className="hero-orbit-trace" aria-hidden="true" />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.82)_74%,rgba(0,0,0,0.95)_100%)]" />
                    <div className="cyber-grid absolute inset-0 opacity-60 mix-blend-screen" />
                    <div className="absolute inset-0 border border-primary/10 shadow-[inset_0_0_60px_rgba(204,255,0,0.12)]" />

                    <div className="relative z-10 ml-auto flex min-h-[330px] max-w-2xl flex-col items-start justify-center md:items-end md:text-right">
                        <span className="rounded-full border border-primary/30 bg-black/45 px-4 py-1 text-[10px] font-bold tracking-widest text-primary uppercase backdrop-blur-sm">
                            Deployment Protocol // Archive_01
                        </span>
                        <h1 className="font-display mt-7 text-4xl leading-none font-bold tracking-normal text-white uppercase drop-shadow-[0_0_18px_rgba(0,0,0,0.75)] md:text-6xl">
                            Architecting the <br />
                            <span className="glow-text text-primary">Digital Future</span>
                        </h1>
                        <div className="mt-10 flex flex-wrap gap-6">
                            <Link
                                href="/tech-stack"
                                className="font-display flex items-center gap-4 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(204,255,0,0.45)]"
                            >
                                LAUNCH_CORE <Play fill="black" />
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <section className="cyber-grid rounded-3xl border border-white/5 bg-surface p-6 sm:p-8 lg:col-span-8">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_10px_#ccff00]" />
                                DEV_TOOLS_CONSOLE
                            </div>
                            <span className="rounded-lg border border-primary/20 bg-black/40 px-2.5 py-1 text-[9px] font-bold tracking-widest text-primary uppercase">
                                {telemetry.status} // {telemetry.node}
                            </span>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                            <StatChip label="STACKS" value={telemetry.counts.stacks} href="/tech-stack" />
                            <StatChip label="LAYERS" value={telemetry.counts.layers} href="/tech-stack" />
                            <StatChip label="MACHINES" value={telemetry.counts.machines} href="/machines" />
                            <StatChip label="FREE_APIS" value={telemetry.counts.free_apis} href="/free-apis" />
                            <StatChip label="SITES" value={telemetry.counts.useful_sites} href="/useful-sites" className="col-span-2 sm:col-span-1" />
                        </div>

                        <div className="grid min-h-56 grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-2xl border border-white/5 bg-black/40 p-5 font-mono text-[11px] sm:p-6">
                                <p className="mb-3 text-primary/40">// INPUT_BUFFER</p>
                                <pre className="overflow-x-auto whitespace-pre-wrap break-all text-on-surface-variant">{inputPayload}</pre>
                            </div>
                            <div className="rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono text-[11px] shadow-[inset_0_0_28px_rgba(204,255,0,0.04)] sm:p-6">
                                <p className="mb-3 text-primary">// OUTPUT</p>
                                <pre className="overflow-x-auto whitespace-pre-wrap break-all text-primary">{outputPayload}</pre>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-white/5 bg-surface p-6 sm:p-8 lg:col-span-4">
                        <div className="mb-6 flex items-end justify-between gap-3 border-b border-primary/10 pb-4">
                            <h3 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Integrity_Check</h3>
                            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">{telemetry.avg_integrity}% AVG</span>
                        </div>
                        <div className="space-y-5">
                            {integrity.length > 0 ? (
                                integrity.map((stack, index) => (
                                    <SkillItem
                                        key={stack.id}
                                        label={stack.name.toUpperCase().replaceAll(' ', '_')}
                                        progress={stack.level}
                                        icon={stack.icon}
                                        category={stack.category}
                                        delay={index * 0.08}
                                    />
                                ))
                            ) : (
                                <>
                                    <SkillItem label="STACK_REGISTRY" progress={0} icon="" category={null} delay={0} />
                                    <SkillItem label="AWAITING_SEED" progress={0} icon="" category={null} delay={0.08} />
                                </>
                            )}
                        </div>
                        <Link
                            href="/tech-stack"
                            className="mt-6 inline-flex text-[9px] font-bold tracking-widest text-primary uppercase hover:underline"
                        >
                            open_integrity_map →
                        </Link>
                    </section>
                </div>

                <StacksSection categories={categories} stacks={stacks} />
        </>
    );
}

Welcome.layout = cyberLayout;

function StatChip({ label, value, href, className = '' }: { label: string; value: number; href: string; className?: string }) {
    return (
        <Link
            href={href}
            className={`rounded-xl border border-primary/15 bg-black/40 px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5 ${className}`}
        >
            <p className="text-[8px] font-bold tracking-widest text-on-surface-variant uppercase">{label}</p>
            <p className="font-display mt-1 text-2xl font-bold text-primary">{value}</p>
        </Link>
    );
}

function StacksSection({ categories, stacks }: { categories: StackCategory[]; stacks: StackTech[] }) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeStack, setActiveStack] = useState<StackTech | null>(null);

    const visibleCategories = useMemo(() => {
        if (!activeCategory) {
            return categories;
        }

        return categories.filter((category) => category.slug === activeCategory);
    }, [activeCategory, categories]);

    const visibleCount = useMemo(
        () => visibleCategories.reduce((total, category) => total + category.stacks.length, 0),
        [visibleCategories],
    );

    const layerKey = activeCategory ?? 'all';

    function selectCategory(slug: string | null) {
        setActiveCategory(slug);
        setActiveStack(null);
    }

    return (
        <section className="cyber-grid relative overflow-hidden rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
            <div className="pointer-events-none absolute -top-24 right-8 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10 mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_#ccff00]" />
                        STACKS_PROTOCOL
                    </div>
                    <h2 className="font-display text-3xl font-bold tracking-normal text-white uppercase md:text-5xl">
                        Tech <span className="glow-text text-primary">Stack</span>
                    </h2>
                </div>
                <div className="flex max-w-md flex-col gap-2 border-l border-primary/20 pl-4">
                    <p className="text-[10px] leading-5 font-bold tracking-widest text-on-surface-variant uppercase">
                        {visibleCount}/{stacks.length} cells // {categories.length} layers
                    </p>
                    <Link href="/tech-stack" className="text-[10px] font-bold tracking-widest text-primary uppercase hover:underline">
                        open_full_registry →
                    </Link>
                </div>
            </div>

            <div className="relative z-10 mb-6 flex flex-wrap gap-2">
                <CategoryChip active={!activeCategory} onClick={() => selectCategory(null)} label="ALL_LAYERS" />
                {categories.map((category) => (
                    <CategoryChip
                        key={category.id}
                        active={activeCategory === category.slug}
                        onClick={() => selectCategory(category.slug)}
                        label={category.name.toUpperCase().replaceAll(' ', '_')}
                        accent={category.accent}
                    />
                ))}
            </div>

            <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <div className="relative min-h-48 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={layerKey}
                            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="space-y-6"
                        >
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                                transition={{ duration: 0.55, ease: 'easeOut' }}
                            />

                            {visibleCategories.map((category, categoryIndex) => (
                                <motion.div
                                    key={category.id}
                                    className="space-y-3"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: categoryIndex * 0.06, duration: 0.35 }}
                                >
                                    <div className="flex items-end justify-between gap-3 border-b border-primary/10 pb-2">
                                        <div>
                                            <p className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">{category.name}</p>
                                            {category.description && (
                                                <p className="mt-1 text-[10px] tracking-wide text-on-surface-variant/70">{category.description}</p>
                                            )}
                                        </div>
                                        <span
                                            className="rounded-md border border-primary/15 bg-black/40 px-2 py-1 text-[8px] font-bold tracking-widest text-primary uppercase"
                                            style={{ boxShadow: `0 0 12px ${category.accent}22` }}
                                        >
                                            {category.stacks.length} modules
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                                        {category.stacks.map((tech, techIndex) => {
                                            const isActive = tech.id === activeStack?.id;

                                            return (
                                                <motion.button
                                                    key={tech.id}
                                                    type="button"
                                                    initial={{ opacity: 0, scale: 0.88, y: 14 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{
                                                        delay: 0.08 + categoryIndex * 0.05 + techIndex * 0.03,
                                                        duration: 0.35,
                                                        ease: 'easeOut',
                                                    }}
                                                    whileHover={{ y: -4, scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setActiveStack(isActive ? null : tech)}
                                                    className={`group relative flex aspect-square min-h-24 min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border p-3 text-center transition-colors duration-300 ${
                                                        isActive
                                                            ? 'border-primary bg-primary text-black shadow-[0_0_24px_rgba(204,255,0,0.28)]'
                                                            : 'border-primary/10 bg-black/35 text-on-surface-variant hover:border-primary/45 hover:bg-primary/8 hover:text-primary'
                                                    }`}
                                                >
                                                    <span
                                                        className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full opacity-25 blur-2xl"
                                                        style={{ background: isActive ? '#000' : category.accent }}
                                                    />
                                                    <span className={`relative z-10 mb-3 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                        <StackIcon icon={tech.icon} />
                                                    </span>
                                                    <span className="font-display relative z-10 w-full max-w-full truncate text-sm font-bold tracking-normal uppercase">
                                                        {tech.name}
                                                    </span>
                                                    <span
                                                        className={`relative z-10 mt-1 w-full max-w-full truncate text-[8px] font-bold tracking-[0.04em] uppercase ${
                                                            isActive ? 'text-black/60' : 'text-on-surface-variant/45'
                                                        }`}
                                                    >
                                                        {tech.signal}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}

                            {visibleCategories.length === 0 && (
                                <p className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">No layers online</p>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {activeStack && (
                        <StackDetails
                            activeStack={activeStack}
                            onClose={() => setActiveStack(null)}
                            className="mt-6 origin-top animate-in fade-in slide-in-from-top-2 duration-300 lg:hidden"
                        />
                    )}
                </div>

                {activeStack ? (
                    <StackDetails activeStack={activeStack} onClose={() => setActiveStack(null)} className="hidden lg:block" />
                ) : (
                    <div className="hidden min-h-72 items-center justify-center rounded-2xl border border-primary/10 bg-black/35 p-6 text-center shadow-[inset_0_0_34px_rgba(204,255,0,0.04)] lg:flex">
                        <div>
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary">
                                <Layers size={24} />
                            </div>
                            <p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                select_stack_cell // telemetry panel idle
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function CategoryChip({
    active,
    onClick,
    label,
    accent = '#ccff00',
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    accent?: string;
}) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            animate={
                active
                    ? {
                          scale: 1.04,
                          boxShadow: `0 0 18px ${accent}55`,
                      }
                    : {
                          scale: 1,
                          boxShadow: '0 0 0px transparent',
                      }
            }
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`relative overflow-hidden rounded-xl border px-3 py-2 text-[9px] font-bold tracking-widest uppercase transition-colors ${
                active
                    ? 'border-primary bg-primary text-black'
                    : 'border-primary/20 bg-black/40 text-primary hover:border-primary/45'
            }`}
        >
            {active && (
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                    initial={{ x: '-120%' }}
                    animate={{ x: '120%' }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                />
            )}
            <span className="relative z-10">{label}</span>
        </motion.button>
    );
}

function StackDetails({ activeStack, onClose, className = '' }: { activeStack: StackTech; onClose: () => void; className?: string }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-black/55 p-5 shadow-[inset_0_0_34px_rgba(204,255,0,0.06)] ${className}`}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-primary/10 pb-5">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_16px_rgba(204,255,0,0.14)]">
                        <StackIcon icon={activeStack.icon} className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-display truncate text-2xl font-bold text-white uppercase">{activeStack.name}</div>
                        <div className="truncate text-[10px] font-bold tracking-widest text-primary uppercase">
                            {activeStack.category ? `${activeStack.category} // ` : ''}
                            {activeStack.signal}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="Close stack details"
                    onClick={onClose}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/15 text-on-surface-variant transition-all hover:border-primary hover:bg-primary hover:text-black"
                >
                    <X size={14} />
                </button>
            </div>

            <p className="text-sm leading-7 text-on-surface-variant">{activeStack.summary}</p>

            <div className="mt-5 grid gap-2">
                {activeStack.bullets.map((bullet) => (
                    <div
                        key={bullet}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase"
                    >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_#ccff00]" />
                        <span className="min-w-0 truncate">{bullet}</span>
                    </div>
                ))}
            </div>

            {activeStack.docs && (
                <a
                    href={activeStack.docs}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] font-bold tracking-widest text-primary uppercase transition-all hover:bg-primary hover:text-black hover:shadow-[0_0_16px_rgba(204,255,0,0.35)]"
                >
                    open_docs <ExternalLink size={12} />
                </a>
            )}
        </div>
    );
}

function SkillItem({
    label,
    progress,
    icon,
    category,
    delay = 0,
}: {
    label: string;
    progress: number;
    icon: string;
    category: string | null;
    delay?: number;
}) {
    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold">
                <span className="flex min-w-0 items-center gap-2">
                    {icon ? <StackIcon icon={icon} className="h-4 w-4 shrink-0" /> : <Database size={12} className="shrink-0" />}
                    <span className="min-w-0 truncate">
                        {label}
                        {category ? <span className="ml-1 font-normal tracking-normal text-on-surface-variant/50">// {category}</span> : null}
                    </span>
                </span>
                <span className="shrink-0 text-primary">{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                    className="h-full bg-primary shadow-[0_0_8px_#ccff00]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.15 + delay, duration: 0.7, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

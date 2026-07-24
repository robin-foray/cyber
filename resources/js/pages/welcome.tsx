import { StackIcon } from '@/lib/stack-icon';
import { type CmsPageSection, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Database, ExternalLink, Layers, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type WelcomeStack = {
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
    category_slug: string | null;
    accent: string;
};

type WelcomeProps = {
    stacks?: WelcomeStack[];
};

export default function Welcome({ stacks = [] }: WelcomeProps) {
    const { cms } = usePage<SharedData>().props;
    const pageTitle = cms.settings.welcome_page_title ?? 'Neural Dev Dashboard';
    const integrityTitle = cms.settings.integrity_section_title ?? 'Integrity_Check';
    const stacksTitle = cms.settings.stacks_section_title ?? 'STACKS_PROTOCOL';
    const stacksHeadingPrefix = cms.settings.stacks_heading_prefix ?? 'Tech';
    const stacksHeadingAccent = cms.settings.stacks_heading_accent ?? 'Stack';
    const stacksPanelHint = cms.settings.stacks_panel_hint ?? 'live module registry // click a cell to open stack telemetry';

    return (
        <>
            <Head title={pageTitle}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <section
                className="glow-box group relative min-h-[430px] overflow-hidden rounded-3xl border border-primary/20 bg-surface-low bg-cover bg-center bg-no-repeat p-8 transition-all duration-500 md:p-12"
                style={{
                    backgroundImage: `url('${cms.hero.backgroundImage}')`,
                }}
            >
                <span className="hero-orbit-trace" aria-hidden="true" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.82)_74%,rgba(0,0,0,0.95)_100%)]" />
                <div className="cyber-grid absolute inset-0 opacity-60 mix-blend-screen" />
                <div className="absolute inset-0 border border-primary/10 shadow-[inset_0_0_60px_rgba(204,255,0,0.12)]" />

                <div className="relative z-10 ml-auto flex min-h-[330px] max-w-2xl flex-col items-start justify-center md:items-end md:text-right">
                    <span className="rounded-full border border-primary/30 bg-black/45 px-4 py-1 text-[10px] font-bold tracking-widest text-primary uppercase backdrop-blur-sm">
                        {cms.hero.badge}
                    </span>
                    <h1 className="font-display mt-7 text-4xl leading-none font-bold tracking-normal text-white uppercase drop-shadow-[0_0_18px_rgba(0,0,0,0.75)] md:text-6xl">
                        {cms.hero.titleLine} <br />
                        <span className="glow-text text-primary">{cms.hero.titleAccent}</span>
                    </h1>
                    <div className="mt-10 flex flex-wrap gap-6">
                        <button
                            type="button"
                            className="font-display flex items-center gap-4 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(204,255,0,0.45)]"
                        >
                            {cms.hero.ctaLabel} <Play fill="black" />
                        </button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <section className="cyber-grid rounded-3xl border border-white/5 bg-surface p-8 lg:col-span-8">
                    <div className="mb-8 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_#ccff00]" />
                        {cms.homeConsole.sectionLabel}
                    </div>
                    <div className="grid min-h-64 grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/5 bg-black/40 p-6 font-mono text-[11px]">
                            <p className="mb-2 text-primary/30">// INPUT_BUFFER</p>
                            <code className="text-on-surface-variant">{cms.homeConsole.inputSample}</code>
                        </div>
                        <div className="rounded-2xl border border-primary/20 bg-black/60 p-6 font-mono text-[11px]">
                            <p className="mb-2 text-primary">// OUTPUT</p>
                            <code className="text-primary">{cms.homeConsole.outputSample}</code>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/5 bg-surface p-8 lg:col-span-4">
                    <h3 className="mb-8 border-b border-primary/10 pb-4 text-[10px] font-bold tracking-[0.3em] text-primary uppercase">
                        {integrityTitle}
                    </h3>
                    <div className="space-y-6">
                        {cms.skills.map((skill) => (
                            <SkillItem key={skill.label} label={skill.label} progress={skill.progress} />
                        ))}
                    </div>
                </section>
            </div>

            <StacksSection
                stacks={stacks}
                sectionTitle={stacksTitle}
                headingPrefix={stacksHeadingPrefix}
                headingAccent={stacksHeadingAccent}
                panelHint={stacksPanelHint}
            />

            <PageSections sections={cms.pageSections} />
        </>
    );
}

function StacksSection({
    stacks,
    sectionTitle,
    headingPrefix,
    headingAccent,
    panelHint,
}: {
    stacks: WelcomeStack[];
    sectionTitle: string;
    headingPrefix: string;
    headingAccent: string;
    panelHint: string;
}) {
    const [selectedId, setSelectedId] = useState<number | null>(stacks[0]?.id ?? null);
    const selected = useMemo(
        () => stacks.find((stack) => stack.id === selectedId) ?? stacks[0] ?? null,
        [selectedId, stacks],
    );
    const detailRef = useRef<HTMLElement | null>(null);
    const skipScrollRef = useRef(true);

    useEffect(() => {
        if (!stacks.some((stack) => stack.id === selectedId)) {
            setSelectedId(stacks[0]?.id ?? null);
        }
    }, [stacks, selectedId]);

    useEffect(() => {
        if (skipScrollRef.current) {
            skipScrollRef.current = false;
            return;
        }

        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [selectedId]);

    return (
        <section className="cyber-grid relative overflow-hidden rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
            <div className="pointer-events-none absolute -top-24 right-8 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10 mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_#ccff00]" />
                        {sectionTitle}
                    </div>
                    <h2 className="font-display text-3xl font-bold tracking-normal text-white uppercase md:text-5xl">
                        {headingPrefix} <span className="glow-text text-primary">{headingAccent}</span>
                    </h2>
                </div>
                <div className="flex max-w-md flex-col gap-3 border-l border-primary/20 pl-4">
                    <p className="text-[10px] leading-5 font-bold tracking-widest text-on-surface-variant uppercase">{panelHint}</p>
                    <Link
                        href="/tech-stack"
                        className="inline-flex w-fit items-center gap-2 text-[10px] font-bold tracking-widest text-primary uppercase transition hover:underline"
                    >
                        Open full registry <ExternalLink size={12} />
                    </Link>
                </div>
            </div>

            <div className="relative z-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,340px)]">
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
                                onClick={() => setSelectedId(stack.id)}
                                className={`group relative flex h-40 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                                    isActive
                                        ? 'border-primary bg-primary text-black shadow-[0_0_24px_rgba(204,255,0,0.28)]'
                                        : 'border-primary/15 bg-black/40 text-on-surface-variant hover:border-primary/45 hover:bg-primary/8 hover:text-primary'
                                }`}
                            >
                                <span
                                    className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-30 blur-2xl"
                                    style={{ background: isActive ? '#000' : stack.accent }}
                                />
                                <div className="relative z-10 flex w-full items-start justify-between gap-2">
                                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        <StackIcon icon={stack.icon} />
                                    </span>
                                    <span
                                        className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase ${
                                            isActive ? 'bg-black/15' : 'bg-primary/10 text-primary'
                                        }`}
                                    >
                                        {stack.category}
                                    </span>
                                </div>
                                <div className="relative z-10 mt-4 w-full">
                                    <p className="font-display text-base font-bold tracking-wide uppercase">{stack.name}</p>
                                    <p
                                        className={`mt-1 truncate text-[9px] font-bold tracking-widest uppercase ${
                                            isActive ? 'text-black/55' : 'text-on-surface-variant/50'
                                        }`}
                                    >
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
                                    <h3 className="font-display mt-1 text-3xl font-bold uppercase">{selected.name}</h3>
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
                                        <li
                                            key={bullet}
                                            className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/35 px-3 py-2 text-[11px] font-bold tracking-wide text-on-surface-variant uppercase"
                                        >
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
                                    <motion.div
                                        className="h-full rounded-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${selected.level}%` }}
                                        transition={{ duration: 0.55 }}
                                    />
                                </div>
                            </div>

                            {selected.docs && (
                                <a
                                    href={selected.docs}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-[10px] font-bold tracking-widest text-primary uppercase transition hover:bg-primary hover:text-black"
                                >
                                    Open Docs <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-72 flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary">
                                <Layers size={24} />
                            </div>
                            <p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                select_stack_cell // telemetry panel idle
                            </p>
                        </div>
                    )}
                </motion.aside>
            </div>
        </section>
    );
}

function PageSections({ sections }: { sections: CmsPageSection[] }) {
    if (sections.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {sections.map((section) => (
                <section key={section.slug} id={section.slug} className="cyber-grid scroll-mt-28 rounded-3xl border border-white/5 bg-surface p-8">
                    <div className="mb-6 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_#ccff00]" />
                        {section.sectionLabel}
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white uppercase">
                        {section.title} {section.titleAccent && <span className="glow-text text-primary">{section.titleAccent}</span>}
                    </h2>
                    {section.body && <p className="mt-4 text-sm leading-7 text-on-surface-variant">{section.body}</p>}
                </section>
            ))}
        </div>
    );
}

function SkillItem({ label, progress }: { label: string; progress: number }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="flex items-center gap-2">
                    <Database size={12} /> {label}
                </span>
                <span className="text-primary">{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full bg-primary shadow-[0_0_8px_#ccff00]" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

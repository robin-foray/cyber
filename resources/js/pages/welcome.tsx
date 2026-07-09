import CyberShell from '@/components/cyber-shell';
import { resolveCmsIcon } from '@/lib/cms-icons';
import { type CmsPageSection, type CmsStack, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Database, ExternalLink, Layers, Play, X } from 'lucide-react';
import { Fragment, type ReactNode, useState } from 'react';

export default function Welcome() {
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

            <CyberShell>
                <section
                    className="glow-box group relative min-h-[430px] overflow-hidden rounded-3xl border border-primary/20 bg-surface-low p-8 transition-all duration-500 md:p-12"
                    style={{
                        backgroundImage: `url('${cms.hero.backgroundImage}')`,
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
                    stacks={cms.stacks}
                    sectionTitle={stacksTitle}
                    headingPrefix={stacksHeadingPrefix}
                    headingAccent={stacksHeadingAccent}
                    panelHint={stacksPanelHint}
                />

                <PageSections sections={cms.pageSections} />
            </CyberShell>
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
    stacks: CmsStack[];
    sectionTitle: string;
    headingPrefix: string;
    headingAccent: string;
    panelHint: string;
}) {
    const [activeStack, setActiveStack] = useState<CmsStack | null>(null);

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
                <div className="max-w-md border-l border-primary/20 pl-4 text-[10px] leading-5 font-bold tracking-widest text-on-surface-variant uppercase">
                    {panelHint}
                </div>
            </div>

            <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
                    {stacks.map((tech, index) => {
                        const Icon = resolveCmsIcon(tech.icon);
                        const isActive = tech.name === activeStack?.name;
                        const activeIndex = activeStack ? stacks.findIndex((stack) => stack.name === activeStack.name) : -1;
                        const shouldRenderMobileDetails =
                            activeStack !== null && (index === activeIndex || index === activeIndex + 1) && (index % 2 === 1 || index === stacks.length - 1);

                        return (
                            <Fragment key={tech.name}>
                                <button
                                    type="button"
                                    onClick={() => setActiveStack(isActive ? null : tech)}
                                    className={`group relative flex aspect-square min-h-24 min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border p-3 text-center transition-all duration-300 ${
                                        isActive
                                            ? 'border-primary bg-primary text-black shadow-[0_0_24px_rgba(204,255,0,0.28)]'
                                            : 'border-primary/10 bg-black/35 text-on-surface-variant hover:-translate-y-1 hover:border-primary/45 hover:bg-primary/8 hover:text-primary hover:shadow-[0_0_18px_rgba(204,255,0,0.12)]'
                                    }`}
                                >
                                    <span className="absolute inset-x-4 top-3 h-px bg-gradient-to-r from-transparent via-current/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <span className={`mb-3 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        <Icon size={26} />
                                    </span>
                                    <span className="font-display w-full max-w-full truncate text-sm font-bold tracking-normal uppercase">{tech.name}</span>
                                    <span
                                        className={`mt-1 w-full max-w-full truncate text-[8px] font-bold tracking-[0.04em] uppercase ${
                                            isActive ? 'text-black/60' : 'text-on-surface-variant/45'
                                        }`}
                                    >
                                        {tech.signal}
                                    </span>
                                </button>

                                {activeStack && shouldRenderMobileDetails && (
                                    <StackDetails
                                        activeStack={activeStack}
                                        onClose={() => setActiveStack(null)}
                                        className="col-span-2 origin-top animate-in fade-in slide-in-from-top-2 duration-300 lg:hidden"
                                    />
                                )}
                            </Fragment>
                        );
                    })}
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

function StackDetails({ activeStack, onClose, className = '' }: { activeStack: CmsStack; onClose: () => void; className?: string }) {
    const Icon = resolveCmsIcon(activeStack.icon);

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-black/55 p-5 shadow-[inset_0_0_34px_rgba(204,255,0,0.06)] ${className}`}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-primary/10 pb-5">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_16px_rgba(204,255,0,0.14)]">
                        <Icon size={24} />
                    </div>
                    <div className="min-w-0">
                        <div className="font-display truncate text-2xl font-bold text-white uppercase">{activeStack.name}</div>
                        <div className="truncate text-[10px] font-bold tracking-widest text-primary uppercase">{activeStack.signal}</div>
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

            <a
                href={activeStack.docs}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] font-bold tracking-widest text-primary uppercase transition-all hover:bg-primary hover:text-black hover:shadow-[0_0_16px_rgba(204,255,0,0.35)]"
            >
                open_docs <ExternalLink size={12} />
            </a>
        </div>
    );
}

function PageSections({ sections }: { sections: CmsPageSection[] }) {
    if (sections.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {sections.map((section) => (
                <section
                    key={section.slug}
                    id={section.slug}
                    className="cyber-grid scroll-mt-28 rounded-3xl border border-white/5 bg-surface p-8"
                >
                    <div className="mb-6 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_#ccff00]" />
                        {section.sectionLabel}
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white uppercase">
                        {section.title}{' '}
                        {section.titleAccent && <span className="glow-text text-primary">{section.titleAccent}</span>}
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

import { analyzeCron, formatRun } from '@/lib/cron-guru';
import { Head } from '@inertiajs/react';
import { CalendarClock, CheckCircle2, Clipboard, Clock3, Eraser, Sparkles, Wand2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const presets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 30 sec', value: '*/30 * * * * *' },
    { label: 'Every 5 min', value: '*/5 * * * *' },
    { label: 'Hourly', value: '0 * * * *' },
    { label: 'Daily 09:00', value: '0 9 * * *' },
    { label: 'Work pulse', value: '*/15 9-17 * * 1-5' },
    { label: 'Monthly boot', value: '0 0 1 * *' },
];

const fieldOrder = ['second', 'minute', 'hour', 'day', 'month', 'weekday'] as const;

export default function CronGuru() {
    const [expression, setExpression] = useState('*/15 9-17 * * 1-5');
    const [copied, setCopied] = useState(false);

    const analysis = useMemo(() => analyzeCron(expression), [expression]);

    async function copyExpression() {
        await navigator.clipboard.writeText(expression);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    return (
        <>
            <Head title="Cron Guru" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                            <CalendarClock size={18} />
                            DEV_TOOL_04 // CRON_GURU
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            Cron <span className="glow-text text-primary">Guru</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button type="button" onClick={copyExpression} className="cyber-tool-button">
                            <Clipboard size={15} /> {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button type="button" onClick={() => setExpression('')} className="cyber-tool-button">
                            <Eraser size={15} /> Clear
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5">
                            <label htmlFor="cron-expression" className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
                                <Clock3 size={16} />
                                schedule_expression
                            </label>
                            <input
                                id="cron-expression"
                                value={expression}
                                onChange={(event) => setExpression(event.target.value)}
                                spellCheck={false}
                                className="w-full rounded-2xl border border-primary/15 bg-black/55 px-4 py-4 font-mono text-xl font-bold tracking-wider text-white outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary/60 focus:shadow-[0_0_20px_rgba(204,255,0,0.14)]"
                                placeholder="*/15 9-17 * * 1-5"
                            />
                            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() => setExpression(preset.value)}
                                        className="rounded-xl border border-primary/10 bg-black/35 px-3 py-3 text-left text-[10px] font-bold tracking-widest text-on-surface-variant uppercase transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                    >
                                        <span className="block text-white">{preset.label}</span>
                                        <span className="mt-1 block font-mono text-primary">{preset.value}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                            {fieldOrder.map((field) => (
                                <FieldTile key={field} field={field} parsed={analysis.parsed?.[field]} />
                            ))}
                        </div>

                        <div className="rounded-2xl border border-primary/15 bg-black/45 p-5">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                                    <Sparkles size={18} />
                                    next_runtime_stream
                                </div>
                                <div className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${analysis.error ? 'text-red-300' : 'text-primary'}`}>
                                    {analysis.error ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                    {analysis.error ? 'invalid_signal' : 'locked'}
                                </div>
                            </div>

                            {analysis.error ? (
                                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 font-mono text-sm text-red-200">{analysis.error}</div>
                            ) : (
                                <div className="grid gap-2 md:grid-cols-2">
                                    {analysis.nextRuns.map((run, index) => (
                                        <div key={run.toISOString()} className="rounded-xl border border-primary/10 bg-black/45 p-4">
                                            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/60 uppercase">run_{String(index + 1).padStart(2, '0')}</div>
                                            <div className="mt-2 font-mono text-sm font-bold text-white">{formatRun(run)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-primary/20 bg-black/60 p-5">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                                <Wand2 size={21} />
                            </div>
                            <div>
                                <h2 className="font-display text-xl font-bold text-white uppercase">Guru_Readout</h2>
                                <p className="text-[10px] font-bold tracking-widest text-primary uppercase">human schedule trace</p>
                            </div>
                        </div>

                        <div className="space-y-3 font-mono text-sm text-on-surface-variant">
                            {analysis.error ? (
                                <p>
                                    Paste a 5 or 6-field cron expression. Example: <span className="text-primary">*/15 9-17 * * 1-5</span>
                                </p>
                            ) : (
                                analysis.summary.map((line) => (
                                    <div key={line} className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                                        {line}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-[10px] font-bold leading-5 tracking-widest text-on-surface-variant uppercase">
                            Supports 6-field cron with seconds, 5-field classic cron and 4-field shorthand. Missing seconds and minutes default to 0.
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}

function FieldTile({
    field,
    parsed,
}: {
    field: (typeof fieldOrder)[number];
    parsed?: { text: string };
}) {
    const labels: Record<(typeof fieldOrder)[number], string> = {
        second: 'Second',
        minute: 'Minute',
        hour: 'Hour',
        day: 'Day',
        month: 'Month',
        weekday: 'Weekday',
    };

    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/55 uppercase">{labels[field]}</div>
            <div className="mt-2 min-h-10 font-mono text-xs font-bold leading-5 text-primary">{parsed?.text ?? 'waiting'}</div>
        </div>
    );
}

import { cyberLayout } from '@/layouts/cyber-layout';
import { Head } from '@inertiajs/react';
import { CalendarClock, CheckCircle2, Clipboard, Clock3, Eraser, Sparkles, Wand2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

type CronFieldKey = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'weekday';

type ParsedField = {
    values: number[];
    text: string;
    restricted: boolean;
};

type ParsedCron = Record<CronFieldKey, ParsedField>;

const fieldRules: Record<CronFieldKey, { label: string; min: number; max: number; aliases?: Record<string, number> }> = {
    second: { label: 'Second', min: 0, max: 59 },
    minute: { label: 'Minute', min: 0, max: 59 },
    hour: { label: 'Hour', min: 0, max: 23 },
    day: { label: 'Day', min: 1, max: 31 },
    month: {
        label: 'Month',
        min: 1,
        max: 12,
        aliases: { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 },
    },
    weekday: {
        label: 'Weekday',
        min: 0,
        max: 7,
        aliases: { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 },
    },
};

const presets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 30 sec', value: '*/30 * * * * *' },
    { label: 'Every 5 min', value: '*/5 * * * *' },
    { label: 'Hourly', value: '0 * * * *' },
    { label: 'Daily 09:00', value: '0 9 * * *' },
    { label: 'Work pulse', value: '*/15 9-17 * * 1-5' },
    { label: 'Monthly boot', value: '0 0 1 * *' },
];

const fieldOrder: CronFieldKey[] = ['second', 'minute', 'hour', 'day', 'month', 'weekday'];

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
                                <p>Paste a 5 or 6-field cron expression. Example: <span className="text-primary">*/15 9-17 * * 1-5</span></p>
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

function FieldTile({ field, parsed }: { field: CronFieldKey; parsed?: ParsedField }) {
    const rule = fieldRules[field];

    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/55 uppercase">{rule.label}</div>
            <div className="mt-2 min-h-10 font-mono text-xs font-bold leading-5 text-primary">{parsed?.text ?? 'waiting'}</div>
        </div>
    );
}

function analyzeCron(expression: string) {
    try {
        const parsed = parseCron(expression);
        const nextRuns = collectNextRuns(parsed);

        if (!nextRuns.length) {
            throw new Error('No runtime found in the next year. Try a less restrictive expression.');
        }

        return {
            parsed,
            nextRuns,
            summary: fieldOrder.map((field) => `${fieldRules[field].label}: ${parsed[field].text}`),
            error: '',
        };
    } catch (exception) {
        return {
            parsed: undefined,
            nextRuns: [],
            summary: [],
            error: exception instanceof Error ? exception.message : 'Cron parse failed.',
        };
    }
}

function parseCron(expression: string): ParsedCron {
    const rawParts = expression.trim().split(/\s+/).filter(Boolean);
    const parts = normalizeCronParts(rawParts);

    if (parts.length !== 6) {
        throw new Error('Cron expression must contain 6 fields with seconds, 5 classic fields, or 4 fields when the minute is omitted.');
    }

    return {
        second: parseField(parts[0], 'second'),
        minute: parseField(parts[1], 'minute'),
        hour: parseField(parts[2], 'hour'),
        day: parseField(parts[3], 'day'),
        month: parseField(parts[4], 'month'),
        weekday: parseField(parts[5], 'weekday'),
    };
}

function normalizeCronParts(rawParts: string[]) {
    if (rawParts.length === 4) {
        return ['0', '0', ...rawParts];
    }

    if (rawParts.length === 5) {
        return ['0', ...rawParts];
    }

    return rawParts;
}

function parseField(rawValue: string, field: CronFieldKey): ParsedField {
    const rule = fieldRules[field];
    const normalized = rawValue.toLowerCase();
    const values = new Set<number>();

    for (const segment of normalized.split(',')) {
        const [rangePart, stepPart] = segment.split('/');
        const step = stepPart ? Number(stepPart) : 1;

        if (!Number.isInteger(step) || step <= 0) {
            throw new Error(`${rule.label} step must be a positive number.`);
        }

        const [start, end] = resolveRange(rangePart, field);

        for (let value = start; value <= end; value += step) {
            const cronValue = field === 'weekday' && value === 7 ? 0 : value;
            if (cronValue < rule.min || cronValue > (field === 'weekday' ? 6 : rule.max)) {
                throw new Error(`${rule.label} value ${value} is outside allowed range.`);
            }
            values.add(cronValue);
        }
    }

    if (!values.size) {
        throw new Error(`${rule.label} field has no valid values.`);
    }

    const orderedValues = [...values].sort((a, b) => a - b);

    return {
        values: orderedValues,
        text: describeField(rawValue, orderedValues, field),
        restricted: normalized !== '*',
    };
}

function resolveRange(rangePart: string, field: CronFieldKey): [number, number] {
    const rule = fieldRules[field];

    if (rangePart === '*') {
        return [rule.min, rule.max];
    }

    if (rangePart.includes('-')) {
        const [startRaw, endRaw] = rangePart.split('-');
        const start = resolveToken(startRaw, field);
        const end = resolveToken(endRaw, field);

        if (start > end) {
            throw new Error(`${rule.label} range start cannot be greater than range end.`);
        }

        return [start, end];
    }

    const value = resolveToken(rangePart, field);
    return [value, value];
}

function resolveToken(token: string, field: CronFieldKey) {
    const rule = fieldRules[field];
    const aliasValue = rule.aliases?.[token];
    const value = aliasValue ?? Number(token);

    if (!Number.isInteger(value)) {
        throw new Error(`${rule.label} contains unknown token: ${token}`);
    }

    if (value < rule.min || value > rule.max) {
        throw new Error(`${rule.label} value ${value} is outside ${rule.min}-${rule.max}.`);
    }

    return value;
}

function describeField(rawValue: string, values: number[], field: CronFieldKey) {
    const rule = fieldRules[field];

    if (rawValue === '*') {
        return `every ${rule.label.toLowerCase()}`;
    }

    if (rawValue.includes('/')) {
        return `${rawValue} pulse`;
    }

    if (values.length <= 6) {
        return values.map((value) => labelValue(value, field)).join(', ');
    }

    return `${values.length} selected`;
}

function labelValue(value: number, field: CronFieldKey) {
    if (field === 'weekday') {
        return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][value] ?? String(value);
    }

    if (field === 'month') {
        return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][value - 1] ?? String(value);
    }

    return String(value).padStart(2, '0');
}

function collectNextRuns(parsed: ParsedCron) {
    const runs: Date[] = [];
    const start = new Date();
    start.setMilliseconds(0);
    start.setSeconds(start.getSeconds() + 1);

    const candidate = new Date(start);
    candidate.setSeconds(0, 0);

    for (let index = 0; index < 525600 && runs.length < 8; index += 1) {
        if (matchesMinuteCron(candidate, parsed)) {
            for (const second of parsed.second.values) {
                const run = new Date(candidate);
                run.setSeconds(second, 0);

                if (run >= start) {
                    runs.push(run);
                }

                if (runs.length >= 8) {
                    break;
                }
            }
        }

        candidate.setMinutes(candidate.getMinutes() + 1);
    }

    return runs;
}

function matchesMinuteCron(date: Date, parsed: ParsedCron) {
    return (
        parsed.minute.values.includes(date.getMinutes()) &&
        parsed.hour.values.includes(date.getHours()) &&
        parsed.day.values.includes(date.getDate()) &&
        parsed.month.values.includes(date.getMonth() + 1) &&
        parsed.weekday.values.includes(date.getDay())
    );
}

function formatRun(date: Date) {
    return new Intl.DateTimeFormat('hu-HU', {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
}

CronGuru.layout = cyberLayout;

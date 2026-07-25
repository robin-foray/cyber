import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import {
    buildSelectQuery,
    createEmptyWhereClause,
    sqlBuilderPresets,
    sqlWhereOperators,
    type SqlWhereClause,
    type SqlWhereLogic,
    type SqlWhereOperator,
} from '@/lib/sql-builder';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Database, Eraser, Plus, Trash2, Wand2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const defaultSelect = 'id, name, email';
const defaultFrom = 'users';
const defaultWhere: SqlWhereClause[] = [
    { column: 'is_active', operator: '=', value: '1', logic: 'AND' },
    { column: 'role', operator: '=', value: 'member', logic: 'AND' },
];

export default function SqlBuilder() {
    const page = useDevToolPage('sql-builder');
    const [select, setSelect] = useState(page.sampleInput ?? defaultSelect);
    const [from, setFrom] = useState(defaultFrom);
    const [where, setWhere] = useState<SqlWhereClause[]>(defaultWhere);
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => buildSelectQuery({ select, from, where }), [from, select, where]);
    const isValid = result.error === '';

    async function copyOutput() {
        if (!result.output) {
            return;
        }

        await navigator.clipboard.writeText(result.output);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    function clearAll() {
        setSelect('');
        setFrom('');
        setWhere([createEmptyWhereClause()]);
        setCopied(false);
    }

    function applyPreset(preset: (typeof sqlBuilderPresets)[number]) {
        setSelect(preset.select);
        setFrom(preset.from);
        setWhere(preset.where.map((clause) => ({ ...clause })));
    }

    function updateWhere(index: number, patch: Partial<SqlWhereClause>) {
        setWhere((current) => current.map((clause, clauseIndex) => (clauseIndex === index ? { ...clause, ...patch } : clause)));
    }

    function addWhere() {
        setWhere((current) => [...current, createEmptyWhereClause(current.length ? 'AND' : 'AND')]);
    }

    function removeWhere(index: number) {
        setWhere((current) => {
            const next = current.filter((_, clauseIndex) => clauseIndex !== index);

            return next.length ? next : [createEmptyWhereClause()];
        });
    }

    return (
        <>
            <Head title={page.pageTitle} />
            <section className="cyber-grid border-primary/15 bg-surface rounded-3xl border p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <DevToolPageHeader
                    slug="sql-builder"
                    actions={
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                            <button type="button" onClick={copyOutput} className="cyber-tool-button">
                                <Clipboard size={15} /> {copied ? 'Copied' : 'Copy SQL'}
                            </button>
                            <button type="button" onClick={clearAll} className="cyber-tool-button">
                                <Eraser size={15} /> Clear
                            </button>
                        </div>
                    }
                />

                <div className="mb-6 grid gap-3 md:grid-cols-4">
                    <StatusTile label="Parse_State" value={isValid ? 'VALID' : 'INVALID'} tone={isValid ? 'good' : 'bad'} />
                    <StatusTile label="Select_Cols" value={isValid ? String(result.selectCount) : '--'} />
                    <StatusTile label="Where_Pairs" value={isValid ? String(result.whereCount) : '--'} />
                    <StatusTile label="Statement" value="SELECT" />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5">
                            <label
                                htmlFor="sql-select"
                                className="text-primary mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                            >
                                <Database size={16} />
                                select_columns
                            </label>
                            <input
                                id="sql-select"
                                value={select}
                                onChange={(event) => setSelect(event.target.value)}
                                spellCheck={false}
                                className="border-primary/15 placeholder:text-on-surface-variant/40 focus:border-primary/60 w-full rounded-2xl border bg-black/55 px-4 py-4 font-mono text-sm font-bold tracking-wide text-white transition-all outline-none focus:shadow-[0_0_20px_rgba(204,255,0,0.14)]"
                                placeholder="id, name, email"
                            />
                            <p className="text-on-surface-variant/60 mt-3 text-[10px] font-bold tracking-widest uppercase">
                                Comma-separated columns or *
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5">
                            <label
                                htmlFor="sql-from"
                                className="text-primary mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                            >
                                from_table
                            </label>
                            <input
                                id="sql-from"
                                value={from}
                                onChange={(event) => setFrom(event.target.value)}
                                spellCheck={false}
                                className="border-primary/15 placeholder:text-on-surface-variant/40 focus:border-primary/60 w-full rounded-2xl border bg-black/55 px-4 py-4 font-mono text-sm font-bold tracking-wide text-white transition-all outline-none focus:shadow-[0_0_20px_rgba(204,255,0,0.14)]"
                                placeholder="users"
                            />
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="text-primary text-xs font-bold tracking-widest uppercase">where_pairs</div>
                                <button type="button" onClick={addWhere} className="cyber-tool-button !min-h-9 !px-3 !py-2 text-[10px]">
                                    <Plus size={13} /> Add Pair
                                </button>
                            </div>

                            <div className="space-y-3">
                                {where.map((clause, index) => (
                                    <div key={`where-${index}`} className="border-primary/10 rounded-2xl border bg-black/40 p-3">
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            {index === 0 ? (
                                                <span className="text-on-surface-variant/55 text-[10px] font-bold tracking-widest uppercase">
                                                    first_condition
                                                </span>
                                            ) : (
                                                <select
                                                    value={clause.logic}
                                                    onChange={(event) => updateWhere(index, { logic: event.target.value as SqlWhereLogic })}
                                                    className="border-primary/15 text-primary rounded-xl border bg-black/55 px-3 py-2 font-mono text-[10px] font-bold tracking-widest uppercase outline-none"
                                                >
                                                    <option value="AND">AND</option>
                                                    <option value="OR">OR</option>
                                                </select>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeWhere(index)}
                                                className="cyber-tool-button !min-h-9 !px-3 !py-2 text-[10px]"
                                                aria-label={`Remove where pair ${index + 1}`}
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                        <div className="grid gap-2 md:grid-cols-[1fr_120px_1fr]">
                                            <input
                                                value={clause.column}
                                                onChange={(event) => updateWhere(index, { column: event.target.value })}
                                                spellCheck={false}
                                                className="border-primary/15 focus:border-primary/60 rounded-xl border bg-black/55 px-3 py-3 font-mono text-xs font-bold text-white outline-none"
                                                placeholder="column"
                                            />
                                            <select
                                                value={clause.operator}
                                                onChange={(event) => updateWhere(index, { operator: event.target.value as SqlWhereOperator })}
                                                className="border-primary/15 text-primary rounded-xl border bg-black/55 px-3 py-3 font-mono text-[10px] font-bold tracking-widest uppercase outline-none"
                                            >
                                                {sqlWhereOperators.map((operator) => (
                                                    <option key={operator} value={operator}>
                                                        {operator}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                value={clause.value}
                                                onChange={(event) => updateWhere(index, { value: event.target.value })}
                                                spellCheck={false}
                                                disabled={clause.operator === 'IS NULL' || clause.operator === 'IS NOT NULL'}
                                                className="border-primary/15 focus:border-primary/60 rounded-xl border bg-black/55 px-3 py-3 font-mono text-xs font-bold text-white outline-none disabled:opacity-40"
                                                placeholder={clause.operator.includes('IN') ? '1, 2, 3' : 'value'}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                            {sqlBuilderPresets.map((preset) => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => applyPreset(preset)}
                                    className="border-primary/10 text-on-surface-variant hover:border-primary/50 hover:bg-primary/10 hover:text-primary rounded-xl border bg-black/35 px-3 py-3 text-left text-[10px] font-bold tracking-widest uppercase transition-all"
                                >
                                    <span className="block text-white">{preset.label}</span>
                                    <span className="text-primary mt-1 block font-mono normal-case">
                                        {preset.from} / {preset.where.length} where
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <aside className="border-primary/20 rounded-2xl border bg-black/60 p-5">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="border-primary/25 bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl border">
                                    <Wand2 size={21} />
                                </div>
                                <div>
                                    <h2 className="font-display text-xl font-bold text-white uppercase">Sql_Output</h2>
                                    <p className="text-primary text-[10px] font-bold tracking-widest uppercase">syntax-clean command</p>
                                </div>
                            </div>
                            <div
                                className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${isValid ? 'text-primary' : 'text-red-300'}`}
                            >
                                {isValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                {isValid ? 'ready' : 'blocked'}
                            </div>
                        </div>

                        {result.error ? (
                            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 font-mono text-sm text-red-200">{result.error}</div>
                        ) : (
                            <pre className="border-primary/10 min-h-[280px] overflow-x-auto rounded-2xl border bg-black/50 p-4 font-mono text-sm leading-7 whitespace-pre-wrap text-white">
                                {result.output || '// waiting for select + from'}
                            </pre>
                        )}

                        <div className="border-primary/10 bg-primary/5 text-on-surface-variant mt-5 rounded-2xl border p-4 text-[10px] leading-5 font-bold tracking-widest uppercase">
                            Builds SELECT / FROM / WHERE only. Strings are escaped, numbers stay bare, blank WHERE rows are skipped.
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}

function StatusTile({ label, value, tone = 'idle' }: { label: string; value: string; tone?: 'idle' | 'good' | 'bad' }) {
    const toneClass = tone === 'good' ? 'text-primary' : tone === 'bad' ? 'text-red-300' : 'text-primary';

    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-on-surface-variant/55 text-[9px] font-bold tracking-widest uppercase">{label}</div>
            <div className={`font-display mt-2 text-lg font-bold uppercase ${toneClass}`}>{value}</div>
        </div>
    );
}

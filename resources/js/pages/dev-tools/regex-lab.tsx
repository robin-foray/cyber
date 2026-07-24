import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import {
    appendRegexToken,
    defaultRegexFlags,
    escapeRegexLiteral,
    formatRegexMatches,
    regexBuilderTokens,
    regexFlagOptions,
    regexPresets,
    testRegex,
    type RegexFlags,
} from '@/lib/regex-lab';
import { Head } from '@inertiajs/react';
import { Braces, CheckCircle2, Clipboard, Eraser, ScanSearch, Wand2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const samplePattern = String.raw`\bforay-[a-z]+\b`;
const sampleHaystack = 'modules: foray-core foray-dev foray_node invalid';

export default function RegexLab() {
    const page = useDevToolPage('regex-lab');
    const [pattern, setPattern] = useState(samplePattern);
    const [haystack, setHaystack] = useState(sampleHaystack);
    const [replacement, setReplacement] = useState('FORAY-$1');
    const [flags, setFlags] = useState<RegexFlags>(defaultRegexFlags);
    const [literal, setLiteral] = useState('');
    const [copiedKey, setCopiedKey] = useState('');

    const result = useMemo(() => testRegex(pattern, flags, haystack, replacement), [flags, haystack, pattern, replacement]);
    const isValid = result.error === '';

    async function copyValue(key: string, value: string) {
        if (!value) {
            return;
        }

        await navigator.clipboard.writeText(value);
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey(''), 1400);
    }

    function applyPreset(preset: (typeof regexPresets)[number]) {
        setPattern(preset.pattern);
        setHaystack(preset.sample);
        setFlags({ ...defaultRegexFlags, ...preset.flags });
    }

    function appendToken(token: string) {
        setPattern((current) => appendRegexToken(current, token));
    }

    function appendLiteral() {
        if (!literal.trim()) {
            return;
        }

        setPattern((current) => appendRegexToken(current, escapeRegexLiteral(literal)));
        setLiteral('');
    }

    function clearBuffers() {
        setPattern('');
        setHaystack('');
        setReplacement('');
        setLiteral('');
        setCopiedKey('');
    }

    return (
        <>
            <Head title={page.pageTitle} />
            <section className="cyber-grid border-primary/15 bg-surface min-w-0 overflow-hidden rounded-3xl border p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                <DevToolPageHeader
                    slug="regex-lab"
                    actions={
                        <>
                            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
                                <button type="button" onClick={() => copyValue('pattern', pattern)} className="cyber-tool-button">
                                    <Clipboard size={15} /> {copiedKey === 'pattern' ? 'Copied' : 'Copy Pattern'}
                                </button>
                                <button type="button" onClick={clearBuffers} className="cyber-tool-button">
                                    <Eraser size={15} /> Clear
                                </button>
                            </div>
                        </>
                    }
                />

                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatusTile label="Pattern_State" value={isValid ? 'VALID' : 'INVALID'} tone={isValid ? 'good' : 'bad'} />
                    <StatusTile label="Matches" value={isValid ? String(result.matches.length) : '--'} />
                    <StatusTile label="Flags" value={result.flags || 'none'} />
                    <StatusTile label="Groups" value={isValid ? String(result.matches[0]?.groups.length ?? 0) : '--'} />
                </div>

                <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                    <div className="min-w-0 space-y-6">
                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5">
                            <label
                                htmlFor="regex-pattern"
                                className="text-primary mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                            >
                                <Braces size={16} />
                                pattern_buffer
                            </label>
                            <input
                                id="regex-pattern"
                                value={pattern}
                                onChange={(event) => setPattern(event.target.value)}
                                spellCheck={false}
                                className="border-primary/15 placeholder:text-on-surface-variant/40 focus:border-primary/60 w-full min-w-0 rounded-2xl border bg-black/55 px-4 py-4 font-mono text-base font-bold tracking-wide text-white transition-all outline-none focus:shadow-[0_0_20px_rgba(204,255,0,0.14)]"
                                placeholder="\\bforay-[a-z]+\\b"
                            />

                            <div className="mt-4 flex flex-wrap gap-2">
                                {regexFlagOptions.map((option) => (
                                    <label
                                        key={option.key}
                                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                            flags[option.key]
                                                ? 'border-primary bg-primary text-black'
                                                : 'border-primary/15 text-on-surface-variant hover:border-primary/45 hover:text-primary bg-black/35'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={flags[option.key]}
                                            onChange={(event) => setFlags((current) => ({ ...current, [option.key]: event.target.checked }))}
                                            className="sr-only"
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                            <label
                                htmlFor="regex-haystack"
                                className="text-primary mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                            >
                                <ScanSearch size={16} />
                                test_haystack
                            </label>
                            <textarea
                                id="regex-haystack"
                                value={haystack}
                                onChange={(event) => setHaystack(event.target.value)}
                                spellCheck={false}
                                className="border-primary/10 text-on-surface-variant focus:border-primary/50 min-h-[160px] w-full min-w-0 resize-y rounded-2xl border bg-black/50 p-4 text-base leading-6 transition-all outline-none focus:shadow-[0_0_18px_rgba(204,255,0,0.12)] sm:min-h-[180px] sm:text-xs"
                                placeholder="paste sample text to test against"
                            />

                            <label
                                htmlFor="regex-replacement"
                                className="text-primary mt-4 mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                            >
                                <Wand2 size={16} />
                                replace_preview
                            </label>
                            <input
                                id="regex-replacement"
                                value={replacement}
                                onChange={(event) => setReplacement(event.target.value)}
                                spellCheck={false}
                                className="border-primary/10 text-on-surface-variant focus:border-primary/50 w-full min-w-0 rounded-2xl border bg-black/50 px-4 py-3 text-base transition-all outline-none sm:text-xs"
                                placeholder="$1-uppercase or FORAY"
                            />
                        </div>

                        <div className="min-w-0 rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono">
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                    <ScanSearch size={18} />
                                    match_stream
                                </div>
                                <div
                                    className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${isValid ? 'text-primary' : 'text-red-300'}`}
                                >
                                    {isValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                    {isValid ? 'locked' : 'syntax_error'}
                                </div>
                            </div>

                            {result.error ? (
                                <div className="min-h-[180px] rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-6 text-red-200">
                                    {result.error}
                                </div>
                            ) : (
                                <>
                                    <div className="border-primary/10 text-on-surface-variant min-h-[120px] rounded-2xl border bg-black/50 p-4 text-xs leading-7">
                                        {result.segments.map((segment, index) => (
                                            <span
                                                key={`${segment.text}-${index}`}
                                                className={
                                                    segment.matched
                                                        ? 'bg-primary/20 text-primary rounded px-1 shadow-[0_0_10px_rgba(204,255,0,0.2)]'
                                                        : undefined
                                                }
                                            >
                                                {segment.text}
                                            </span>
                                        ))}
                                    </div>
                                    <pre className="border-primary/10 text-primary mt-4 min-h-[120px] overflow-auto rounded-2xl border bg-black/50 p-4 text-xs leading-6">
                                        {formatRegexMatches(result.matches)}
                                    </pre>
                                    {result.replacementPreview && (
                                        <pre className="border-primary/10 text-on-surface-variant mt-4 overflow-auto rounded-2xl border bg-black/50 p-4 text-xs leading-6">
                                            {result.replacementPreview}
                                        </pre>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0 space-y-6">
                        <div className="border-primary/15 rounded-2xl border bg-black/45 p-5">
                            <div className="text-primary mb-4 text-xs font-bold tracking-widest uppercase">pattern_builder</div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {regexBuilderTokens.map((token) => (
                                    <button
                                        key={token.label}
                                        type="button"
                                        title={token.description}
                                        onClick={() => appendToken(token.token)}
                                        className="border-primary/10 text-on-surface-variant hover:border-primary/50 hover:bg-primary/10 hover:text-primary rounded-xl border bg-black/35 px-3 py-3 text-left text-[10px] font-bold tracking-widest uppercase transition-all"
                                    >
                                        <span className="block text-white">{token.label}</span>
                                        <span className="text-primary mt-1 block font-mono">{token.token}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <input
                                    value={literal}
                                    onChange={(event) => setLiteral(event.target.value)}
                                    spellCheck={false}
                                    placeholder="literal text"
                                    className="border-primary/10 focus:border-primary/50 min-w-0 flex-1 rounded-xl border bg-black/50 px-3 py-2 font-mono text-base text-white outline-none sm:text-xs"
                                />
                                <button type="button" onClick={appendLiteral} className="cyber-tool-button !min-h-10">
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="border-primary/15 rounded-2xl border bg-black/45 p-5">
                            <div className="text-primary mb-4 text-xs font-bold tracking-widest uppercase">signal_presets</div>
                            <div className="space-y-2">
                                {regexPresets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => applyPreset(preset)}
                                        className="border-primary/10 text-on-surface-variant hover:border-primary/50 hover:bg-primary/10 hover:text-primary w-full rounded-xl border bg-black/35 px-3 py-3 text-left text-[10px] font-bold tracking-widest uppercase transition-all"
                                    >
                                        <span className="block text-white">{preset.label}</span>
                                        <span className="text-primary mt-1 block font-mono">{preset.pattern}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function StatusTile({ label, value, tone = 'idle' }: { label: string; value: string; tone?: 'idle' | 'good' | 'bad' }) {
    const toneClass = tone === 'good' ? 'text-primary' : tone === 'bad' ? 'text-red-300' : 'text-primary';

    return (
        <div className="min-w-0 rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-on-surface-variant/55 text-[9px] font-bold tracking-widest uppercase">{label}</div>
            <div className={`font-display mt-2 text-base font-bold break-words uppercase sm:text-lg ${toneClass}`}>{value}</div>
        </div>
    );
}

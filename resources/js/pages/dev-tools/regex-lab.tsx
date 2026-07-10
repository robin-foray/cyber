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
import { Braces, CheckCircle2, Clipboard, Eraser, Regex, ScanSearch, Wand2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const samplePattern = String.raw`\bforay-[a-z]+\b`;
const sampleHaystack = 'modules: foray-core foray-dev foray_node invalid';

export default function RegexLab() {
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
            <Head title="Regex Lab" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                            <Regex size={18} />
                            DEV_TOOL_11 // REGEX_LAB
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            Regex <span className="glow-text text-primary">Lab</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button type="button" onClick={() => copyValue('pattern', pattern)} className="cyber-tool-button">
                            <Clipboard size={15} /> {copiedKey === 'pattern' ? 'Copied' : 'Copy Pattern'}
                        </button>
                        <button type="button" onClick={clearBuffers} className="cyber-tool-button">
                            <Eraser size={15} /> Clear
                        </button>
                    </div>
                </div>

                <div className="mb-6 grid gap-3 md:grid-cols-4">
                    <StatusTile label="Pattern_State" value={isValid ? 'VALID' : 'INVALID'} tone={isValid ? 'good' : 'bad'} />
                    <StatusTile label="Matches" value={isValid ? String(result.matches.length) : '--'} />
                    <StatusTile label="Flags" value={result.flags || 'none'} />
                    <StatusTile label="Groups" value={isValid ? String(result.matches[0]?.groups.length ?? 0) : '--'} />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5">
                            <label htmlFor="regex-pattern" className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
                                <Braces size={16} />
                                pattern_buffer
                            </label>
                            <input
                                id="regex-pattern"
                                value={pattern}
                                onChange={(event) => setPattern(event.target.value)}
                                spellCheck={false}
                                className="w-full rounded-2xl border border-primary/15 bg-black/55 px-4 py-4 font-mono text-lg font-bold tracking-wide text-white outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary/60 focus:shadow-[0_0_20px_rgba(204,255,0,0.14)]"
                                placeholder="\\bforay-[a-z]+\\b"
                            />

                            <div className="mt-4 flex flex-wrap gap-2">
                                {regexFlagOptions.map((option) => (
                                    <label
                                        key={option.key}
                                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                            flags[option.key]
                                                ? 'border-primary bg-primary text-black'
                                                : 'border-primary/15 bg-black/35 text-on-surface-variant hover:border-primary/45 hover:text-primary'
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
                            <label htmlFor="regex-haystack" className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
                                <ScanSearch size={16} />
                                test_haystack
                            </label>
                            <textarea
                                id="regex-haystack"
                                value={haystack}
                                onChange={(event) => setHaystack(event.target.value)}
                                spellCheck={false}
                                className="min-h-[180px] w-full resize-y rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-on-surface-variant outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_18px_rgba(204,255,0,0.12)]"
                                placeholder="paste sample text to test against"
                            />

                            <label htmlFor="regex-replacement" className="mb-3 mt-4 flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
                                <Wand2 size={16} />
                                replace_preview
                            </label>
                            <input
                                id="regex-replacement"
                                value={replacement}
                                onChange={(event) => setReplacement(event.target.value)}
                                spellCheck={false}
                                className="w-full rounded-2xl border border-primary/10 bg-black/50 px-4 py-3 text-xs text-on-surface-variant outline-none transition-all focus:border-primary/50"
                                placeholder="$1-uppercase or FORAY"
                            />
                        </div>

                        <div className="rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                                    <ScanSearch size={18} />
                                    match_stream
                                </div>
                                <div className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${isValid ? 'text-primary' : 'text-red-300'}`}>
                                    {isValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                    {isValid ? 'locked' : 'syntax_error'}
                                </div>
                            </div>

                            {result.error ? (
                                <div className="min-h-[180px] rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-6 text-red-200">{result.error}</div>
                            ) : (
                                <>
                                    <div className="min-h-[120px] rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-7 text-on-surface-variant">
                                        {result.segments.map((segment, index) => (
                                            <span
                                                key={`${segment.text}-${index}`}
                                                className={segment.matched ? 'rounded bg-primary/20 px-1 text-primary shadow-[0_0_10px_rgba(204,255,0,0.2)]' : undefined}
                                            >
                                                {segment.text}
                                            </span>
                                        ))}
                                    </div>
                                    <pre className="mt-4 min-h-[120px] overflow-auto rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-primary">
                                        {formatRegexMatches(result.matches)}
                                    </pre>
                                    {result.replacementPreview && (
                                        <pre className="mt-4 overflow-auto rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-on-surface-variant">
                                            {result.replacementPreview}
                                        </pre>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-primary/15 bg-black/45 p-5">
                            <div className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">pattern_builder</div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {regexBuilderTokens.map((token) => (
                                    <button
                                        key={token.label}
                                        type="button"
                                        title={token.description}
                                        onClick={() => appendToken(token.token)}
                                        className="rounded-xl border border-primary/10 bg-black/35 px-3 py-3 text-left text-[10px] font-bold tracking-widest text-on-surface-variant uppercase transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                    >
                                        <span className="block text-white">{token.label}</span>
                                        <span className="mt-1 block font-mono text-primary">{token.token}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <input
                                    value={literal}
                                    onChange={(event) => setLiteral(event.target.value)}
                                    spellCheck={false}
                                    placeholder="literal text"
                                    className="min-w-0 flex-1 rounded-xl border border-primary/10 bg-black/50 px-3 py-2 font-mono text-xs text-white outline-none focus:border-primary/50"
                                />
                                <button type="button" onClick={appendLiteral} className="cyber-tool-button !min-h-10">
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-primary/15 bg-black/45 p-5">
                            <div className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">signal_presets</div>
                            <div className="space-y-2">
                                {regexPresets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => applyPreset(preset)}
                                        className="w-full rounded-xl border border-primary/10 bg-black/35 px-3 py-3 text-left text-[10px] font-bold tracking-widest text-on-surface-variant uppercase transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                    >
                                        <span className="block text-white">{preset.label}</span>
                                        <span className="mt-1 block font-mono text-primary">{preset.pattern}</span>
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
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/55 uppercase">{label}</div>
            <div className={`mt-2 font-display text-lg font-bold uppercase ${toneClass}`}>{value}</div>
        </div>
    );
}

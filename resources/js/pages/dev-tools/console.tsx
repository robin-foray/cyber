import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { formatJson, inspectJson, type FormatMode } from '@/lib/json-formatter';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Database, Eraser, Minimize2, Terminal, Wand2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Console() {
    const page = useDevToolPage('console');
    const [input, setInput] = useState(page.sampleInput ?? '');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState<FormatMode>('pretty');
    const [indent, setIndent] = useState(2);
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => inspectJson(output || input), [input, output]);
    const isValid = output !== '' && error === '';

    function formatJsonBuffer(nextMode = mode) {
        const result = formatJson(input, nextMode, indent);
        setOutput(result.output);
        setError(result.error);
        setMode(nextMode);
        setCopied(false);
    }

    async function copyOutput() {
        const payload = output || input;

        if (!payload) {
            return;
        }

        await navigator.clipboard.writeText(payload);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    function clearBuffers() {
        setInput('');
        setOutput('');
        setError('');
        setCopied(false);
    }

    return (
        <>
            <Head title={page.pageTitle} />
            <section className="cyber-grid border-primary/15 bg-surface rounded-3xl border p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <DevToolPageHeader
                    slug="console"
                    actions={
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                            <button type="button" onClick={() => formatJsonBuffer('pretty')} className="cyber-tool-button">
                                <Wand2 size={15} /> Pretty
                            </button>
                            <button type="button" onClick={() => formatJsonBuffer('minify')} className="cyber-tool-button">
                                <Minimize2 size={15} /> Minify
                            </button>
                            <button type="button" onClick={copyOutput} className="cyber-tool-button">
                                <Clipboard size={15} /> {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button type="button" onClick={clearBuffers} className="cyber-tool-button">
                                <Eraser size={15} /> Clear
                            </button>
                        </div>
                    }
                />

                <div className="mb-6 grid gap-3 lg:grid-cols-4">
                    <StatusTile
                        label="Parse_State"
                        value={error ? 'INVALID' : isValid ? 'VALID' : 'IDLE'}
                        tone={error ? 'bad' : isValid ? 'good' : 'idle'}
                    />
                    <StatusTile label="Mode" value={mode} />
                    <StatusTile label="Keys" value={String(stats.keys)} />
                    <StatusTile label="Nodes" value={String(stats.nodes)} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                <Terminal size={18} />
                                input_buffer
                            </div>
                            <label className="text-on-surface-variant flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                                indent
                                <select
                                    value={indent}
                                    onChange={(event) => setIndent(Number(event.target.value))}
                                    className="border-primary/15 text-primary rounded-lg border bg-black px-2 py-1 outline-none"
                                >
                                    <option value={2}>2</option>
                                    <option value={4}>4</option>
                                </select>
                            </label>
                        </div>
                        <textarea
                            value={input}
                            onChange={(event) => {
                                setInput(event.target.value);
                                setError('');
                                setOutput('');
                            }}
                            spellCheck={false}
                            className="border-primary/10 text-on-surface-variant focus:border-primary/50 min-h-[430px] w-full resize-y rounded-2xl border bg-black/50 p-4 text-xs leading-6 transition-all outline-none focus:shadow-[0_0_18px_rgba(204,255,0,0.12)]"
                            placeholder='{"status":"paste_json_here"}'
                        />
                    </div>

                    <div className="border-primary/20 rounded-2xl border bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                <Database size={18} />
                                output_stream
                            </div>
                            <div
                                className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${error ? 'text-red-300' : 'text-primary'}`}
                            >
                                {error ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                {error ? 'parse_error' : 'ready'}
                            </div>
                        </div>

                        {error ? (
                            <div className="min-h-[430px] rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-6 text-red-200">
                                <div className="mb-3 font-bold tracking-widest uppercase">formatter rejected payload</div>
                                {error}
                            </div>
                        ) : (
                            <pre className="border-primary/10 text-primary min-h-[430px] overflow-auto rounded-2xl border bg-black/50 p-4 text-xs leading-6">
                                {output || '// run pretty or minify to generate formatted output'}
                            </pre>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

function StatusTile({ label, value, tone = 'idle' }: { label: string; value: string; tone?: 'good' | 'bad' | 'idle' }) {
    const color = tone === 'bad' ? 'text-red-300' : tone === 'good' ? 'text-primary' : 'text-on-surface-variant';

    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-on-surface-variant/55 text-[9px] font-bold tracking-widest uppercase">{label}</div>
            <div className={`font-display mt-2 text-lg font-bold uppercase ${color}`}>{value}</div>
        </div>
    );
}

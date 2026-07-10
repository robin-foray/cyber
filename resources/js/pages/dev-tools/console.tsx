import { formatJson, inspectJson, type FormatMode } from '@/lib/json-formatter';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Database, Eraser, FileJson2, Minimize2, Terminal, Wand2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const sampleJson = `{"node":"foray-core","status":"sync","tools":["json_formatter","runtime_probe"],"payload":{"latency":0.4,"verified":true}}`;

export default function Console() {
    const [input, setInput] = useState(sampleJson);
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
            <Head title="JSON Formatter" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                            <FileJson2 size={18} />
                            DEV_TOOL_01 // JSON_FORMATTER
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            JSON <span className="glow-text text-primary">Formatter</span>
                        </h1>
                    </div>

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
                </div>

                <div className="mb-6 grid gap-3 lg:grid-cols-4">
                    <StatusTile label="Parse_State" value={error ? 'INVALID' : isValid ? 'VALID' : 'IDLE'} tone={error ? 'bad' : isValid ? 'good' : 'idle'} />
                    <StatusTile label="Mode" value={mode} />
                    <StatusTile label="Keys" value={String(stats.keys)} />
                    <StatusTile label="Nodes" value={String(stats.nodes)} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                                <Terminal size={18} />
                                input_buffer
                            </div>
                            <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                indent
                                <select
                                    value={indent}
                                    onChange={(event) => setIndent(Number(event.target.value))}
                                    className="rounded-lg border border-primary/15 bg-black px-2 py-1 text-primary outline-none"
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
                            className="min-h-[430px] w-full resize-y rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-on-surface-variant outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_18px_rgba(204,255,0,0.12)]"
                            placeholder='{"status":"paste_json_here"}'
                        />
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                                <Database size={18} />
                                output_stream
                            </div>
                            <div className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${error ? 'text-red-300' : 'text-primary'}`}>
                                {error ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                {error ? 'parse_error' : 'ready'}
                            </div>
                        </div>

                        {error ? (
                            <div className="min-h-[430px] rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-6 text-red-200">
                                <div className="mb-3 font-bold uppercase tracking-widest">formatter rejected payload</div>
                                {error}
                            </div>
                        ) : (
                            <pre className="min-h-[430px] overflow-auto rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-primary">
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
            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/55 uppercase">{label}</div>
            <div className={`mt-2 font-display text-lg font-bold uppercase ${color}`}>{value}</div>
        </div>
    );
}

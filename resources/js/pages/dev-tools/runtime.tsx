import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { executeCodec, type CodecMode } from '@/lib/runtime-codec';
import { Head } from '@inertiajs/react';
import { Binary, Clipboard, Cpu, Eraser, FileKey2, Link2, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';

const modes: Array<{ id: CodecMode; label: string; icon: typeof Binary }> = [
    { id: 'base64-encode', label: 'Base64 Encode', icon: Binary },
    { id: 'base64-decode', label: 'Base64 Decode', icon: Binary },
    { id: 'url-encode', label: 'URL Encode', icon: Link2 },
    { id: 'url-decode', label: 'URL Decode', icon: Link2 },
    { id: 'jwt-inspect', label: 'JWT Inspect', icon: FileKey2 },
];

export default function Runtime() {
    const page = useDevToolPage('runtime');
    const [mode, setMode] = useState<CodecMode>('base64-decode');
    const [input, setInput] = useState(page.sampleInput ?? '');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const telemetry = useMemo(
        () => ({
            chars: input.length,
            bytes: new Blob([input]).size,
            lines: input ? input.split(/\r\n|\r|\n/).length : 0,
        }),
        [input],
    );

    function execute(nextMode = mode) {
        setMode(nextMode);
        setCopied(false);

        const result = executeCodec(nextMode, input);
        setOutput(result.output);
        setError(result.error);
    }

    async function copyOutput() {
        if (!output) {
            return;
        }

        await navigator.clipboard.writeText(output);
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
            <section className="cyber-grid border-primary/15 bg-surface min-w-0 overflow-hidden rounded-3xl border p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                <DevToolPageHeader
                    slug="runtime"
                    actions={
                        <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
                            <button type="button" onClick={() => execute()} className="cyber-tool-button">
                                <Cpu size={15} /> Execute
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

                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                    <StatusTile label="Chars" value={String(telemetry.chars)} />
                    <StatusTile label="Bytes" value={String(telemetry.bytes)} />
                    <StatusTile label="Lines" value={String(telemetry.lines)} />
                </div>

                <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {modes.map((item) => {
                        const Icon = item.icon;
                        const active = item.id === mode;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => execute(item.id)}
                                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                    active
                                        ? 'border-primary bg-primary text-black shadow-[0_0_18px_rgba(204,255,0,0.28)]'
                                        : 'border-primary/15 text-on-surface-variant hover:border-primary/45 hover:text-primary bg-black/35'
                                }`}
                            >
                                <Icon size={14} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid min-w-0 gap-6 xl:grid-cols-2">
                    <div className="min-w-0 rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="text-primary mb-4 flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                            <Binary size={18} />
                            input_payload
                        </div>
                        <textarea
                            value={input}
                            onChange={(event) => {
                                setInput(event.target.value);
                                setOutput('');
                                setError('');
                            }}
                            spellCheck={false}
                            className="border-primary/10 text-on-surface-variant focus:border-primary/50 min-h-[240px] w-full min-w-0 resize-y rounded-2xl border bg-black/50 p-4 text-base leading-6 transition-all outline-none focus:shadow-[0_0_18px_rgba(204,255,0,0.12)] sm:min-h-[360px] sm:text-xs md:min-h-[390px]"
                            placeholder="paste payload, token, URL fragment..."
                        />
                    </div>

                    <div className="min-w-0 rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                <FileKey2 size={18} />
                                decoded_stream
                            </div>
                            <div
                                className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${error ? 'text-red-300' : 'text-primary'}`}
                            >
                                <ShieldAlert size={14} />
                                {error ? 'codec_error' : 'ready'}
                            </div>
                        </div>
                        <pre
                            className={`min-h-[240px] overflow-auto rounded-2xl border p-4 text-base leading-6 sm:min-h-[360px] sm:text-xs md:min-h-[390px] ${
                                error ? 'border-red-500/20 bg-red-500/5 text-red-200' : 'border-primary/10 text-primary bg-black/50'
                            }`}
                        >
                            {error || output || '// choose a codec mode and execute'}
                        </pre>
                    </div>
                </div>
            </section>
        </>
    );
}

function StatusTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-on-surface-variant/55 text-[9px] font-bold tracking-widest uppercase">{label}</div>
            <div className="font-display text-primary mt-2 text-base font-bold break-words uppercase sm:text-lg">{value}</div>
        </div>
    );
}

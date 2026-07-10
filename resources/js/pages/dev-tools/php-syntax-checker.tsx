import { CyberTextOutputSkeleton } from '@/components/cyber/skeleton';
import { Head } from '@inertiajs/react';
import { Braces, CheckCircle2, Clipboard, Eraser, FileCode2, LoaderCircle, ScanSearch, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const samplePhp = `<?php

declare(strict_types=1);

function greet(string $name): string
{
    return "Hello, {$name}";
}`;

export default function PhpSyntaxChecker() {
    const [input, setInput] = useState(samplePhp);
    const [report, setReport] = useState('');
    const [error, setError] = useState('');
    const [line, setLine] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    const telemetry = useMemo(
        () => ({
            lines: input.split(/\r?\n/).length,
            bytes: new Blob([input]).size,
        }),
        [input],
    );

    const isValid = report !== '' && error === '';

    async function runCheck() {
        setProcessing(true);
        setError('');
        setReport('');
        setLine(null);
        setCopied(false);

        try {
            const response = await postJson(route('dev-tools.php-syntax-checker.lint'), { code: input });
            const message = String(response.message ?? '');
            setReport(message);
            setLine(typeof response.line === 'number' ? response.line : null);

            if (!response.valid) {
                setError(message || 'PHP syntax error');
            }
        } catch (exception) {
            setReport('');
            setError(exception instanceof Error ? exception.message : 'PHP lint failed');
        } finally {
            setProcessing(false);
        }
    }

    async function copyReport() {
        if (!report) {
            return;
        }

        await navigator.clipboard.writeText(report);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    function clearBuffers() {
        setInput('');
        setReport('');
        setError('');
        setLine(null);
        setCopied(false);
    }

    return (
        <>
            <Head title="PHP Syntax Checker" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                            <Braces size={18} />
                            DEV_TOOL_08 // PHP_SYNTAX
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            PHP <span className="glow-text text-primary">Syntax</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button type="button" onClick={runCheck} className="cyber-tool-button">
                            <ScanSearch size={15} /> Check
                        </button>
                        <button type="button" onClick={copyReport} className="cyber-tool-button">
                            <Clipboard size={15} /> {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button type="button" onClick={clearBuffers} className="cyber-tool-button">
                            <Eraser size={15} /> Clear
                        </button>
                    </div>
                </div>

                <div className="mb-6 grid gap-3 md:grid-cols-3">
                    <StatusTile label="Lint_State" value={error ? 'INVALID' : isValid ? 'VALID' : 'IDLE'} tone={error ? 'bad' : isValid ? 'good' : 'idle'} />
                    <StatusTile label="Lines" value={String(telemetry.lines)} />
                    <StatusTile label="Bytes" value={String(telemetry.bytes)} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="mb-4 flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                            <FileCode2 size={18} />
                            php_buffer
                        </div>
                        <textarea
                            value={input}
                            onChange={(event) => {
                                setInput(event.target.value);
                                setReport('');
                                setError('');
                                setLine(null);
                            }}
                            spellCheck={false}
                            className="min-h-[430px] w-full resize-y rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-on-surface-variant outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_18px_rgba(204,255,0,0.12)]"
                            placeholder="<?php // paste php here"
                        />
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                                <ScanSearch size={18} />
                                lint_report
                            </div>
                            <div className={statusClass(error, isValid, processing)}>
                                {error ? <XCircle size={14} /> : processing ? <LoaderCircle size={14} className="animate-spin" /> : isValid ? <CheckCircle2 size={14} /> : <ScanSearch size={14} />}
                                {error ? 'invalid' : processing ? 'linting' : isValid ? 'valid' : 'ready'}
                            </div>
                        </div>

                        {processing ? (
                            <CyberTextOutputSkeleton />
                        ) : (
                            <pre className="min-h-[430px] overflow-auto rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-primary">
                                {report || (line ? `// error near line ${line}` : '// run check to lint with php -l')}
                            </pre>
                        )}
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

function statusClass(error: string, isValid: boolean, processing = false) {
    const color = error ? 'text-red-300' : processing ? 'text-on-surface-variant' : isValid ? 'text-primary' : 'text-on-surface-variant';

    return `flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${color}`;
}

async function postJson(url: string, payload: Record<string, unknown>) {
    const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        const message = data?.message || Object.values(data?.errors ?? {}).flat().join(' ') || 'Request failed';
        throw new Error(message);
    }

    return data;
}

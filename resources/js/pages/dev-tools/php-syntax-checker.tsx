import CyberCodeEditor from '@/components/cyber/code-editor';
import { CyberTextOutputSkeleton } from '@/components/cyber/skeleton';
import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Eraser, FileCode2, LoaderCircle, ScanSearch, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const samplePhp = `<?php

declare(strict_types=1);

function greet(string $name): string
{
    return "Hello, {$name}";
}`;

export default function PhpSyntaxChecker() {
    const page = useDevToolPage('php-syntax-checker');
    const [input, setInput] = useState(page.sampleInput ?? samplePhp);
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
            <Head title={page.pageTitle} />
            <section className="cyber-grid border-primary/15 bg-surface min-w-0 overflow-hidden rounded-3xl border p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                <DevToolPageHeader
                    slug="php-syntax-checker"
                    actions={
                        <>
                            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
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
                        </>
                    }
                />

                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                    <StatusTile
                        label="Lint_State"
                        value={error ? 'INVALID' : isValid ? 'VALID' : 'IDLE'}
                        tone={error ? 'bad' : isValid ? 'good' : 'idle'}
                    />
                    <StatusTile label="Lines" value={String(telemetry.lines)} />
                    <StatusTile label="Bytes" value={String(telemetry.bytes)} />
                </div>

                <div className="grid min-w-0 gap-6 xl:grid-cols-2">
                    <div className="min-w-0 rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="text-primary mb-4 flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                            <FileCode2 size={18} />
                            php_buffer
                        </div>
                        <CyberCodeEditor
                            value={input}
                            onChange={(nextValue) => {
                                setInput(nextValue);
                                setReport('');
                                setError('');
                                setLine(null);
                            }}
                            highlightedLines={line ? [line] : []}
                            placeholder="<?php // paste php here"
                        />
                    </div>

                    <div className="min-w-0 rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                <ScanSearch size={18} />
                                lint_report
                            </div>
                            <div className={statusClass(error, isValid, processing)}>
                                {error ? (
                                    <XCircle size={14} />
                                ) : processing ? (
                                    <LoaderCircle size={14} className="animate-spin" />
                                ) : isValid ? (
                                    <CheckCircle2 size={14} />
                                ) : (
                                    <ScanSearch size={14} />
                                )}
                                {error ? 'invalid' : processing ? 'linting' : isValid ? 'valid' : 'ready'}
                            </div>
                        </div>

                        {processing ? (
                            <CyberTextOutputSkeleton />
                        ) : (
                            <pre className="border-primary/10 text-primary min-h-[240px] overflow-auto rounded-2xl border bg-black/50 p-4 text-base leading-6 sm:min-h-[360px] sm:text-xs md:min-h-[430px]">
                                {report || (line ? `// syntax error on line ${line}` : '// run check to lint with php -l')}
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
        <div className="min-w-0 rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-on-surface-variant/55 text-[9px] font-bold tracking-widest uppercase">{label}</div>
            <div className={`font-display mt-2 text-base font-bold break-words uppercase sm:text-lg ${toneClass}`}>{value}</div>
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
        const message =
            data?.message ||
            Object.values(data?.errors ?? {})
                .flat()
                .join(' ') ||
            'Request failed';
        throw new Error(message);
    }

    return data;
}

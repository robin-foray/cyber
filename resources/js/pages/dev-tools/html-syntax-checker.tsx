import CyberCodeEditor from '@/components/cyber/code-editor';
import { checkHtmlSyntax, formatHtmlSyntaxReport } from '@/lib/html-syntax';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Code2, Eraser, FileCode2, ScanSearch, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const sampleHtml = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Foray Node</title>
    </head>
    <body>
        <main id="root">
            <h1>Syntax online</h1>
        </main>
    </body>
</html>`;

export default function HtmlSyntaxChecker() {
    const [input, setInput] = useState(sampleHtml);
    const [report, setReport] = useState('');
    const [error, setError] = useState('');
    const [errorLines, setErrorLines] = useState<number[]>([]);
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const lines = input.split(/\r?\n/).length;
        const tags = (input.match(/<\/?[a-zA-Z][^>]*>/g) ?? []).length;

        return { lines, tags };
    }, [input]);

    const isValid = report !== '' && error === '';

    function runCheck() {
        const result = checkHtmlSyntax(input);
        setReport(formatHtmlSyntaxReport(result));
        setError(result.error);
        setErrorLines([...new Set(result.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.line))]);
        setCopied(false);
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
        setErrorLines([]);
        setCopied(false);
    }

    return (
        <>
            <Head title="HTML Syntax Checker" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                            <FileCode2 size={18} />
                            DEV_TOOL_09 // HTML_SYNTAX
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            HTML <span className="glow-text text-primary">Syntax</span>
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
                    <StatusTile label="Parse_State" value={error ? 'INVALID' : isValid ? 'VALID' : 'IDLE'} tone={error ? 'bad' : isValid ? 'good' : 'idle'} />
                    <StatusTile label="Lines" value={String(stats.lines)} />
                    <StatusTile label="Tags" value={String(stats.tags)} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="mb-4 flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                            <Code2 size={18} />
                            html_buffer
                        </div>
                        <CyberCodeEditor
                            value={input}
                            onChange={(nextValue) => {
                                setInput(nextValue);
                                setReport('');
                                setError('');
                                setErrorLines([]);
                            }}
                            highlightedLines={errorLines}
                            placeholder="<section>paste_html_here</section>"
                        />
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                                <ScanSearch size={18} />
                                lint_report
                            </div>
                            <div className={statusClass(error, isValid)}>
                                {error ? <XCircle size={14} /> : isValid ? <CheckCircle2 size={14} /> : <ScanSearch size={14} />}
                                {error ? 'invalid' : isValid ? 'valid' : 'ready'}
                            </div>
                        </div>

                        <pre className="min-h-[430px] overflow-auto rounded-2xl border border-primary/10 bg-black/50 p-4 text-xs leading-6 text-primary">
                            {report || '// run check to lint HTML structure'}
                        </pre>
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

function statusClass(error: string, isValid: boolean) {
    const color = error ? 'text-red-300' : isValid ? 'text-primary' : 'text-on-surface-variant';

    return `flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${color}`;
}

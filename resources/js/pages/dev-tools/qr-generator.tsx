import { CyberImagePreviewSkeleton } from '@/components/cyber/skeleton';
import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { generateQrCodeDataUrl, type QrErrorCorrectionLevel } from '@/lib/qr-code';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Download, Eraser, QrCode, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function QrGenerator() {
    const page = useDevToolPage('qr-generator');
    const [value, setValue] = useState(page.sampleInput ?? '');
    const [size, setSize] = useState(320);
    const [margin, setMargin] = useState(2);
    const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<QrErrorCorrectionLevel>('M');
    const [dataUrl, setDataUrl] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    const telemetry = useMemo(
        () => ({
            chars: value.length,
            size: `${size}px`,
            ecl: errorCorrectionLevel,
        }),
        [errorCorrectionLevel, size, value],
    );

    async function generate() {
        setProcessing(true);
        setError('');
        setCopied(false);

        try {
            const nextDataUrl = await generateQrCodeDataUrl(value, {
                width: size,
                margin,
                errorCorrectionLevel,
            });

            setDataUrl(nextDataUrl);
        } catch (exception) {
            setDataUrl('');
            setError(exception instanceof Error ? exception.message : 'QR generation failed');
        } finally {
            setProcessing(false);
        }
    }

    async function copyValue() {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    function downloadPng() {
        if (!dataUrl) {
            return;
        }

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr-code.png';
        link.click();
    }

    function clearAll() {
        setValue('');
        setDataUrl('');
        setError('');
        setCopied(false);
    }

    return (
        <>
            <Head title={page.pageTitle} />
            <section className="cyber-grid border-primary/15 bg-surface rounded-3xl border p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <DevToolPageHeader
                    slug="qr-generator"
                    actions={
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                            <button type="button" onClick={generate} className="cyber-tool-button" disabled={processing}>
                                <QrCode size={15} />
                                Generate
                            </button>
                            <button type="button" onClick={copyValue} className="cyber-tool-button">
                                <Clipboard size={15} /> {copied ? 'Copied' : 'Copy Text'}
                            </button>
                            <button type="button" onClick={downloadPng} className="cyber-tool-button" disabled={!dataUrl}>
                                <Download size={15} /> Download
                            </button>
                            <button type="button" onClick={clearAll} className="cyber-tool-button">
                                <Eraser size={15} /> Clear
                            </button>
                        </div>
                    }
                />

                <div className="mb-6 grid gap-3 md:grid-cols-3">
                    <StatusTile label="Chars" value={String(telemetry.chars)} />
                    <StatusTile label="Size" value={telemetry.size} />
                    <StatusTile label="ECL" value={telemetry.ecl} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="text-primary mb-4 flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                            <QrCode size={18} />
                            qr_payload
                        </div>
                        <textarea
                            value={value}
                            onChange={(event) => {
                                setValue(event.target.value);
                                setError('');
                            }}
                            spellCheck={false}
                            className="border-primary/10 text-on-surface-variant focus:border-primary/50 min-h-[250px] w-full resize-y rounded-2xl border bg-black/50 p-4 text-xs leading-6 transition-all outline-none focus:shadow-[0_0_18px_rgba(204,255,0,0.12)]"
                            placeholder="url, text, json, or any payload..."
                        />

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <label className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">
                                size_px
                                <input
                                    type="number"
                                    min={20}
                                    max={1024}
                                    step={1}
                                    value={size}
                                    onChange={(event) => setSize(Number(event.target.value) || 320)}
                                    className="border-primary/15 text-primary mt-2 h-10 w-full rounded-lg border bg-black px-3 outline-none"
                                />
                            </label>
                            <label className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase">
                                margin
                                <input
                                    type="number"
                                    min={0}
                                    max={8}
                                    step={1}
                                    value={margin}
                                    onChange={(event) => setMargin(Number(event.target.value) || 0)}
                                    className="border-primary/15 text-primary mt-2 h-10 w-full rounded-lg border bg-black px-3 outline-none"
                                />
                            </label>
                            <label className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase sm:col-span-2">
                                error_correction_level
                                <select
                                    value={errorCorrectionLevel}
                                    onChange={(event) => setErrorCorrectionLevel(event.target.value as QrErrorCorrectionLevel)}
                                    className="border-primary/15 text-primary mt-2 h-10 w-full rounded-lg border bg-black px-3 outline-none"
                                >
                                    <option value="L">L (7%)</option>
                                    <option value="M">M (15%)</option>
                                    <option value="Q">Q (25%)</option>
                                    <option value="H">H (30%)</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="border-primary/20 rounded-2xl border bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                <QrCode size={18} />
                                qr_output
                            </div>
                            <div className={statusClass(error, processing)}>
                                {error ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                {error ? 'generation_error' : processing ? 'processing' : dataUrl ? 'ready' : 'idle'}
                            </div>
                        </div>

                        {error ? (
                            <div className="min-h-[430px] rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-6 text-red-200">
                                {error}
                            </div>
                        ) : processing ? (
                            <CyberImagePreviewSkeleton size={Math.min(size, 280)} label="qr_render" />
                        ) : dataUrl ? (
                            <div className="border-primary/10 flex min-h-[430px] items-center justify-center rounded-2xl border bg-black/50 p-6">
                                <img
                                    src={dataUrl}
                                    alt="Generated QR code"
                                    width={size}
                                    height={size}
                                    className="border-primary/20 rounded-xl border"
                                    style={{ width: size, height: size }}
                                />
                            </div>
                        ) : (
                            <div className="border-primary/10 text-on-surface-variant flex min-h-[430px] items-center justify-center rounded-2xl border bg-black/50 p-4 text-xs">
                                // click generate to create QR code preview
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

function StatusTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-on-surface-variant/55 text-[9px] font-bold tracking-widest uppercase">{label}</div>
            <div className="font-display text-primary mt-2 text-lg font-bold uppercase">{value}</div>
        </div>
    );
}

function statusClass(error: string, processing = false) {
    const color = error ? 'text-red-300' : processing ? 'text-on-surface-variant' : 'text-primary';

    return `flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${color}`;
}

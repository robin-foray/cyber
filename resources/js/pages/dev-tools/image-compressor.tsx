import CyberShell from '@/components/cyber-shell';
import { Head } from '@inertiajs/react';
import { Download, Eraser, FileImage, Gauge, ImageDown, LoaderCircle, ScanSearch, SlidersHorizontal, UploadCloud } from 'lucide-react';
import { type ChangeEvent, type ReactNode, useMemo, useState } from 'react';

type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png';

type CompressedImage = {
    blob: Blob;
    url: string;
    width: number;
    height: number;
    name: string;
};

const formats: Array<{ label: string; value: OutputFormat; extension: string }> = [
    { label: 'WebP', value: 'image/webp', extension: 'webp' },
    { label: 'JPEG', value: 'image/jpeg', extension: 'jpg' },
    { label: 'PNG', value: 'image/png', extension: 'png' },
];

export default function ImageCompressor() {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourceUrl, setSourceUrl] = useState('');
    const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 });
    const [quality, setQuality] = useState(72);
    const [maxWidth, setMaxWidth] = useState(1280);
    const [maxHeight, setMaxHeight] = useState(960);
    const [format, setFormat] = useState<OutputFormat>('image/webp');
    const [compressed, setCompressed] = useState<CompressedImage | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const telemetry = useMemo(() => {
        const originalBytes = sourceFile?.size ?? 0;
        const compressedBytes = compressed?.blob.size ?? 0;
        const ratio = originalBytes && compressedBytes ? Math.round((1 - compressedBytes / originalBytes) * 100) : null;

        return {
            original: formatBytes(originalBytes),
            compressed: compressedBytes ? formatBytes(compressedBytes) : 'waiting',
            saved: ratio === null ? 'waiting' : ratio >= 0 ? `${ratio}% smaller` : `${Math.abs(ratio)}% larger`,
        };
    }, [compressed, sourceFile]);

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Only image files are supported.');
            return;
        }

        clearOutput();
        setError('');
        setNotice('');
        setSourceFile(file);

        const url = URL.createObjectURL(file);
        setSourceUrl(url);

        const image = await loadImage(url);
        setSourceSize({ width: image.naturalWidth, height: image.naturalHeight });
    }

    async function compressImage() {
        if (!sourceFile || !sourceUrl) {
            setError('Drop or select an image first.');
            return;
        }

        setProcessing(true);
        setError('');
        setNotice('');
        clearOutput();

        try {
            const image = await loadImage(sourceUrl);
            const target = getTargetSize(image.naturalWidth, image.naturalHeight, maxWidth, maxHeight);
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Canvas context is not available.');
            }

            canvas.width = target.width;
            canvas.height = target.height;
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(image, 0, 0, target.width, target.height);

            const blob = await canvasToBlob(canvas, format, quality / 100);
            const extension = formats.find((item) => item.value === format)?.extension ?? 'webp';
            const name = `${sourceFile.name.replace(/\.[^.]+$/, '')}-compressed.${extension}`;

            setCompressed({
                blob,
                url: URL.createObjectURL(blob),
                width: target.width,
                height: target.height,
                name,
            });

            if (blob.size >= sourceFile.size) {
                setNotice('Original is already smaller. Try lower quality, smaller dimensions, or keep the source file.');
            }
        } catch (exception) {
            setError(exception instanceof Error ? exception.message : 'Image compression failed.');
        } finally {
            setProcessing(false);
        }
    }

    function downloadImage() {
        if (!compressed) {
            return;
        }

        const link = document.createElement('a');
        link.href = compressed.url;
        link.download = compressed.name;
        link.click();
    }

    function resetTool() {
        setSourceFile(null);
        setSourceUrl('');
        setSourceSize({ width: 0, height: 0 });
        clearOutput();
        setError('');
        setNotice('');
    }

    function clearOutput() {
        setCompressed(null);
    }

    return (
        <CyberShell>
            <Head title="Image Compressor" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                            <ImageDown size={18} />
                            DEV_TOOL_05 // IMAGE_COMPRESSOR
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            Image <span className="glow-text text-primary">Compressor</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button type="button" onClick={compressImage} className="cyber-tool-button" disabled={processing}>
                            {processing ? <LoaderCircle size={15} className="animate-spin" /> : <Gauge size={15} />}
                            Compress
                        </button>
                        <button type="button" onClick={downloadImage} className="cyber-tool-button" disabled={!compressed}>
                            <Download size={15} /> Download
                        </button>
                        <button type="button" onClick={resetTool} className="cyber-tool-button">
                            <Eraser size={15} /> Clear
                        </button>
                    </div>
                </div>

                <div className="mb-6 grid gap-3 md:grid-cols-3">
                    <StatusTile label="Original" value={telemetry.original} />
                    <StatusTile label="Compressed" value={telemetry.compressed} />
                    <StatusTile label="Saved" value={telemetry.saved} />
                </div>

                <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                    <aside className="space-y-5 rounded-2xl border border-primary/15 bg-black/45 p-5">
                        <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-5 text-center transition-all hover:border-primary/60 hover:bg-primary/10">
                            <UploadCloud className="mb-4 text-primary" size={34} />
                            <span className="font-display text-lg font-bold text-white uppercase">Upload image</span>
                            <span className="mt-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">JPG, PNG, WebP, GIF source</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>

                        <div className="space-y-4">
                            <ControlBlock label={`Quality // ${quality}%`}>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    disabled={format === 'image/png'}
                                    onChange={(event) => setQuality(Number(event.target.value))}
                                    className="w-full accent-primary disabled:opacity-35"
                                />
                                {format === 'image/png' && (
                                    <div className="mt-2 text-[9px] font-bold tracking-widest text-on-surface-variant/55 uppercase">
                                        PNG ignores quality. Use WebP/JPEG for real compression.
                                    </div>
                                )}
                            </ControlBlock>

                            <ControlBlock label="Output format">
                                <div className="grid grid-cols-3 gap-2">
                                    {formats.map((item) => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => setFormat(item.value)}
                                            className={`rounded-xl border px-3 py-3 text-[10px] font-bold uppercase transition-all ${
                                                format === item.value
                                                    ? 'border-primary bg-primary text-black shadow-[0_0_18px_rgba(204,255,0,0.25)]'
                                                    : 'border-primary/15 bg-black/35 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </ControlBlock>

                            <div className="grid grid-cols-2 gap-3">
                                <ControlBlock label="Max width">
                                    <NumberInput value={maxWidth} onChange={setMaxWidth} />
                                </ControlBlock>
                                <ControlBlock label="Max height">
                                    <NumberInput value={maxHeight} onChange={setMaxHeight} />
                                </ControlBlock>
                            </div>
                        </div>

                        {notice && <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/5 p-4 font-mono text-sm text-yellow-100">{notice}</div>}
                        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 font-mono text-sm text-red-200">{error}</div>}
                    </aside>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <PreviewPanel
                            title="source_frame"
                            icon={<FileImage size={18} />}
                            imageUrl={sourceUrl}
                            meta={sourceFile ? `${sourceSize.width}x${sourceSize.height} // ${formatBytes(sourceFile.size)}` : 'waiting for image'}
                        />
                        <PreviewPanel
                            title="compressed_frame"
                            icon={<ScanSearch size={18} />}
                            imageUrl={compressed?.url ?? ''}
                            meta={compressed ? `${compressed.width}x${compressed.height} // ${formatBytes(compressed.blob.size)}` : 'run compression'}
                        />
                    </div>
                </div>
            </section>
        </CyberShell>
    );
}

function StatusTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/55 uppercase">{label}</div>
            <div className="mt-2 font-display text-lg font-bold text-primary uppercase">{value}</div>
        </div>
    );
}

function ControlBlock({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                <SlidersHorizontal size={13} />
                {label}
            </div>
            {children}
        </div>
    );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
    return (
        <input
            type="number"
            min="64"
            max="8000"
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full rounded-xl border border-primary/15 bg-black/45 px-3 py-3 font-mono text-sm font-bold text-white outline-none transition-all focus:border-primary/60"
        />
    );
}

function PreviewPanel({ title, icon, imageUrl, meta }: { title: string; icon: ReactNode; imageUrl: string; meta: string }) {
    return (
        <div className="rounded-2xl border border-primary/15 bg-black/45 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                    {icon}
                    {title}
                </div>
                <div className="truncate text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">{meta}</div>
            </div>
            <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-black/55">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="max-h-[520px] w-full object-contain" />
                ) : (
                    <div className="px-6 text-center text-[10px] font-bold tracking-widest text-on-surface-variant/50 uppercase">no image loaded</div>
                )}
            </div>
        </div>
    );
}

function loadImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Image could not be decoded.'));
        image.src = url;
    });
}

function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number) {
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Compression produced no output.'));
                    return;
                }

                resolve(blob);
            },
            format,
            format === 'image/png' ? undefined : quality,
        );
    });
}

function getTargetSize(width: number, height: number, maxWidth: number, maxHeight: number) {
    const safeMaxWidth = Math.max(64, maxWidth || width);
    const safeMaxHeight = Math.max(64, maxHeight || height);
    const ratio = Math.min(1, safeMaxWidth / width, safeMaxHeight / height);

    return {
        width: Math.max(1, Math.round(width * ratio)),
        height: Math.max(1, Math.round(height * ratio)),
    };
}

function formatBytes(bytes: number) {
    if (!bytes) {
        return 'waiting';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

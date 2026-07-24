import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { colorFormatOptions, colorPresets, convertColor, type ColorFormat } from '@/lib/color-converter';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Droplets, Eraser, Pipette, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ColorConverter() {
    const page = useDevToolPage('color-converter');
    const [input, setInput] = useState(page.sampleInput ?? '#ccff00');
    const [format, setFormat] = useState<ColorFormat>('hex');
    const [copiedKey, setCopiedKey] = useState('');

    const conversion = useMemo(() => convertColor(input, format), [format, input]);
    const isValid = conversion.error === '';

    async function copyValue(key: string, value: string) {
        if (!value) {
            return;
        }

        await navigator.clipboard.writeText(value);
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey(''), 1400);
    }

    function clearInput() {
        setInput('');
        setCopiedKey('');
    }

    return (
        <>
            <Head title={page.pageTitle} />
            <section className="cyber-grid min-w-0 overflow-hidden rounded-3xl border border-primary/15 bg-surface p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                <DevToolPageHeader
                    slug="color-converter"
                    actions={
                        <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
                            <button type="button" onClick={() => copyValue('input', input)} className="cyber-tool-button">
                                <Clipboard size={15} /> {copiedKey === 'input' ? 'Copied' : 'Copy Input'}
                            </button>
                            <button type="button" onClick={clearInput} className="cyber-tool-button">
                                <Eraser size={15} /> Clear
                            </button>
                        </div>
                    }
                />

                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatusTile label="Parse_State" value={isValid ? 'VALID' : 'INVALID'} tone={isValid ? 'good' : 'bad'} />
                    <StatusTile label="Format" value={format.toUpperCase()} />
                    <StatusTile label="Red" value={isValid ? String(conversion.rgbaValues.r) : '--'} />
                    <StatusTile label="Alpha" value={isValid ? String(conversion.rgbaValues.a) : '--'} />
                </div>

                <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                    <div className="min-w-0 space-y-6">
                        <div className="rounded-2xl border border-white/5 bg-black/45 p-5">
                            <label htmlFor="color-input" className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
                                <Pipette size={16} />
                                source_color
                            </label>
                            <div className="grid gap-3 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
                                <select
                                    value={format}
                                    onChange={(event) => setFormat(event.target.value as ColorFormat)}
                                    className="min-w-0 w-full rounded-2xl border border-primary/15 bg-black/55 px-4 py-4 font-mono text-base font-bold tracking-widest text-primary uppercase outline-none transition-all focus:border-primary/60 sm:text-sm"
                                >
                                    {colorFormatOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    id="color-input"
                                    value={input}
                                    onChange={(event) => setInput(event.target.value)}
                                    spellCheck={false}
                                    className="w-full min-w-0 rounded-2xl border border-primary/15 bg-black/55 px-4 py-4 font-mono text-base font-bold tracking-wide text-white outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary/60 focus:shadow-[0_0_20px_rgba(204,255,0,0.14)]"
                                    placeholder="#ccff00"
                                />
                            </div>

                            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                {colorPresets.map((preset) => (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() => {
                                            setInput(preset.value);
                                            setFormat('hex');
                                        }}
                                        className="rounded-xl border border-primary/10 bg-black/35 px-3 py-3 text-left text-[10px] font-bold tracking-widest text-on-surface-variant uppercase transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                    >
                                        <span className="flex items-center gap-2 text-white">
                                            <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: preset.value }} />
                                            {preset.label}
                                        </span>
                                        <span className="mt-1 block font-mono text-primary">{preset.value}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <OutputCard label="hex" value={conversion.hex} copied={copiedKey === 'hex'} onCopy={() => copyValue('hex', conversion.hex)} />
                            <OutputCard label="rgb" value={conversion.rgb} copied={copiedKey === 'rgb'} onCopy={() => copyValue('rgb', conversion.rgb)} />
                            <OutputCard label="rgba" value={conversion.rgba} copied={copiedKey === 'rgba'} onCopy={() => copyValue('rgba', conversion.rgba)} />
                            <OutputCard label="hsl" value={conversion.hsl} copied={copiedKey === 'hsl'} onCopy={() => copyValue('hsl', conversion.hsl)} />
                            <OutputCard label="hsla" value={conversion.hsla} copied={copiedKey === 'hsla'} onCopy={() => copyValue('hsla', conversion.hsla)} />
                        </div>
                    </div>

                    <div className="min-w-0 rounded-2xl border border-primary/20 bg-black/60 p-5">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary uppercase">
                                <Droplets size={18} />
                                preview_panel
                            </div>
                            <div className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${isValid ? 'text-primary' : 'text-red-300'}`}>
                                {isValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                {isValid ? 'rendered' : 'invalid'}
                            </div>
                        </div>

                        <div
                            className="min-h-[200px] rounded-2xl border border-primary/15 shadow-[inset_0_0_40px_rgba(0,0,0,0.35)] sm:min-h-[280px] md:min-h-[320px]"
                            style={{ backgroundColor: isValid ? conversion.rgba : '#131313' }}
                        />
                        <div className="mt-4 rounded-2xl border border-primary/10 bg-black/50 p-4 font-mono text-xs leading-6 text-on-surface-variant">
                            {isValid ? (
                                <>
                                    <div>r: {conversion.rgbaValues.r}</div>
                                    <div>g: {conversion.rgbaValues.g}</div>
                                    <div>b: {conversion.rgbaValues.b}</div>
                                    <div>a: {conversion.rgbaValues.a}</div>
                                </>
                            ) : (
                                <div className="text-red-200">{conversion.error}</div>
                            )}
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
            <div className="text-[9px] font-bold tracking-widest text-on-surface-variant/55 uppercase">{label}</div>
            <div className={`font-display mt-2 text-base font-bold break-words uppercase sm:text-lg ${toneClass}`}>{value}</div>
        </div>
    );
}

function OutputCard({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
    return (
        <div className="min-w-0 rounded-2xl border border-primary/10 bg-black/45 p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">{label}</span>
                <button type="button" onClick={onCopy} className="cyber-tool-button !min-h-9 !px-3 !py-2 text-[10px]">
                    <Clipboard size={13} /> {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="font-mono text-sm break-all text-white">{value || '// waiting for valid color'}</div>
        </div>
    );
}

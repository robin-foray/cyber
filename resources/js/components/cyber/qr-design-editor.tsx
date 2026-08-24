import { QrStylePicker } from '@/components/cyber/qr-style-picker';
import {
    fetchAsDataUrl,
    normalizeQrLinkDesign,
    QR_EYE_STYLE_OPTIONS,
    QR_LOGO_SHAPE_OPTIONS,
    QR_MODULE_SHAPE_OPTIONS,
    readFileAsDataUrl,
    renderDesignedQr,
    resolvedQrColors,
    type QrLinkDesign,
} from '@/lib/qr-design';
import { QR_FRAME_PRESETS } from '@/lib/qr-frame';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useState, type ChangeEvent } from 'react';

export type { QrLinkDesign };

export function useDesignedQrPreview(
    publicUrl: string,
    design: QrLinkDesign,
    name: string,
    width: number,
    logoDataUrl: string | null,
) {
    const [previewUrl, setPreviewUrl] = useState('');
    const [html, setHtml] = useState('');
    const [svg, setSvg] = useState('');
    const [usesHtmlPreview, setUsesHtmlPreview] = useState(false);

    useEffect(() => {
        let cancelled = false;

        renderDesignedQr({
            value: publicUrl,
            design,
            name,
            logoDataUrl,
            qrWidth: width,
        })
            .then((result) => {
                if (cancelled) {
                    return;
                }

                setPreviewUrl(result.previewUrl);
                setHtml(result.html);
                setSvg(result.svg);
                setUsesHtmlPreview(result.usesHtmlPreview);
            })
            .catch(() => {
                if (!cancelled) {
                    setPreviewUrl('');
                    setHtml('');
                    setSvg('');
                    setUsesHtmlPreview(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [publicUrl, design, name, width, logoDataUrl]);

    return { previewUrl, html, svg, usesHtmlPreview, colors: resolvedQrColors(design) };
}

export function useQrLogoDataUrl(file: File | null, remoteUrl: string | null, removed: boolean) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (removed) {
            setDataUrl(null);

            return;
        }

        if (file) {
            readFileAsDataUrl(file)
                .then((url) => {
                    if (!cancelled) {
                        setDataUrl(url);
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setDataUrl(null);
                    }
                });

            return () => {
                cancelled = true;
            };
        }

        if (!remoteUrl) {
            setDataUrl(null);

            return;
        }

        fetchAsDataUrl(remoteUrl)
            .then((url) => {
                if (!cancelled) {
                    setDataUrl(url);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setDataUrl(null);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [file, remoteUrl, removed]);

    return dataUrl;
}

type QrDesignEditorProps = {
    design: QrLinkDesign;
    onChange: (design: QrLinkDesign) => void;
    logoUrl: string | null;
    logoFile: File | null;
    onLogoFile: (file: File | null) => void;
    removeLogo: boolean;
    onRemoveLogo: (remove: boolean) => void;
    compact?: boolean;
};

export function QrDesignEditor({
    design,
    onChange,
    logoUrl,
    logoFile,
    onLogoFile,
    removeLogo,
    onRemoveLogo,
    compact = false,
}: QrDesignEditorProps) {
    const normalized = normalizeQrLinkDesign(design);
    const colors = resolvedQrColors(normalized);
    const showingLogo = Boolean(logoFile) || (Boolean(logoUrl) && !removeLogo);

    function patch(partial: Partial<QrLinkDesign>) {
        onChange(normalizeQrLinkDesign({ ...normalized, ...partial }));
    }

    function onLogoSelected(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        onLogoFile(file);
        onRemoveLogo(false);
        event.target.value = '';
    }

    return (
        <div className="space-y-4">
            <QrStylePicker
                value={normalized.style_id}
                onChange={(styleId) => patch({ style_id: styleId, dark: '', light: '' })}
                compact={compact}
            />

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Sötét szín</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={colors.dark}
                            onChange={(event) => patch({ dark: event.target.value })}
                            className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-black"
                        />
                        <input
                            value={normalized.dark || colors.dark}
                            onChange={(event) => patch({ dark: event.target.value })}
                            className="cyber-input w-full font-mono text-xs"
                        />
                    </div>
                </label>
                <label className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Világos szín</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={colors.light}
                            onChange={(event) => patch({ light: event.target.value })}
                            className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-black"
                        />
                        <input
                            value={normalized.light || colors.light}
                            onChange={(event) => patch({ light: event.target.value })}
                            className="cyber-input w-full font-mono text-xs"
                        />
                    </div>
                </label>
                <label className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Modul forma</span>
                    <select
                        value={normalized.module_shape}
                        onChange={(event) => patch({ module_shape: event.target.value as QrLinkDesign['module_shape'] })}
                        className="cyber-input w-full"
                    >
                        <option value="">Preset alap</option>
                        {QR_MODULE_SHAPE_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Eye stílus</span>
                    <select
                        value={normalized.eye_style}
                        onChange={(event) => patch({ eye_style: event.target.value as QrLinkDesign['eye_style'] })}
                        className="cyber-input w-full"
                    >
                        <option value="">Preset alap</option>
                        {QR_EYE_STYLE_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase">Logó</p>
                <div className="flex flex-wrap items-center gap-3">
                    {showingLogo ? (
                        <img
                            src={logoFile ? URL.createObjectURL(logoFile) : (logoUrl ?? '')}
                            alt=""
                            className="h-14 w-14 rounded-xl border border-primary/20 object-contain bg-black"
                        />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-white/15 text-on-surface-variant">
                            <ImagePlus size={18} />
                        </div>
                    )}
                    <label className="cyber-tool-button inline-flex cursor-pointer items-center gap-2">
                        <ImagePlus size={14} />
                        Logó feltöltése
                        <input type="file" accept="image/*,.svg" className="hidden" onChange={onLogoSelected} />
                    </label>
                    {showingLogo && (
                        <button
                            type="button"
                            onClick={() => {
                                onLogoFile(null);
                                onRemoveLogo(true);
                            }}
                            className="cyber-tool-button inline-flex items-center gap-2 border-red-500/40 text-red-300"
                        >
                            <Trash2 size={14} />
                            Logó törlése
                        </button>
                    )}
                </div>
                <label className="block space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                        Logó méret {normalized.logo_size}%
                    </span>
                    <input
                        type="range"
                        min={10}
                        max={32}
                        value={normalized.logo_size}
                        onChange={(event) => patch({ logo_size: Number(event.target.value) })}
                        className="w-full accent-primary"
                    />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Logó forma</span>
                        <select
                            value={normalized.logo_shape}
                            onChange={(event) => patch({ logo_shape: event.target.value as QrLinkDesign['logo_shape'] })}
                            className="cyber-input w-full"
                        >
                            {QR_LOGO_SHAPE_OPTIONS.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex items-center gap-2 pt-6">
                        <input
                            type="checkbox"
                            checked={normalized.logo_pad}
                            onChange={(event) => patch({ logo_pad: event.target.checked })}
                            className="size-4 accent-primary"
                        />
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                            Világos hátteres logó
                        </span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase">Keret / struktúra</p>
                <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
                    {QR_FRAME_PRESETS.map((preset) => {
                        const selected = preset.id === normalized.frame;

                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => patch({ frame: preset.id })}
                                className={`rounded-xl border px-2.5 py-2 text-left text-[10px] font-bold tracking-widest uppercase ${
                                    selected
                                        ? 'border-primary/50 bg-primary/10 text-primary'
                                        : 'border-white/10 bg-black/35 text-on-surface-variant'
                                }`}
                            >
                                {preset.label}
                            </button>
                        );
                    })}
                </div>
                <label className="block space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Felirat</span>
                    <input
                        value={normalized.caption}
                        onChange={(event) => patch({ caption: event.target.value })}
                        placeholder="Scan to join"
                        className="cyber-input w-full"
                    />
                </label>
                <label className="block space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Alcím</span>
                    <input
                        value={normalized.subtitle}
                        onChange={(event) => patch({ subtitle: event.target.value })}
                        placeholder="Foray 2026"
                        className="cyber-input w-full"
                    />
                </label>
                <label className="block space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                        Beágyazott HTML
                    </span>
                    <textarea
                        value={normalized.embed_html}
                        onChange={(event) => patch({ embed_html: event.target.value })}
                        rows={compact ? 6 : 8}
                        placeholder={'<section>\n  <h1>{{name}}</h1>\n  {{qr}}\n  <p>{{caption}}</p>\n</section>'}
                        className="cyber-input min-h-[140px] w-full font-mono text-xs"
                    />
                    <span className="block text-[10px] text-on-surface-variant/80">
                        Helyőrzők: {'{{qr}}'} {'{{name}}'} {'{{url}}'} {'{{caption}}'} {'{{subtitle}}'}. A preview sandboxolt iframe.
                    </span>
                </label>
            </div>
        </div>
    );
}

export function downloadTextFile(filename: string, contents: string, mime: string) {
    const blob = new Blob([contents], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

export function downloadDataUrl(filename: string, dataUrl: string) {
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = filename;
    anchor.click();
}

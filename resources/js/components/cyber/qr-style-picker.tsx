import {
    DEFAULT_QR_STYLE_ID,
    generateQrCodeDataUrl,
    getQrStylePreset,
    QR_STYLE_PRESETS,
    type QrStyleId,
} from '@/lib/qr-code';
import { useEffect, useState } from 'react';

const STYLE_STORAGE_PREFIX = 'foray.qr-style.';

export function readStoredQrStyle(linkId: number): QrStyleId {
    if (typeof window === 'undefined') {
        return DEFAULT_QR_STYLE_ID;
    }

    try {
        const stored = window.localStorage.getItem(`${STYLE_STORAGE_PREFIX}${linkId}`);

        return getQrStylePreset(stored ?? undefined).id;
    } catch {
        return DEFAULT_QR_STYLE_ID;
    }
}

export function persistQrStyle(linkId: number, styleId: QrStyleId): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(`${STYLE_STORAGE_PREFIX}${linkId}`, styleId);
    } catch {
        // Ignore quota / private mode failures.
    }
}

export function useQrLinkPreview(publicUrl: string, linkId: number, width: number) {
    const [styleId, setStyleId] = useState<QrStyleId>(() => readStoredQrStyle(linkId));
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        setStyleId(readStoredQrStyle(linkId));
    }, [linkId]);

    useEffect(() => {
        let cancelled = false;

        generateQrCodeDataUrl(publicUrl, { width, margin: 2, styleId })
            .then((dataUrl) => {
                if (!cancelled) {
                    setQrDataUrl(dataUrl);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setQrDataUrl('');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [publicUrl, styleId, width]);

    function selectStyle(nextStyleId: QrStyleId) {
        setStyleId(nextStyleId);
        persistQrStyle(linkId, nextStyleId);
    }

    return { styleId, selectStyle, qrDataUrl, styleLabel: getQrStylePreset(styleId).label };
}

type QrStylePickerProps = {
    value: QrStyleId;
    onChange: (styleId: QrStyleId) => void;
    compact?: boolean;
};

export function QrStylePicker({ value, onChange, compact = false }: QrStylePickerProps) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-widest text-primary uppercase">QR stílus</p>
            <div className={`grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
                {QR_STYLE_PRESETS.map((preset) => {
                    const selected = preset.id === value;

                    return (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => onChange(preset.id)}
                            className={`rounded-xl border px-2.5 py-2 text-left transition-colors ${
                                selected
                                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_14px_rgba(204,255,0,0.14)]'
                                    : 'border-white/10 bg-black/35 hover:border-primary/25'
                            }`}
                        >
                            <span
                                className="mb-2 flex h-8 items-center justify-center gap-1 rounded-md border border-white/10"
                                style={{ background: preset.light }}
                                aria-hidden
                            >
                                <span className="size-2.5 rounded-[2px]" style={{ background: preset.dark }} />
                                <span className="size-2 rounded-full" style={{ background: preset.dark }} />
                                <span
                                    className="size-2.5 rotate-45"
                                    style={{
                                        background: preset.dark,
                                        borderRadius: preset.moduleShape === 'soft' || preset.moduleShape === 'rounded' ? 2 : 0,
                                    }}
                                />
                            </span>
                            <span className="block truncate text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                {preset.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

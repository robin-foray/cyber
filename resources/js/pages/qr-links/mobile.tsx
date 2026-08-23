import { QrStylePicker, useQrLinkPreview } from '@/components/cyber/qr-style-picker';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, ChevronRight, Copy, Download, ExternalLink, Monitor, Plus, QrCode, Save, Share2, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';

type QrLinkItem = {
    id: number;
    name: string;
    slug: string;
    destination_url: string;
    notes: string | null;
    public_url: string;
    qr_preview_url: string;
    scan_count: number;
    last_scanned_at: string | null;
    is_active: boolean;
    updated_at: string | null;
};

type Props = {
    links: QrLinkItem[];
    publicBaseUrl: string;
};

export default function QrLinksMobile({ links = [], publicBaseUrl }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(links[0]?.id ?? null);
    const [showCreate, setShowCreate] = useState(links.length === 0);
    const detailRef = useRef<HTMLElement>(null);
    const selectedLink = links.find((link) => link.id === selectedId) ?? null;

    useEffect(() => {
        if (links.length === 0) {
            setSelectedId(null);
            setShowCreate(true);

            return;
        }

        if (!links.some((link) => link.id === selectedId)) {
            setSelectedId(links[0]?.id ?? null);
        }
    }, [links, selectedId]);

    function selectLink(id: number) {
        setShowCreate(false);
        setSelectedId(id);
        window.requestAnimationFrame(() => {
            detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    return (
        <>
            <Head title="QR Mobile" />

            <section className="mx-auto w-full max-w-lg space-y-4 pb-28">
                <div className="rounded-2xl border border-primary/20 bg-surface/90 p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-widest text-primary">
                                <QrCode size={16} className="shrink-0" />
                                QR_MOBILE
                            </div>
                            <h1 className="font-display text-xl font-bold text-white uppercase">Gyors szerkesztés</h1>
                            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                                Saját QR kódjaid — csak te látod és szerkesztheted. Fix link:{' '}
                                <span className="font-mono text-primary">{publicBaseUrl}/q/…</span>
                            </p>
                        </div>
                        <Link
                            href={route('qr-links.index')}
                            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-primary/25 px-2.5 py-2 text-[10px] font-bold tracking-widest text-primary uppercase"
                        >
                            <Monitor size={14} />
                            Desktop
                        </Link>
                    </div>
                    {links.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowCreate((open) => !open)}
                            className="cyber-tool-button inline-flex w-full items-center justify-center gap-2 py-2.5 text-xs"
                        >
                            <Plus size={14} />
                            {showCreate ? 'Lista vissza' : 'Új QR'}
                        </button>
                    )}
                </div>

                {showCreate || links.length === 0 ? (
                    <MobileCreateForm />
                ) : (
                    <>
                        <div className="space-y-2">
                            <p className="px-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Válassz QR kódot</p>
                            <div className="flex flex-col gap-2">
                                {links.map((link) => {
                                    const isActive = link.id === selectedId;

                                    return (
                                        <button
                                            key={link.id}
                                            type="button"
                                            onClick={() => selectLink(link.id)}
                                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                                                isActive
                                                    ? 'border-primary/40 bg-primary/10 shadow-[0_0_18px_rgba(204,255,0,0.12)]'
                                                    : 'border-white/10 bg-black/35'
                                            }`}
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-display text-base font-bold text-white uppercase">{link.name}</p>
                                                <p className="mt-0.5 truncate font-mono text-[11px] text-on-surface-variant">{link.slug}</p>
                                            </div>
                                            <ChevronRight size={18} className={`shrink-0 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedLink && <MobileLinkEditor key={selectedLink.id} link={selectedLink} detailRef={detailRef} />}
                    </>
                )}
            </section>
        </>
    );
}

function MobileCreateForm() {
    const createForm = useForm({
        name: '',
        destination_url: 'https://',
        notes: '',
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                createForm.post(route('qr-links.store'), {
                    preserveScroll: true,
                    onSuccess: () => createForm.reset('name', 'destination_url', 'notes'),
                });
            }}
            className="space-y-3 rounded-2xl border border-primary/15 bg-black/35 p-4"
        >
            <p className="text-[10px] font-bold tracking-widest text-primary uppercase">Új dinamikus QR</p>
            <label className="block space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Név</span>
                <input
                    value={createForm.data.name}
                    onChange={(event) => createForm.setData('name', event.target.value)}
                    placeholder="Póló 2026"
                    className="cyber-input w-full text-base"
                />
            </label>
            <label className="block space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Cél URL</span>
                <input
                    type="url"
                    value={createForm.data.destination_url}
                    onChange={(event) => createForm.setData('destination_url', event.target.value)}
                    className="cyber-input w-full font-mono text-base"
                />
            </label>
            <button type="submit" disabled={createForm.processing} className="cyber-tool-button w-full py-3 text-sm">
                QR létrehozása
            </button>
        </form>
    );
}

function MobileLinkEditor({
    link,
    detailRef,
}: {
    link: QrLinkItem;
    detailRef: RefObject<HTMLElement | null>;
}) {
    const updateForm = useForm({
        name: link.name,
        destination_url: link.destination_url,
        notes: link.notes ?? '',
        is_active: link.is_active,
    });
    const { styleId, selectStyle, qrDataUrl, styleLabel } = useQrLinkPreview(link.public_url, link.id, 280);
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    async function copyPublicUrl() {
        await navigator.clipboard.writeText(link.public_url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    async function sharePublicUrl() {
        if (typeof navigator.share !== 'function') {
            await copyPublicUrl();

            return;
        }

        try {
            await navigator.share({
                title: link.name,
                text: 'Foray dinamikus QR',
                url: link.public_url,
            });
        } catch {
            // User dismissed share sheet.
        }
    }

    function downloadQr() {
        if (!qrDataUrl) {
            return;
        }

        const extension = qrDataUrl.startsWith('data:image/svg') ? 'svg' : 'png';
        const anchor = document.createElement('a');
        anchor.href = qrDataUrl;
        anchor.download = `qr-${link.slug}-${styleId}.${extension}`;
        anchor.click();
    }

    function deleteLink() {
        if (!window.confirm(`Törlöd a „${link.name}” QR linket?`)) {
            return;
        }

        router.delete(route('qr-links.destroy', link.id), { preserveScroll: true });
    }

    return (
        <article ref={detailRef} className="scroll-mt-24 space-y-4 rounded-2xl border border-primary/20 bg-surface-low/80 p-4">
            <div className="flex flex-col items-center gap-3">
                {qrDataUrl ? (
                    <img src={qrDataUrl} alt="" className="h-56 w-56 rounded-2xl border border-primary/25 bg-black p-2" />
                ) : (
                    <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-primary/25 bg-black/40 text-primary">
                        <QrCode size={48} />
                    </div>
                )}
                <p className="text-center font-mono text-[11px] text-primary">{link.slug}</p>
                <p className="text-center text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                    {link.scan_count} scan {link.last_scanned_at ? `// ${new Date(link.last_scanned_at).toLocaleString()}` : ''} // {styleLabel}
                </p>
            </div>

            <div>
                <p className="mb-1 text-[10px] font-bold tracking-widest text-primary uppercase">Fix QR link</p>
                <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/40 p-3">
                    <p className="min-w-0 flex-1 break-all font-mono text-xs text-on-surface-variant">{link.public_url}</p>
                    <button type="button" onClick={copyPublicUrl} className="shrink-0 rounded-lg border border-primary/25 p-2.5 text-primary">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>

            <QrStylePicker value={styleId} onChange={selectStyle} compact />

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    updateForm.patch(route('qr-links.update', link.id), {
                        preserveScroll: true,
                        onSuccess: () => {
                            setSaved(true);
                            window.setTimeout(() => setSaved(false), 1600);
                        },
                    });
                }}
                className="space-y-3"
            >
                <label className="block space-y-1.5">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Név</span>
                    <input
                        value={updateForm.data.name}
                        onChange={(event) => updateForm.setData('name', event.target.value)}
                        className="cyber-input w-full text-base"
                    />
                </label>
                <label className="block space-y-1.5">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Ma hova mutasson?</span>
                    <input
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        value={updateForm.data.destination_url}
                        onChange={(event) => updateForm.setData('destination_url', event.target.value)}
                        className="cyber-input w-full font-mono text-base"
                    />
                </label>
                <label className="block space-y-1.5">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Jegyzet</span>
                    <input
                        value={updateForm.data.notes}
                        onChange={(event) => updateForm.setData('notes', event.target.value)}
                        className="cyber-input w-full text-base"
                    />
                </label>
                <label className="flex items-center gap-2 py-1">
                    <input
                        type="checkbox"
                        checked={updateForm.data.is_active}
                        onChange={(event) => updateForm.setData('is_active', event.target.checked)}
                        className="size-4 accent-primary"
                    />
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Aktív</span>
                </label>

                <div className="fixed inset-x-0 bottom-0 z-30 border-t border-primary/20 bg-background/95 px-4 py-3 backdrop-blur-md">
                    <div className="mx-auto flex max-w-lg flex-col gap-2">
                        <button
                            type="submit"
                            disabled={updateForm.processing}
                            className="cyber-tool-button inline-flex w-full items-center justify-center gap-2 py-3.5 text-sm"
                        >
                            {saved ? <Check size={16} /> : <Save size={16} />}
                            {saved ? 'Mentve' : 'Mentés'}
                        </button>
                        <div className="grid grid-cols-4 gap-2">
                            <button type="button" onClick={downloadQr} className="cyber-tool-button inline-flex items-center justify-center gap-1 py-2.5 text-[10px]">
                                <Download size={14} />
                                QR
                            </button>
                            <button type="button" onClick={sharePublicUrl} className="cyber-tool-button inline-flex items-center justify-center gap-1 py-2.5 text-[10px]">
                                <Share2 size={14} />
                                Share
                            </button>
                            <a
                                href={link.public_url}
                                target="_blank"
                                rel="noreferrer"
                                className="cyber-tool-button inline-flex items-center justify-center gap-1 py-2.5 text-[10px]"
                            >
                                <ExternalLink size={14} />
                                Teszt
                            </a>
                            <button
                                type="button"
                                onClick={deleteLink}
                                className="cyber-tool-button inline-flex items-center justify-center gap-1 border-red-500/40 py-2.5 text-[10px] text-red-300"
                            >
                                <Trash2 size={14} />
                                Törlés
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </article>
    );
}

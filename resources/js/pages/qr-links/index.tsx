import { generateQrCodeDataUrl } from '@/lib/qr-code';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, Copy, Download, ExternalLink, Link2, Plus, QrCode, Save, Smartphone, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function QrLinksIndex({ links = [], publicBaseUrl }: Props) {
    const createForm = useForm({
        name: '',
        destination_url: 'https://',
        notes: '',
    });

    return (
        <>
            <Head title="Dynamic QR Links" />

            <section className="space-y-6">
                <div className="cyber-grid min-w-0 overflow-hidden rounded-3xl border border-primary/15 bg-surface/80 p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                                <QrCode size={18} className="shrink-0" />
                                DYNAMIC_QR_REGISTRY
                            </div>
                            <p className="max-w-2xl text-sm text-on-surface-variant">
                                Saját dinamikus QR kódjaid — más user nem látja. A nyomtatott QR fix hash URL-re mutat (
                                {publicBaseUrl}/q/…). A célt, nevet és jegyzetet bármikor szerkesztheted.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                            <div className="rounded-xl border border-primary/20 bg-black/40 px-3 py-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                                {links.length} codes
                            </div>
                            <Link
                                href={route('qr-links.mobile')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/25 px-3 py-2 text-[10px] font-bold tracking-widest text-primary uppercase"
                            >
                                <Smartphone size={14} />
                                Mobil nézet
                            </Link>
                        </div>
                    </div>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            createForm.post(route('qr-links.store'), {
                                preserveScroll: true,
                                onSuccess: () => createForm.reset('name', 'destination_url', 'notes'),
                            });
                        }}
                        className="grid gap-3 rounded-2xl border border-primary/15 bg-black/30 p-4 md:grid-cols-2"
                    >
                        <p className="md:col-span-2 text-[10px] font-bold tracking-widest text-primary uppercase">Új dinamikus QR</p>
                        <label className="space-y-1">
                            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">Név</span>
                            <input
                                value={createForm.data.name}
                                onChange={(event) => createForm.setData('name', event.target.value)}
                                placeholder="Póló 2026 / XY Kft."
                                className="cyber-input w-full"
                            />
                        </label>
                        <label className="space-y-1">
                            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">Cél URL (ma)</span>
                            <input
                                type="url"
                                value={createForm.data.destination_url}
                                onChange={(event) => createForm.setData('destination_url', event.target.value)}
                                className="cyber-input w-full font-mono"
                            />
                        </label>
                        <label className="md:col-span-2 space-y-1">
                            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">Jegyzet (opcionális)</span>
                            <input
                                value={createForm.data.notes}
                                onChange={(event) => createForm.setData('notes', event.target.value)}
                                placeholder="Hol van nyomtatva / kinek adtuk"
                                className="cyber-input w-full"
                            />
                        </label>
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" disabled={createForm.processing} className="cyber-tool-button inline-flex items-center gap-2">
                                <Plus size={14} />
                                Create QR Link
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {links.map((link) => (
                        <QrLinkCard key={link.id} link={link} />
                    ))}

                    {links.length === 0 && (
                        <p className="col-span-full text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">
                            Még nincs dinamikus QR — hozz létre egyet fent.
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}

function QrLinkCard({ link }: { link: QrLinkItem }) {
    const updateForm = useForm({
        name: link.name,
        destination_url: link.destination_url,
        notes: link.notes ?? '',
        is_active: link.is_active,
    });
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generateQrCodeDataUrl(link.public_url, { width: 240, margin: 2 })
            .then(setQrDataUrl)
            .catch(() => setQrDataUrl(''));
    }, [link.public_url]);

    async function copyPublicUrl() {
        await navigator.clipboard.writeText(link.public_url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    function downloadQr() {
        if (!qrDataUrl) {
            return;
        }

        const anchor = document.createElement('a');
        anchor.href = qrDataUrl;
        anchor.download = `qr-${link.slug}.png`;
        anchor.click();
    }

    function deleteLink() {
        if (!window.confirm(`Törlöd a „${link.name}” QR linket? A hash URL azonnal érvénytelen lesz.`)) {
            return;
        }

        router.delete(route('qr-links.destroy', link.id), { preserveScroll: true });
    }

    return (
        <article className="rounded-3xl border border-primary/20 bg-surface-low/80 p-5 shadow-[0_0_28px_rgba(204,255,0,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">{link.slug}</p>
                    <p className="mt-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                        {link.scan_count} scans {link.last_scanned_at ? `// last ${new Date(link.last_scanned_at).toLocaleString()}` : ''}
                    </p>
                </div>
                {qrDataUrl ? (
                    <img src={qrDataUrl} alt="" className="h-32 w-32 rounded-xl border border-primary/20 bg-black" />
                ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-primary/20 bg-black/40 text-primary">
                        <QrCode size={28} />
                    </div>
                )}
            </div>

            <div className="mt-4 space-y-3">
                <div>
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-primary uppercase">Fix QR URL (hash)</p>
                    <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-black/35 p-2">
                        <p className="min-w-0 flex-1 break-all font-mono text-[10px] text-on-surface-variant">{link.public_url}</p>
                        <button type="button" onClick={copyPublicUrl} className="shrink-0 rounded-lg border border-primary/25 p-2 text-primary">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        updateForm.patch(route('qr-links.update', link.id), { preserveScroll: true });
                    }}
                    className="space-y-2"
                >
                    <label className="block space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Név</span>
                        <input
                            value={updateForm.data.name}
                            onChange={(event) => updateForm.setData('name', event.target.value)}
                            className="cyber-input w-full"
                        />
                    </label>
                    <label className="block space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Aktuális cél URL</span>
                        <input
                            type="url"
                            value={updateForm.data.destination_url}
                            onChange={(event) => updateForm.setData('destination_url', event.target.value)}
                            className="cyber-input w-full font-mono text-[11px]"
                        />
                    </label>
                    <label className="block space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Jegyzet</span>
                        <input
                            value={updateForm.data.notes}
                            onChange={(event) => updateForm.setData('notes', event.target.value)}
                            className="cyber-input w-full"
                        />
                    </label>
                    <label className="flex items-center gap-2 py-1">
                        <input
                            type="checkbox"
                            checked={updateForm.data.is_active}
                            onChange={(event) => updateForm.setData('is_active', event.target.checked)}
                            className="size-4 accent-primary"
                        />
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Aktív (redirect engedélyezve)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button type="submit" disabled={updateForm.processing} className="cyber-tool-button inline-flex items-center gap-2">
                            <Save size={14} />
                            Mentés
                        </button>
                        <button type="button" onClick={downloadQr} className="cyber-tool-button inline-flex items-center gap-2">
                            <Download size={14} />
                            Download QR
                        </button>
                        <a href={link.public_url} target="_blank" rel="noreferrer" className="cyber-tool-button inline-flex items-center gap-2">
                            <ExternalLink size={14} />
                            Test redirect
                        </a>
                        <a href={link.destination_url} target="_blank" rel="noreferrer" className="cyber-tool-button inline-flex items-center gap-2">
                            <Link2 size={14} />
                            Open target
                        </a>
                        <button
                            type="button"
                            onClick={deleteLink}
                            className="cyber-tool-button inline-flex items-center gap-2 border-red-500/40 text-red-300"
                        >
                            <Trash2 size={14} />
                            Törlés
                        </button>
                    </div>
                </form>
            </div>
        </article>
    );
}

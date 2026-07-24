import { CyberTextOutputSkeleton } from '@/components/cyber/skeleton';
import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { sha256 } from '@/lib/hash';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clipboard, Eraser, Fingerprint, Hash, KeyRound, ShieldCheck, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

type HashMode = 'sha256' | 'bcrypt';

export default function HashGenerator() {
    const page = useDevToolPage('hash-generator');
    const [mode, setMode] = useState<HashMode>('sha256');
    const [input, setInput] = useState(page.sampleInput ?? '');
    const [rounds, setRounds] = useState(12);
    const [hash, setHash] = useState('');
    const [verifyHash, setVerifyHash] = useState('');
    const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    const telemetry = useMemo(
        () => ({
            chars: input.length,
            bytes: new Blob([input]).size,
            mode: mode.toUpperCase(),
        }),
        [input, mode],
    );

    async function generate() {
        setProcessing(true);
        setError('');
        setVerifyResult(null);
        setCopied(false);

        try {
            if (mode === 'sha256') {
                const generated = await sha256(input);
                setHash(generated);
                setVerifyHash(generated);
            } else {
                const response = await postJson(route('dev-tools.hash-generator.bcrypt'), { value: input, rounds });
                setHash(response.hash);
                setVerifyHash(response.hash);
            }
        } catch (exception) {
            setHash('');
            setError(exception instanceof Error ? exception.message : 'Hash generation failed');
        } finally {
            setProcessing(false);
        }
    }

    async function verify() {
        setProcessing(true);
        setError('');
        setVerifyResult(null);

        try {
            if (mode === 'sha256') {
                const generated = await sha256(input);
                setVerifyResult(generated.toLowerCase() === verifyHash.trim().toLowerCase());
            } else {
                const response = await postJson(route('dev-tools.hash-generator.verify'), {
                    value: input,
                    hash: verifyHash,
                });
                setVerifyResult(response.matches);
            }
        } catch (exception) {
            setError(exception instanceof Error ? exception.message : 'Verification failed');
        } finally {
            setProcessing(false);
        }
    }

    async function copyHash() {
        if (!hash) {
            return;
        }

        await navigator.clipboard.writeText(hash);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    function clearBuffers() {
        setInput('');
        setHash('');
        setVerifyHash('');
        setVerifyResult(null);
        setError('');
        setCopied(false);
    }

    return (
        <>
            <Head title={page.pageTitle} />
            <section className="cyber-grid border-primary/15 bg-surface rounded-3xl border p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8">
                <DevToolPageHeader
                    slug="hash-generator"
                    actions={
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                            <button type="button" onClick={generate} className="cyber-tool-button" disabled={processing}>
                                <Hash size={15} />
                                Generate
                            </button>
                            <button type="button" onClick={verify} className="cyber-tool-button" disabled={processing}>
                                <ShieldCheck size={15} /> Verify
                            </button>
                            <button type="button" onClick={copyHash} className="cyber-tool-button">
                                <Clipboard size={15} /> {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button type="button" onClick={clearBuffers} className="cyber-tool-button">
                                <Eraser size={15} /> Clear
                            </button>
                        </div>
                    }
                />

                <div className="mb-6 grid gap-3 md:grid-cols-3">
                    <StatusTile label="Mode" value={telemetry.mode} />
                    <StatusTile label="Chars" value={String(telemetry.chars)} />
                    <StatusTile label="Bytes" value={String(telemetry.bytes)} />
                </div>

                <div className="mb-6 grid gap-2 md:grid-cols-2">
                    <ModeButton active={mode === 'sha256'} icon={<Hash size={15} />} label="SHA-256" onClick={() => setMode('sha256')} />
                    <ModeButton active={mode === 'bcrypt'} icon={<KeyRound size={15} />} label="Laravel bcrypt" onClick={() => setMode('bcrypt')} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/45 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                <KeyRound size={18} />
                                plaintext_input
                            </div>
                            {mode === 'bcrypt' && (
                                <label className="text-on-surface-variant flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                                    rounds
                                    <select
                                        value={rounds}
                                        onChange={(event) => setRounds(Number(event.target.value))}
                                        className="border-primary/15 text-primary rounded-lg border bg-black px-2 py-1 outline-none"
                                    >
                                        {[10, 11, 12, 13, 14].map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>
                        <textarea
                            value={input}
                            onChange={(event) => {
                                setInput(event.target.value);
                                setVerifyResult(null);
                                setError('');
                            }}
                            spellCheck={false}
                            className="border-primary/10 text-on-surface-variant focus:border-primary/50 min-h-[260px] w-full resize-y rounded-2xl border bg-black/50 p-4 text-xs leading-6 transition-all outline-none focus:shadow-[0_0_18px_rgba(204,255,0,0.12)]"
                            placeholder="paste plaintext / password / token source..."
                        />

                        <div className="mt-5">
                            <div className="text-primary mb-2 text-[10px] font-bold tracking-widest uppercase">verify_against_hash</div>
                            <textarea
                                value={verifyHash}
                                onChange={(event) => {
                                    setVerifyHash(event.target.value);
                                    setVerifyResult(null);
                                }}
                                spellCheck={false}
                                className="border-primary/10 text-on-surface-variant focus:border-primary/50 min-h-28 w-full resize-y rounded-2xl border bg-black/50 p-4 text-xs leading-6 transition-all outline-none focus:shadow-[0_0_18px_rgba(204,255,0,0.12)]"
                                placeholder="paste hash here to verify"
                            />
                        </div>
                    </div>

                    <div className="border-primary/20 rounded-2xl border bg-black/60 p-5 font-mono">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div className="text-primary flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
                                <Fingerprint size={18} />
                                hash_output
                            </div>
                            <div className={statusClass(error, verifyResult, processing)}>
                                {error ? <XCircle size={14} /> : verifyResult === true ? <CheckCircle2 size={14} /> : <ShieldCheck size={14} />}
                                {error
                                    ? 'hash_error'
                                    : processing
                                      ? 'processing'
                                      : verifyResult === null
                                        ? 'ready'
                                        : verifyResult
                                          ? 'match'
                                          : 'no_match'}
                            </div>
                        </div>

                        {error ? (
                            <div className="min-h-[430px] rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-6 text-red-200">
                                {error}
                            </div>
                        ) : processing ? (
                            <CyberTextOutputSkeleton label="hash_pipeline" />
                        ) : (
                            <pre className="border-primary/10 text-primary min-h-[430px] overflow-auto rounded-2xl border bg-black/50 p-4 text-xs leading-6">
                                {hash || '// generate SHA-256 or Laravel bcrypt output'}
                            </pre>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

function ModeButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-[10px] font-bold tracking-widest uppercase transition-all ${
                active
                    ? 'border-primary bg-primary text-black shadow-[0_0_18px_rgba(204,255,0,0.28)]'
                    : 'border-primary/15 text-on-surface-variant hover:border-primary/45 hover:text-primary bg-black/35'
            }`}
        >
            {icon}
            {label}
        </button>
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

function statusClass(error: string, verifyResult: boolean | null, processing = false) {
    const color = error ? 'text-red-300' : processing ? 'text-on-surface-variant' : verifyResult === false ? 'text-red-300' : 'text-primary';

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

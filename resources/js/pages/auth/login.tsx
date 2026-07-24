import { CyberLoadingZone } from '@/components/cyber/skeleton';
import InputError from '@/components/input-error';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { FormEventHandler, type ReactNode } from 'react';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />
            <section className="cyber-grid mx-auto max-w-4xl rounded-3xl border border-primary/15 bg-surface p-8 shadow-[0_0_22px_rgba(204,255,0,0.08)]">
                <div className="mb-8 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                    <LogIn size={18} />
                    ACCESS_GATE
                </div>
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            Establish <span className="glow-text text-primary">Link</span>
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                            Authenticate into the neural dev shell. The interface stays inside the same terminal-grade dashboard frame.
                        </p>
                    </div>

                    <form className="rounded-2xl border border-primary/15 bg-black/50 p-6" onSubmit={submit}>
                        <CyberLoadingZone loading={processing} label="auth_handshake" fields={2}>
                            <div className="grid gap-5">
                            <CyberField label="Email_Address" error={errors.email}>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="cyber-input"
                                    placeholder="operator@foray.dev"
                                />
                            </CyberField>

                            <CyberField label="Password" error={errors.password}>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="cyber-input"
                                    placeholder="access token"
                                />
                            </CyberField>

                            <div className="flex items-center justify-between gap-4 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 accent-primary"
                                    />
                                    remember_node
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-primary hover:underline">
                                        reset_key
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="font-display mt-2 flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-black uppercase transition-all hover:shadow-[0_0_18px_rgba(204,255,0,0.45)] disabled:opacity-60"
                            >
                                Login_Core
                            </button>

                            <div className="text-center text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                no identity?{' '}
                                <Link href={route('register')} className="text-primary hover:underline">
                                    register_node
                                </Link>
                            </div>
                            </div>
                        </CyberLoadingZone>
                    </form>
                </div>

                {status && <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center text-xs text-primary">{status}</div>}
            </section>
        </>
    );
}

function CyberField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <label className="grid gap-2 text-[10px] font-bold tracking-widest text-primary uppercase">
            {label}
            {children}
            <InputError message={error} />
        </label>
    );
}

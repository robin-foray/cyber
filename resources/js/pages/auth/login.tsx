import AppLogoIcon from '@/components/app-logo-icon';
import GlitchText from '@/components/cyber/glitch-text';
import LetterGlitchBackground from '@/components/cyber/letter-glitch-background';
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
            <div className="bg-background text-foreground relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
                <LetterGlitchBackground />
                <div className="relative z-10 w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="border-primary/40 bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border shadow-[0_0_22px_rgba(204,255,0,0.25)]">
                            <AppLogoIcon className="text-primary size-7" />
                        </div>
                        <GlitchText className="font-display text-4xl font-bold tracking-[0.08em] text-white uppercase sm:text-5xl" intensity="soft">
                            foray
                        </GlitchText>
                        <p className="text-primary mt-3 text-[10px] font-bold tracking-[0.35em] uppercase">ACCESS_GATE // PRIVATE_NODE</p>
                    </div>

                    <section className="cyber-grid border-primary/15 bg-surface/95 min-w-0 overflow-hidden rounded-3xl border p-5 shadow-[0_0_28px_rgba(204,255,0,0.1)] backdrop-blur-sm sm:p-7">
                        <div className="text-primary mb-6 flex items-center gap-3 text-sm font-bold tracking-widest">
                            <LogIn size={18} />
                            ESTABLISH_LINK
                        </div>

                        <p className="text-on-surface-variant mb-6 text-sm leading-6">
                            Operator credentials required. The neural shell stays locked until authentication succeeds.
                        </p>

                        <form onSubmit={submit}>
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

                                    <div className="text-on-surface-variant flex items-center justify-between gap-4 text-[10px] font-bold tracking-widest uppercase">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="accent-primary h-4 w-4"
                                            />
                                            remember_node
                                        </label>
                                        {canResetPassword && (
                                            <Link href="/forgot-password" className="text-primary hover:underline">
                                                reset_key
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="font-display bg-primary mt-1 flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3 text-sm font-bold text-black uppercase transition-all hover:shadow-[0_0_18px_rgba(204,255,0,0.45)] disabled:opacity-60"
                                    >
                                        Login_Core
                                    </button>
                                </div>
                            </CyberLoadingZone>
                        </form>

                        {status && (
                            <div className="border-primary/20 bg-primary/5 text-primary mt-5 rounded-xl border p-3 text-center text-xs">{status}</div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

function CyberField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <label className="text-primary grid gap-2 text-[10px] font-bold tracking-widest uppercase">
            {label}
            {children}
            <InputError message={error} />
        </label>
    );
}

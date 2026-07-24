import { cyberLayout } from '@/layouts/cyber-layout';
import InputError from '@/components/input-error';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
import { FormEventHandler, type ReactNode } from 'react';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
        <Head title="Register" />
            <section className="cyber-grid mx-auto max-w-4xl rounded-3xl border border-primary/15 bg-surface p-8 shadow-[0_0_22px_rgba(204,255,0,0.08)]">
                <div className="mb-8 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                    <UserPlus size={18} />
                    NODE_REGISTRATION
                </div>
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <h1 className="font-display text-4xl font-bold text-white uppercase">
                            Create <span className="glow-text text-primary">Node</span>
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                            Register a new operator identity inside the same cyber dashboard frame, without leaving the terminal environment.
                        </p>
                    </div>

                    <form className="rounded-2xl border border-primary/15 bg-black/50 p-6" onSubmit={submit}>
                        <div className="grid gap-5">
                            <CyberField label="Operator_Name" error={errors.name}>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    className="cyber-input"
                                    placeholder="foray operator"
                                />
                            </CyberField>

                            <CyberField label="Email_Address" error={errors.email}>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    className="cyber-input"
                                    placeholder="operator@foray.dev"
                                />
                            </CyberField>

                            <CyberField label="Password" error={errors.password}>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    className="cyber-input"
                                    placeholder="access token"
                                />
                            </CyberField>

                            <CyberField label="Confirm_Password" error={errors.password_confirmation}>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    className="cyber-input"
                                    placeholder="repeat token"
                                />
                            </CyberField>

                            <button
                                type="submit"
                                disabled={processing}
                                className="font-display mt-2 flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-black uppercase transition-all hover:shadow-[0_0_18px_rgba(204,255,0,0.45)] disabled:opacity-60"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Register_Core
                            </button>

                            <div className="text-center text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                identity exists?{' '}
                                <Link href={route('login')} className="text-primary hover:underline">
                                    login_node
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
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

Register.layout = cyberLayout;

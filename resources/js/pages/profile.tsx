import { cyberLayout } from '@/layouts/cyber-layout';
import InputError from '@/components/input-error';
import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, ShieldCheck, UserCog } from 'lucide-react';
import { FormEventHandler, type ReactNode } from 'react';

type ProfileForm = {
    name: string;
    title: string;
    avatar_seed: string;
    bio: string;
};

export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<ProfileForm>({
        name: user?.name ?? '',
        title: user?.title ?? '',
        avatar_seed: user?.avatar_seed ?? user?.name ?? '',
        bio: user?.bio ?? '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <>
        <Head title="Profile" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-8 shadow-[0_0_22px_rgba(204,255,0,0.08)]">
                <div className="mb-8 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                    <UserCog size={18} />
                    NODE_PROFILE
                </div>

                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <aside className="rounded-2xl border border-primary/15 bg-black/50 p-6">
                        <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-primary/25 bg-primary/10 shadow-[0_0_24px_rgba(204,255,0,0.16)]">
                            {user?.avatar_url && <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="mt-6 text-center">
                            <h1 className="font-display text-3xl font-bold text-white uppercase">{user?.name}</h1>
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                                <ShieldCheck size={12} />
                                {user?.is_admin ? 'admin_node' : 'member_node'}
                            </div>
                            <p className="mt-5 text-sm leading-7 text-on-surface-variant">{user?.bio || 'No bio signal configured yet.'}</p>
                        </div>
                    </aside>

                    <form className="rounded-2xl border border-primary/15 bg-black/50 p-6" onSubmit={submit}>
                        <div className="grid gap-5">
                            <CyberField label="Node_Name" error={errors.name}>
                                <input value={data.name} onChange={(e) => setData('name', e.target.value)} className="cyber-input" />
                            </CyberField>
                            <CyberField label="Operator_Title" error={errors.title}>
                                <input value={data.title} onChange={(e) => setData('title', e.target.value)} className="cyber-input" placeholder="Root Operator" />
                            </CyberField>
                            <CyberField label="Avatar_Seed" error={errors.avatar_seed}>
                                <input
                                    value={data.avatar_seed}
                                    onChange={(e) => setData('avatar_seed', e.target.value)}
                                    className="cyber-input"
                                    placeholder="unique avatar signal"
                                />
                            </CyberField>
                            <CyberField label="Bio_Signal" error={errors.bio}>
                                <textarea
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    className="cyber-input min-h-32 resize-y"
                                    placeholder="Describe this operator node..."
                                />
                            </CyberField>

                            <button
                                type="submit"
                                disabled={processing}
                                className="font-display mt-2 flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-black uppercase transition-all hover:shadow-[0_0_18px_rgba(204,255,0,0.45)] disabled:opacity-60"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Save_Identity
                            </button>

                            {recentlySuccessful && (
                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center text-[10px] font-bold tracking-widest text-primary uppercase">
                                    identity updated
                                </div>
                            )}
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

Profile.layout = cyberLayout;

import { CyberLoadingZone } from '@/components/cyber/skeleton';
import InputError from '@/components/input-error';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Camera, Dices, ImageOff, LogOut, ShieldCheck, UserCog } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type ProfileForm = {
    name: string;
    title: string;
    avatar_seed: string;
    bio: string;
    avatar: File | null;
    remove_avatar: boolean;
};

export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful, transform } = useForm<ProfileForm>({
        name: user?.name ?? '',
        title: user?.title ?? '',
        avatar_seed: user?.avatar_seed ?? user?.name ?? '',
        bio: user?.bio ?? '',
        avatar: null,
        remove_avatar: false,
    });

    transform((form) => {
        const payload: Record<string, unknown> = {
            name: form.name,
            title: form.title,
            avatar_seed: form.avatar_seed,
            bio: form.bio,
            remove_avatar: form.remove_avatar ? 1 : 0,
            _method: 'patch',
        };

        // Only send the file when present — empty avatar fields break image validation.
        if (form.avatar) {
            payload.avatar = form.avatar;
        }

        return payload as typeof form;
    });

    useEffect(() => {
        if (!data.avatar) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.avatar);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.avatar]);

    const displayAvatarUrl = useMemo(() => {
        if (previewUrl) {
            return previewUrl;
        }

        if (data.remove_avatar || !user?.has_custom_avatar) {
            return buildIdenticonUrl(data.avatar_seed || data.name || user?.email || 'foray');
        }

        return user?.avatar_url ?? buildIdenticonUrl(data.avatar_seed || data.name || 'foray');
    }, [previewUrl, data.remove_avatar, data.avatar_seed, data.name, user]);

    const showingCustomUpload = Boolean(previewUrl) || (Boolean(user?.has_custom_avatar) && !data.remove_avatar);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        // POST + _method=patch so multipart file uploads reach PHP reliably.
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData('avatar', null);
                setData('remove_avatar', false);
            },
        });
    };

    function pickAvatar() {
        fileInputRef.current?.click();
    }

    function onAvatarSelected(file: File | null) {
        if (!file) {
            return;
        }

        setData('avatar', file);
        setData('remove_avatar', false);
    }

    function clearCustomAvatar() {
        setData('avatar', null);
        setData('remove_avatar', true);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function reseedAvatar() {
        const seed = `node-${Math.random().toString(36).slice(2, 10)}`;
        setData('avatar_seed', seed);
        setData('avatar', null);
        setData('remove_avatar', Boolean(user?.has_custom_avatar));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <>
            <Head title="Profile" />
            <section className="cyber-grid border-primary/15 bg-surface min-w-0 overflow-hidden rounded-3xl border p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                <div className="text-primary mb-8 flex items-center gap-3 text-sm font-bold tracking-widest">
                    <UserCog size={18} />
                    NODE_PROFILE
                </div>

                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <aside className="border-primary/15 rounded-2xl border bg-black/50 p-6">
                        <button
                            type="button"
                            onClick={pickAvatar}
                            className="border-primary/25 bg-primary/10 group relative mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border shadow-[0_0_24px_rgba(204,255,0,0.16)] transition-all hover:border-primary/60 hover:shadow-[0_0_28px_rgba(204,255,0,0.28)]"
                            aria-label="Change profile picture"
                            title="Change profile picture"
                        >
                            <img src={displayAvatarUrl} alt={user?.name ?? 'avatar'} className="h-full w-full object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                <Camera size={22} className="text-primary" />
                            </span>
                        </button>

                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <button
                                type="button"
                                onClick={pickAvatar}
                                className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-all hover:border-primary/50 hover:bg-primary hover:text-black"
                            >
                                <Camera size={12} />
                                Upload
                            </button>
                            <button
                                type="button"
                                onClick={reseedAvatar}
                                className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-all hover:border-primary/50 hover:bg-primary hover:text-black"
                            >
                                <Dices size={12} />
                                Reseed
                            </button>
                            {showingCustomUpload && (
                                <button
                                    type="button"
                                    onClick={clearCustomAvatar}
                                    className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-all hover:border-primary/50 hover:bg-primary hover:text-black"
                                >
                                    <ImageOff size={12} />
                                    Clear
                                </button>
                            )}
                        </div>

                        <p className="text-on-surface-variant mt-3 text-center text-[10px] tracking-widest uppercase">
                            {showingCustomUpload ? 'custom_signal' : 'identicon_seed'}
                        </p>

                        <div className="mt-6 text-center">
                            <h1 className="font-display text-3xl font-bold text-white uppercase">{user?.name}</h1>
                            <div className="border-primary/20 bg-primary/5 text-primary mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                                <ShieldCheck size={12} />
                                {user?.is_admin ? 'admin_node' : 'member_node'}
                            </div>
                            <p className="text-on-surface-variant mt-5 text-sm leading-7">{user?.bio || 'No bio signal configured yet.'}</p>
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="border-primary/20 bg-primary/5 text-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[11px] font-bold tracking-widest uppercase transition-all hover:border-primary/50 hover:bg-primary hover:text-black hover:shadow-[0_0_14px_rgba(204,255,0,0.45)]"
                        >
                            <LogOut size={14} />
                            Disconnect_Session
                        </Link>
                    </aside>

                    <form className="border-primary/15 rounded-2xl border bg-black/50 p-6" onSubmit={submit}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => onAvatarSelected(event.target.files?.[0] ?? null)}
                        />

                        <CyberLoadingZone loading={processing} label="identity_sync" fields={4}>
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
                                        disabled={showingCustomUpload}
                                    />
                                </CyberField>
                                <InputError message={errors.avatar} />
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
                                    className="font-display bg-primary mt-2 flex items-center justify-center gap-3 rounded-xl px-6 py-3 text-sm font-bold text-black uppercase transition-all hover:shadow-[0_0_18px_rgba(204,255,0,0.45)] disabled:opacity-60"
                                >
                                    Save_Identity
                                </button>

                                {recentlySuccessful && (
                                    <div className="border-primary/20 bg-primary/5 text-primary rounded-xl border p-3 text-center text-[10px] font-bold tracking-widest uppercase">
                                        identity updated
                                    </div>
                                )}
                            </div>
                        </CyberLoadingZone>
                    </form>
                </div>
            </section>
        </>
    );
}

function buildIdenticonUrl(seed: string) {
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ccff00,111111&radius=18`;
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

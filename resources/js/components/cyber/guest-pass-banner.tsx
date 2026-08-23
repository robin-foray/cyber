import { type GuestPassIdentity } from '@/types';
import { Clock3 } from 'lucide-react';

type GuestPassBannerProps = {
    guestPass: GuestPassIdentity;
};

export default function GuestPassBanner({ guestPass }: GuestPassBannerProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 shadow-[0_0_18px_rgba(204,255,0,0.08)]">
            <div className="flex min-w-0 items-center gap-3">
                <img
                    src={guestPass.avatar_url}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-xl border border-primary/30 object-cover"
                />
                <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold uppercase tracking-wide text-primary">
                        {guestPass.display_name}
                    </p>
                    <p className="truncate text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                        {guestPass.title || 'Guest Pass'} // {guestPass.label}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                <Clock3 size={14} />
                <span>Expires {guestPass.expires_label}</span>
            </div>
        </div>
    );
}

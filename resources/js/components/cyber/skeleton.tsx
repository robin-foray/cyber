import { cn } from '@/lib/utils';
import { type HTMLAttributes, type ReactNode } from 'react';

type CyberSkeletonProps = HTMLAttributes<HTMLDivElement>;

export function CyberSkeleton({ className, ...props }: CyberSkeletonProps) {
    return <div aria-hidden="true" className={cn('cyber-skeleton rounded-md', className)} {...props} />;
}

export function CyberStatusTileSkeleton() {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
            <CyberSkeleton className="h-2 w-16" />
            <CyberSkeleton className="mt-3 h-6 w-24" />
        </div>
    );
}

export function CyberStatusTilesSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: count }, (_, index) => (
                <CyberStatusTileSkeleton key={index} />
            ))}
        </div>
    );
}

const textLineWidths = ['92%', '78%', '86%', '64%', '88%', '72%', '80%', '58%'];

type CyberSkeletonLinesProps = {
    lines?: number;
    className?: string;
};

export function CyberSkeletonLines({ lines = 6, className }: CyberSkeletonLinesProps) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: lines }, (_, index) => (
                <CyberSkeleton key={index} className="h-3" style={{ width: textLineWidths[index % textLineWidths.length] }} />
            ))}
        </div>
    );
}

export function CyberTextOutputSkeleton({
    lines = 8,
    minHeight = 430,
    label = 'syncing_buffer',
}: {
    lines?: number;
    minHeight?: number;
    label?: string;
}) {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className="rounded-2xl border border-primary/10 bg-black/50 p-4"
            style={{ minHeight }}
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="cyber-skeleton-label font-mono">// {label}</div>
                <CyberSkeleton className="h-3 w-16" />
            </div>
            <CyberSkeletonLines lines={lines} />
        </div>
    );
}

export function CyberImagePreviewSkeleton({
    size,
    minHeight = 430,
    label = 'rendering_frame',
}: {
    size?: number;
    minHeight?: number;
    label?: string;
}) {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className="flex flex-col items-center justify-center rounded-2xl border border-primary/10 bg-black/50 p-6"
            style={{ minHeight }}
        >
            <div className="cyber-skeleton-label mb-4 font-mono">// {label}</div>
            <CyberSkeleton className="rounded-xl" style={{ width: size ?? 192, height: size ?? 192 }} />
            <div className="mt-5 flex w-full max-w-xs flex-col gap-2">
                <CyberSkeleton className="h-2.5 w-full" />
                <CyberSkeleton className="h-2.5 w-2/3" />
            </div>
        </div>
    );
}

export function CyberPreviewPanelSkeleton({ minHeight = 420, label = 'processing_frame' }: { minHeight?: number; label?: string }) {
    return (
        <div className="rounded-2xl border border-primary/15 bg-black/45 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
                <CyberSkeleton className="h-3 w-28" />
                <div className="cyber-skeleton-label font-mono">// {label}</div>
            </div>
            <CyberImagePreviewSkeleton minHeight={minHeight} label={label} />
        </div>
    );
}

export function CyberSkeletonForm({ fields = 4, className, label = 'transmitting_signal' }: { fields?: number; className?: string; label?: string }) {
    return (
        <div aria-busy="true" aria-live="polite" className={cn('space-y-5', className)}>
            <div className="cyber-skeleton-label font-mono">// {label}</div>
            {Array.from({ length: fields }, (_, index) => (
                <div key={index} className="space-y-2">
                    <CyberSkeleton className="h-2.5 w-24" />
                    <CyberSkeleton className="h-11 w-full rounded-xl" />
                </div>
            ))}
            <CyberSkeleton className="mt-2 h-11 w-full rounded-xl" />
        </div>
    );
}

type CyberLoadingZoneProps = {
    loading: boolean;
    children: ReactNode;
    skeleton?: ReactNode;
    className?: string;
    label?: string;
    fields?: number;
};

export function CyberLoadingZone({ loading, children, skeleton, className, label, fields }: CyberLoadingZoneProps) {
    if (loading) {
        return <div className={cn('cyber-skeleton-zone', className)}>{skeleton ?? <CyberSkeletonForm label={label} fields={fields} />}</div>;
    }

    return <>{children}</>;
}

export function CyberPageSkeleton() {
    return (
        <section
            aria-busy="true"
            aria-label="Loading page"
            className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] md:p-8"
        >
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                    <CyberSkeleton className="h-4 w-52" />
                    <CyberSkeleton className="h-10 w-72 max-w-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex">
                    {Array.from({ length: 4 }, (_, index) => (
                        <CyberSkeleton key={index} className="h-10 w-28 rounded-xl" />
                    ))}
                </div>
            </div>

            <CyberStatusTilesSkeleton count={3} />

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <CyberSkeleton className="min-h-[430px] rounded-2xl" />
                <CyberSkeleton className="min-h-[430px] rounded-2xl" />
            </div>
        </section>
    );
}

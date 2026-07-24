import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Deployments() {
    const { cms } = usePage<SharedData>().props;
    const page = useDevToolPage('deployments');

    return (
        <>
            <Head title={page.pageTitle} />
            <section className="cyber-grid border-primary/15 bg-surface min-w-0 overflow-hidden rounded-3xl border p-4 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-6 md:p-8">
                <DevToolPageHeader slug="deployments" />
                <div className="grid min-w-0 gap-3">
                    {cms.deploymentSteps.map((item, index) => (
                        <div key={item} className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/5 bg-black/45 p-4">
                            <span className="border-primary/20 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[10px]">
                                0{index + 1}
                            </span>
                            <span className="text-on-surface-variant min-w-0 text-[11px] font-bold tracking-widest break-words uppercase">{item}</span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

import CyberShell from '@/components/cyber-shell';
import { DevToolPageHeader, useDevToolPage } from '@/components/dev-tool-page-header';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Deployments() {
    const { cms } = usePage<SharedData>().props;
    const page = useDevToolPage('deployments');

    return (
        <CyberShell>
            <Head title={page.pageTitle} />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-8 shadow-[0_0_22px_rgba(204,255,0,0.08)]">
                <DevToolPageHeader slug="deployments" />
                <div className="grid gap-3">
                    {cms.deploymentSteps.map((item, index) => (
                        <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-black/45 p-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 text-[10px] text-primary">
                                0{index + 1}
                            </span>
                            <span className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">{item}</span>
                        </div>
                    ))}
                </div>
            </section>
        </CyberShell>
    );
}

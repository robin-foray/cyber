import CyberShell from '@/components/cyber-shell';
import { Head, usePage } from '@inertiajs/react';
import { Rocket } from 'lucide-react';
import { type SharedData } from '@/types';

export default function Deployments() {
    const { cms } = usePage<SharedData>().props;

    return (
        <CyberShell>
            <Head title="Deployments" />
            <section className="cyber-grid rounded-3xl border border-primary/15 bg-surface p-8 shadow-[0_0_22px_rgba(204,255,0,0.08)]">
                <div className="mb-8 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                    <Rocket size={18} />
                    DEPLOYMENT_PROTOCOL
                </div>
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

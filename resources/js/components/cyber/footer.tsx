import { Command } from 'lucide-react';

export default function CyberFooter() {
    return (
        <footer className="mt-auto flex min-h-14 items-center gap-4 border-t border-white/5 px-4 py-3 text-[10px] font-bold opacity-50 sm:gap-6 sm:px-8">
            <div className="flex shrink-0 items-center gap-4 tracking-widest uppercase">
                <Command size={16} /> (c)2026 DEV_HUB_CORE.
            </div>
            <div className="relative hidden flex-1 overflow-hidden border-l border-primary/10 py-1 pl-6 md:block">
                <div className="dev-ticker flex w-max items-center gap-8 tracking-widest text-on-surface-variant uppercase">
                    <span>node_identity synced</span>
                    <span className="text-primary">profile_channel online</span>
                    <span>admin_gate armed</span>
                    <span className="text-primary">register_core ready</span>
                    <span>node_identity synced</span>
                    <span className="text-primary">profile_channel online</span>
                    <span>admin_gate armed</span>
                    <span className="text-primary">register_core ready</span>
                </div>
            </div>
        </footer>
    );
}

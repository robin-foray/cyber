import {
    Braces,
    Code2,
    Command,
    Construction,
    Cpu,
    Database,
    FileText,
    Github,
    Instagram,
    Layers,
    Package,
    Server,
    Share2,
    ShieldCheck,
    Terminal,
    Twitter,
    Zap,
    type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    Terminal,
    Construction,
    Share2,
    FileText,
    Command,
    Server,
    Code2,
    Layers,
    Zap,
    Braces,
    Database,
    Package,
    ShieldCheck,
    Cpu,
    Github,
    Twitter,
    Instagram,
};

export function resolveCmsIcon(name?: string | null, fallback: LucideIcon = Terminal): LucideIcon {
    if (!name) {
        return fallback;
    }

    return iconMap[name] ?? fallback;
}

export const stackIconMap = iconMap;

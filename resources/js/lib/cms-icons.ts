import {
    Binary,
    Braces,
    CalendarClock,
    Code2,
    Command,
    Construction,
    Cpu,
    Database,
    FileCode2,
    FileJson2,
    FileText,
    Fingerprint,
    Github,
    Globe,
    ImageDown,
    Instagram,
    Layers,
    Package,
    Palette,
    QrCode,
    Regex,
    Rocket,
    Server,
    Share2,
    ShieldCheck,
    Sparkles,
    Table2,
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
    Binary,
    Database,
    Package,
    ShieldCheck,
    Cpu,
    Github,
    Globe,
    Twitter,
    Instagram,
    FileJson2,
    Fingerprint,
    QrCode,
    CalendarClock,
    ImageDown,
    Rocket,
    Sparkles,
    Palette,
    Regex,
    Table2,
    FileCode2,
};

export function resolveCmsIcon(name?: string | null, fallback: LucideIcon = Terminal): LucideIcon {
    if (!name) {
        return fallback;
    }

    return iconMap[name] ?? fallback;
}

export const stackIconMap = iconMap;

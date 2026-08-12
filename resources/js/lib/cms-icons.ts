import { Facebook, Github, Instagram, Twitter } from '@/lib/brand-icons';
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
    Globe,
    ImageDown,
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
    Zap,
    type LucideIcon,
} from 'lucide-react';

type CmsIcon = LucideIcon | typeof Github;

const iconMap: Record<string, CmsIcon> = {
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
    Facebook,
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

export function resolveCmsIcon(name?: string | null, fallback: CmsIcon = Terminal): CmsIcon {
    if (!name) {
        return fallback;
    }

    return iconMap[name] ?? fallback;
}

export const stackIconMap = iconMap;

import { Cpu } from 'lucide-react';

export function stackIconSrc(icon: string): string | null {
    if (!icon) {
        return null;
    }

    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/')) {
        return icon;
    }

    if (icon.includes('/') || /\.(svg|png|webp|jpe?g)$/i.test(icon)) {
        return `/${icon.replace(/^\/+/, '')}`;
    }

    return null;
}

export function StackIcon({ icon, className = 'h-6 w-6' }: { icon: string; className?: string }) {
    const src = stackIconSrc(icon);

    if (src) {
        return <img src={src} alt="" className={`${className} object-contain`} loading="lazy" />;
    }

    return <Cpu size={22} />;
}

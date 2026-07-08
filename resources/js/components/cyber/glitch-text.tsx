import { type CSSProperties } from 'react';

type GlitchTextProps = {
    children: string;
    className?: string;
    intensity?: 'soft' | 'normal';
};

export default function GlitchText({ children, className = '', intensity = 'soft' }: GlitchTextProps) {
    const style = {
        '--glitch-shift': intensity === 'soft' ? '1px' : '2px',
        '--glitch-alpha': intensity === 'soft' ? '0.54' : '0.76',
    } as CSSProperties;

    return (
        <span className={`glitch-text ${className}`} data-text={children} style={style} aria-label={children}>
            <span aria-hidden="true">{children}</span>
        </span>
    );
}

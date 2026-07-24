import { getDevTickerAnimationDelay } from '@/lib/dev-ticker';
import { type ReactNode, useMemo } from 'react';

type DevTickerProps = {
    children: ReactNode;
    className?: string;
};

export default function DevTicker({ children, className = '' }: DevTickerProps) {
    const animationDelay = useMemo(() => getDevTickerAnimationDelay(), []);

    return (
        <div className={`dev-ticker flex w-max items-center gap-8 ${className}`.trim()} style={{ animationDelay }}>
            {children}
        </div>
    );
}

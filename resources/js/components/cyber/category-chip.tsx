import { type ReactNode } from 'react';

type CategoryChipProps = {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
    className?: string;
};

export default function CategoryChip({ active, onClick, children, className = '' }: CategoryChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`max-w-full truncate rounded-xl border px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition ${
                active
                    ? 'border-primary bg-primary text-black shadow-[0_0_14px_rgba(204,255,0,0.25)]'
                    : 'border-primary/20 bg-black/40 text-primary hover:border-primary/45 hover:bg-primary/8'
            } ${className}`}
        >
            {children}
        </button>
    );
}

import SpecularButton from '@/components/cyber/specular-button';
import { X } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';

export type MachineLightboxItem = {
    name: string;
    img: string;
    description: string | null;
    category: string | null;
    url: string | null;
};

type MachineLightboxProps = {
    machine: MachineLightboxItem;
    onClose: () => void;
};

const SWIPE_CLOSE_PX = 90;

export default function MachineLightbox({ machine, onClose }: MachineLightboxProps) {
    const [dragY, setDragY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startY = useRef<number | null>(null);
    const dragYRef = useRef(0);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onClose]);

    function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'mouse') {
            return;
        }

        startY.current = event.clientY;
        dragYRef.current = 0;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        if (startY.current === null) {
            return;
        }

        const delta = Math.max(0, event.clientY - startY.current);
        dragYRef.current = delta;
        setDragY(delta);
    }

    function onPointerUp() {
        if (startY.current === null) {
            return;
        }

        if (dragYRef.current >= SWIPE_CLOSE_PX) {
            onClose();
        }

        startY.current = null;
        dragYRef.current = 0;
        setDragging(false);
        setDragY(0);
    }

    const sheetStyle = {
        transform: dragY ? `translateY(${dragY}px)` : undefined,
        transition: dragging ? 'none' : 'transform 180ms ease-out',
        opacity: dragY ? Math.max(0.45, 1 - dragY / 280) : 1,
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[90] flex flex-col bg-black/92 backdrop-blur-md md:items-center md:justify-center md:bg-black/75 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={machine.name}
            onClick={onClose}
        >
            <div
                className="flex h-dvh w-full flex-col md:h-auto md:max-h-[min(92dvh,900px)] md:max-w-3xl md:overflow-hidden md:rounded-3xl md:border md:border-primary/25 md:bg-surface md:shadow-[0_0_40px_rgba(204,255,0,0.15)]"
                style={sheetStyle}
                onClick={(event) => event.stopPropagation()}
            >
                <div
                    className="relative flex shrink-0 items-center justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 md:hidden"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    <div className="h-1 w-10 rounded-full bg-white/25" aria-hidden />
                    <button
                        type="button"
                        aria-label="Close"
                        className="absolute right-3 top-[max(0.55rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition active:scale-95 hover:border-primary/40 hover:text-primary"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div
                    className="relative flex min-h-0 flex-1 items-center justify-center px-2 touch-pan-y md:aspect-[16/10] md:max-h-[min(58dvh,520px)] md:flex-none md:bg-black/80 md:px-0 md:touch-auto"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    <img
                        src={machine.img}
                        alt={machine.name}
                        className="max-h-full max-w-full object-contain select-none md:h-full md:w-full md:object-cover"
                        draggable={false}
                    />
                    <button
                        type="button"
                        aria-label="Close"
                        className="absolute right-3 top-3 hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition hover:border-primary/40 hover:text-primary md:flex"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="max-h-[42dvh] shrink-0 space-y-3 overflow-y-auto border-t border-primary/15 bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 md:max-h-none md:overflow-visible md:border-t-0 md:p-6">
                    {machine.category && (
                        <p className="text-[10px] font-bold tracking-widest text-primary uppercase">{machine.category}</p>
                    )}
                    <h2 className="font-display text-xl font-bold tracking-wide sm:text-2xl">{machine.name}</h2>
                    {machine.description && <p className="text-sm leading-relaxed text-on-surface-variant">{machine.description}</p>}
                    <div className="flex w-full flex-wrap gap-2 pt-1">
                        <div className="min-w-[8rem] flex-1">
                            <SpecularButton type="button" size="sm" active onClick={onClose} labelClassName="justify-center">
                                CLOSE
                            </SpecularButton>
                        </div>
                        {machine.url && (
                            <div className="min-w-[8rem] flex-1">
                                <SpecularButton
                                    as="a"
                                    href={machine.url}
                                    size="sm"
                                    labelClassName="justify-center"
                                    onClick={() => window.open(machine.url!, '_blank', 'noopener')}
                                >
                                    OPEN_LINK
                                </SpecularButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}

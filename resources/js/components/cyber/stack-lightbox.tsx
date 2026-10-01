import SpecularButton from '@/components/cyber/specular-button';
import { StackIcon } from '@/lib/stack-icon';
import { ExternalLink, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';

export type StackLightboxItem = {
    name: string;
    signal: string | null;
    summary: string | null;
    bullets: string[];
    icon: string;
    level: number;
    category: string | null;
    docs_url: string | null;
};

type StackLightboxProps = {
    stack: StackLightboxItem;
    onClose: () => void;
};

const SWIPE_CLOSE_PX = 90;

export default function StackLightbox({ stack, onClose }: StackLightboxProps) {
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
            aria-label={stack.name}
            onClick={onClose}
        >
            <div
                className="flex h-dvh w-full flex-col md:h-auto md:max-h-[min(92dvh,720px)] md:max-w-lg md:overflow-hidden md:rounded-3xl md:border md:border-primary/25 md:bg-surface-low md:shadow-[0_0_40px_rgba(204,255,0,0.15)]"
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

                <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-low/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 md:overflow-y-auto md:bg-transparent md:p-6">
                    <button
                        type="button"
                        aria-label="Close"
                        className="absolute right-3 top-3 hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition hover:border-primary/40 hover:text-primary md:flex"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </button>

                    <div className="space-y-5 md:pr-8">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                {stack.category && (
                                    <p className="text-[10px] font-bold tracking-widest text-primary uppercase">{stack.category}</p>
                                )}
                                <h2 className="font-display mt-1 text-3xl font-bold uppercase">{stack.name}</h2>
                                {stack.signal && (
                                    <p className="mt-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                                        {stack.signal}
                                    </p>
                                )}
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                                <StackIcon icon={stack.icon} className="h-7 w-7" />
                            </div>
                        </div>

                        {stack.summary && (
                            <p className="text-sm leading-relaxed text-on-surface-variant">{stack.summary}</p>
                        )}

                        {stack.bullets.length > 0 && (
                            <div>
                                <p className="mb-2 text-[10px] font-bold tracking-widest text-primary uppercase">Capabilities</p>
                                <ul className="space-y-2">
                                    {stack.bullets.map((bullet) => (
                                        <li
                                            key={bullet}
                                            className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/35 px-3 py-2 text-[11px] font-bold tracking-wide text-on-surface-variant uppercase"
                                        >
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_#ccff00]" />
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div>
                            <div className="mb-2 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                <span className="text-on-surface-variant">Integrity</span>
                                <span className="text-primary">{stack.level}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-black/40">
                                <motion.div
                                    className="h-full rounded-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stack.level}%` }}
                                    transition={{ duration: 0.55 }}
                                />
                            </div>
                        </div>

                        <div className="flex w-full flex-wrap items-center gap-2 pt-1">
                            <div className="min-w-[8rem] flex-1">
                                <SpecularButton type="button" size="sm" active onClick={onClose} labelClassName="justify-center">
                                    CLOSE
                                </SpecularButton>
                            </div>
                            {stack.docs_url && (
                                <a
                                    href={stack.docs_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-w-[8rem] flex-1 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-[10px] font-bold tracking-widest text-primary uppercase transition hover:bg-primary hover:text-black"
                                >
                                    Open Docs <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}

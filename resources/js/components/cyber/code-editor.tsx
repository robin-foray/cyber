import { cn } from '@/lib/utils';
import { type TextareaHTMLAttributes, useMemo, useRef } from 'react';

type CyberCodeEditorProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
    value: string;
    onChange: (value: string) => void;
    highlightedLines?: number[];
};

export default function CyberCodeEditor({
    value,
    onChange,
    highlightedLines = [],
    className,
    minHeight,
    ...props
}: CyberCodeEditorProps) {
    const gutterRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const lineNumbers = useMemo(() => {
        const count = Math.max(1, value.split(/\r?\n/).length);

        return Array.from({ length: count }, (_, index) => index + 1);
    }, [value]);

    const highlighted = useMemo(() => new Set(highlightedLines), [highlightedLines]);

    function syncScroll() {
        if (!gutterRef.current || !textareaRef.current) {
            return;
        }

        gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }

    return (
        <div
            className={cn(
                'overflow-hidden rounded-2xl border border-primary/10 bg-black/50',
                minHeight === undefined && 'min-h-[240px] sm:min-h-[360px] md:min-h-[430px]',
            )}
            style={minHeight !== undefined ? { minHeight } : undefined}
        >
            <div className="grid h-full grid-cols-[auto_1fr]">
                <div
                    ref={gutterRef}
                    aria-hidden="true"
                    className="overflow-hidden border-r border-primary/10 bg-black/70 px-3 py-4 select-none"
                >
                    {lineNumbers.map((lineNumber) => (
                        <div
                            key={lineNumber}
                            className={cn(
                                'min-w-[2ch] text-right font-mono text-xs leading-6 tabular-nums',
                                highlighted.has(lineNumber)
                                    ? 'font-bold text-red-300'
                                    : 'text-on-surface-variant/45',
                            )}
                        >
                            {lineNumber}
                        </div>
                    ))}
                </div>

                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onScroll={syncScroll}
                    spellCheck={false}
                    className={cn(
                        'min-h-full w-full min-w-0 resize-y bg-transparent px-4 py-4 font-mono text-base leading-6 text-on-surface-variant outline-none transition-all focus:shadow-[inset_0_0_18px_rgba(204,255,0,0.12)] sm:text-xs',
                        className,
                    )}
                    style={minHeight !== undefined ? { minHeight } : undefined}
                    {...props}
                />
            </div>
        </div>
    );
}

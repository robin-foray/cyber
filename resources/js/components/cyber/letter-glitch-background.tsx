import { useEffect, useRef } from 'react';

const glyphs = '01<>/{}[]$#_FORAYDEVNODESTACK';

type GlitchCell = {
    char: string;
    tint: 'lime' | 'cyan' | 'magenta';
    pulse: number;
};

function randomCell(): GlitchCell {
    const roll = Math.random();

    return {
        char: Math.random() > 0.66 ? glyphs[Math.floor(Math.random() * glyphs.length)] : '',
        tint: roll > 0.9 ? 'magenta' : roll > 0.78 ? 'cyan' : 'lime',
        pulse: Math.random(),
    };
}

export default function LetterGlitchBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        let frame = 0;
        let columns = 0;
        let rows = 0;
        let cells: GlitchCell[] = [];

        function resize() {
            const rect = canvas.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(rect.width * ratio));
            canvas.height = Math.max(1, Math.floor(rect.height * ratio));
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            columns = Math.ceil(rect.width / 22);
            rows = Math.ceil(rect.height / 20);
            cells = Array.from({ length: columns * rows }, randomCell);
        }

        function draw() {
            const rect = canvas.getBoundingClientRect();
            frame += 1;

            context.clearRect(0, 0, rect.width, rect.height);
            context.font = '700 12px "JetBrains Mono", monospace';
            context.textBaseline = 'top';

            cells = cells.map((cell) => (Math.random() > 0.955 ? randomCell() : cell));

            for (let index = 0; index < cells.length; index += 1) {
                const cell = cells[index];

                if (!cell.char) {
                    continue;
                }

                const x = (index % columns) * 22 + 2;
                const y = Math.floor(index / columns) * 20 + 2;
                const flicker = 0.065 + cell.pulse * 0.105 + (Math.sin(frame / 18 + index) + 1) * 0.024;

                context.globalAlpha = flicker;
                context.fillStyle = '#ccff00';
                context.fillText(cell.char, x, y);

                if (cell.tint !== 'lime' || Math.random() > 0.978) {
                    context.globalAlpha = flicker * 0.72;
                    context.fillStyle = cell.tint === 'magenta' ? '#ff2bd6' : '#7df9ff';
                    context.fillText(cell.char, x + (cell.tint === 'magenta' ? 1.4 : -1.2), y + (Math.random() > 0.5 ? 0.6 : -0.6));
                }
            }

            context.globalAlpha = 0.055;
            context.fillStyle = '#ccff00';
            const sweepX = ((frame * 3) % (rect.width + 260)) - 260;
            context.fillRect(sweepX, 0, 220, rect.height);

            context.globalAlpha = 1;
        }

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        const interval = window.setInterval(draw, 120);

        return () => {
            window.clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="letter-glitch-bg" aria-hidden="true" />;
}

import { describe, expect, it } from 'vitest';
import {
    DEFAULT_QR_OPTIONS,
    DEFAULT_QR_STYLE_ID,
    generateQrCodeDataUrl,
    generateQrSvg,
    getQrStylePreset,
    isQrCodeDataUrl,
    QR_STYLE_PRESETS,
    qrSvgToDataUrl,
    type QrStyleId,
} from './qr-code';

describe('QR_STYLE_PRESETS', () => {
    it('exposes many named style presets', () => {
        expect(QR_STYLE_PRESETS.length).toBeGreaterThanOrEqual(16);
        expect(getQrStylePreset(DEFAULT_QR_STYLE_ID).id).toBe('cyber');
        expect(getQrStylePreset('missing' as QrStyleId).id).toBe('cyber');
    });

    it('has unique ids and labels', () => {
        const ids = QR_STYLE_PRESETS.map((preset) => preset.id);
        const labels = QR_STYLE_PRESETS.map((preset) => preset.label);

        expect(new Set(ids).size).toBe(ids.length);
        expect(new Set(labels).size).toBe(labels.length);
    });
});

describe('generateQrSvg', () => {
    it('renders an svg with background and modules for each preset', () => {
        for (const preset of QR_STYLE_PRESETS) {
            const svg = generateQrSvg('https://foray.hu/q/style-check', {
                width: 180,
                margin: 1,
                styleId: preset.id,
            });

            expect(svg).toContain('<svg');
            expect(svg).toContain(`fill="${preset.light}"`);
            expect(svg).toContain(preset.dark);
            expect(svg.length).toBeGreaterThan(400);
        }
    });

    it('changes geometry across module shapes', () => {
        const square = generateQrSvg('shape-a', { styleId: 'cyber', width: 160 });
        const dots = generateQrSvg('shape-a', { styleId: 'cyber-dots', width: 160 });
        const diamond = generateQrSvg('shape-a', { styleId: 'diamond-neon', width: 160 });

        expect(square).toContain('<rect');
        expect(dots).toContain('<circle');
        expect(diamond).toContain('<polygon');
        expect(square).not.toBe(dots);
        expect(dots).not.toBe(diamond);
    });
});

describe('generateQrCodeDataUrl', () => {
    it('generates a data URL for text payloads', async () => {
        const dataUrl = await generateQrCodeDataUrl('https://foray.local/dev-tools');

        expect(isQrCodeDataUrl(dataUrl)).toBe(true);
    });

    it('generates different codes for different payloads', async () => {
        const first = await generateQrCodeDataUrl('payload-a');
        const second = await generateQrCodeDataUrl('payload-b');

        expect(first).not.toBe(second);
    });

    it('generates stable output for the same payload and options', async () => {
        const first = await generateQrCodeDataUrl('stable-payload', DEFAULT_QR_OPTIONS);
        const second = await generateQrCodeDataUrl('stable-payload', DEFAULT_QR_OPTIONS);

        expect(first).toBe(second);
    });

    it('supports all error correction levels', async () => {
        const levels = ['L', 'M', 'Q', 'H'] as const;

        for (const errorCorrectionLevel of levels) {
            const dataUrl = await generateQrCodeDataUrl('ecl-check', { errorCorrectionLevel });

            expect(isQrCodeDataUrl(dataUrl)).toBe(true);
        }
    });

    it('applies custom size and margin options', async () => {
        const compact = await generateQrCodeDataUrl('size-check', { width: 160, margin: 0 });
        const large = await generateQrCodeDataUrl('size-check', { width: 480, margin: 4 });

        expect(compact).not.toBe(large);
        expect(isQrCodeDataUrl(compact)).toBe(true);
        expect(isQrCodeDataUrl(large)).toBe(true);
    });

    it('supports small output sizes such as 20px', async () => {
        const dataUrl = await generateQrCodeDataUrl('tiny', { width: 20, margin: 0 });

        expect(isQrCodeDataUrl(dataUrl)).toBe(true);
    });

    it('generates distinct data urls for different style presets', async () => {
        const cyber = await generateQrCodeDataUrl('styled', { styleId: 'cyber' });
        const print = await generateQrCodeDataUrl('styled', { styleId: 'print' });
        const magenta = await generateQrCodeDataUrl('styled', { styleId: 'magenta' });

        expect(cyber).not.toBe(print);
        expect(print).not.toBe(magenta);
        expect(isQrCodeDataUrl(cyber)).toBe(true);
        expect(isQrCodeDataUrl(print)).toBe(true);
        expect(isQrCodeDataUrl(magenta)).toBe(true);
    });

    it('rejects empty payloads', async () => {
        await expect(generateQrCodeDataUrl('')).rejects.toThrow();
    });
});

describe('isQrCodeDataUrl', () => {
    it('returns false for invalid values', () => {
        expect(isQrCodeDataUrl('')).toBe(false);
        expect(isQrCodeDataUrl('data:image/png;base64,')).toBe(false);
        expect(isQrCodeDataUrl('not-a-data-url')).toBe(false);
    });

    it('accepts svg data urls', () => {
        const svgUrl = qrSvgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

        expect(isQrCodeDataUrl(svgUrl)).toBe(true);
    });
});

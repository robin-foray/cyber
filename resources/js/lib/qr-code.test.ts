import { describe, expect, it } from 'vitest';
import { DEFAULT_QR_OPTIONS, generateQrCodeDataUrl, isQrCodeDataUrl } from './qr-code';

describe('generateQrCodeDataUrl', () => {
    it('generates a PNG data URL for text payloads', async () => {
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
});

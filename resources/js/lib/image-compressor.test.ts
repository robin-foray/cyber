import { describe, expect, it } from 'vitest';
import { formatBytes, getTargetSize } from './image-compressor';

describe('getTargetSize', () => {
    it('keeps dimensions when image is already within bounds', () => {
        expect(getTargetSize(800, 600, 1280, 960)).toEqual({ width: 800, height: 600 });
    });

    it('scales down oversized images while preserving aspect ratio', () => {
        const result = getTargetSize(2000, 1000, 1280, 960);

        expect(result.width).toBe(1280);
        expect(result.height).toBe(640);
    });

    it('uses a minimum bound of 64px for max dimensions', () => {
        const result = getTargetSize(2000, 1000, 10, 10);

        expect(result.width).toBe(64);
        expect(result.height).toBe(32);
    });
});

describe('formatBytes', () => {
    it('returns waiting for zero bytes', () => {
        expect(formatBytes(0)).toBe('waiting');
    });

    it('formats byte values into human readable units', () => {
        expect(formatBytes(512)).toBe('512 B');
        expect(formatBytes(1024)).toBe('1.0 KB');
        expect(formatBytes(1536)).toBe('1.5 KB');
    });
});

import { describe, expect, it } from 'vitest';
import { convertColor } from './color-converter';

describe('convertColor', () => {
    it('converts hex to all formats', () => {
        const result = convertColor('#ccff00', 'hex');

        expect(result.error).toBe('');
        expect(result.hex).toBe('#ccff00');
        expect(result.rgb).toBe('rgb(204, 255, 0)');
        expect(result.hsl).toBe('hsl(72, 100%, 50%)');
    });

    it('converts shorthand hex values', () => {
        const result = convertColor('#f0c', 'hex');

        expect(result.error).toBe('');
        expect(result.rgb).toBe('rgb(255, 0, 204)');
    });

    it('converts rgb input', () => {
        const result = convertColor('rgb(204, 255, 0)', 'rgb');

        expect(result.error).toBe('');
        expect(result.hex).toBe('#ccff00');
    });

    it('converts hsl input', () => {
        const result = convertColor('hsl(72, 100%, 50%)', 'hsl');

        expect(result.error).toBe('');
        expect(result.hex).toBe('#ccff00');
    });

    it('converts rgba with alpha', () => {
        const result = convertColor('rgba(204, 255, 0, 0.5)', 'rgba');

        expect(result.error).toBe('');
        expect(result.rgba).toBe('rgba(204, 255, 0, 0.5)');
        expect(result.hex).toBe('#ccff0080');
    });

    it('rejects invalid hex values', () => {
        const result = convertColor('#gg0000', 'hex');

        expect(result.error).toContain('Invalid');
        expect(result.hex).toBe('');
    });
});

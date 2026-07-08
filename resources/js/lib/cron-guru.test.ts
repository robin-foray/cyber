import { describe, expect, it } from 'vitest';
import { analyzeCron } from './cron-guru';

describe('analyzeCron', () => {
    it('parses classic 5-field cron expressions', () => {
        const result = analyzeCron('0 9 * * *');

        expect(result.error).toBe('');
        expect(result.parsed?.hour.values).toContain(9);
        expect(result.nextRuns.length).toBeGreaterThan(0);
        expect(result.summary.some((line) => line.startsWith('Hour:'))).toBe(true);
    });

    it('parses 6-field cron expressions with seconds', () => {
        const result = analyzeCron('*/30 * * * * *');

        expect(result.error).toBe('');
        expect(result.parsed?.second.restricted).toBe(true);
        expect(result.nextRuns.length).toBeGreaterThan(0);
    });

    it('supports workday pulse presets', () => {
        const result = analyzeCron('*/15 9-17 * * 1-5');

        expect(result.error).toBe('');
        expect(result.parsed?.weekday.values).toEqual([1, 2, 3, 4, 5]);
        expect(result.nextRuns.length).toBeGreaterThan(0);
    });

    it('rejects invalid cron expressions', () => {
        const result = analyzeCron('not a cron');

        expect(result.error).not.toBe('');
        expect(result.nextRuns).toEqual([]);
        expect(result.parsed).toBeUndefined();
    });
});

import { describe, expect, it } from 'vitest';
import { DEV_TICKER_DURATION_MS, getDevTickerAnimationDelay } from './dev-ticker';

describe('getDevTickerAnimationDelay', () => {
    it('returns a negative delay in seconds', () => {
        const delay = getDevTickerAnimationDelay(5_000, 0);

        expect(delay).toBe('-5s');
    });

    it('wraps within the ticker duration', () => {
        const epoch = 1_000;
        const atStart = getDevTickerAnimationDelay(epoch, epoch);
        const atWrap = getDevTickerAnimationDelay(epoch + DEV_TICKER_DURATION_MS, epoch);

        expect(atStart).toBe('0s');
        expect(atWrap).toBe('0s');
    });
});

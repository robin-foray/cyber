export const DEV_TICKER_DURATION_MS = 22_000;

const tickerEpochMs = Date.now();

export function getDevTickerAnimationDelay(now = Date.now(), epochMs = tickerEpochMs): string {
    const elapsed = (now - epochMs) % DEV_TICKER_DURATION_MS;

    return `${-(elapsed / 1000)}s`;
}

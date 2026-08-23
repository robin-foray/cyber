import { describe, expect, it } from 'vitest';
import { formatProbeBody, probeStatusLabel, probeStatusTone, type FreeApiProbeResult } from './free-api-probe';

const base: FreeApiProbeResult = {
    ok: true,
    status: 200,
    duration_ms: 120,
    content_type: 'application/json',
    body: '{"name":"ditto"}',
    parsed: { name: 'ditto' },
    truncated: false,
    endpoint: 'https://pokeapi.co/api/v2/pokemon/ditto',
    error: null,
};

describe('formatProbeBody', () => {
    it('pretty-prints parsed JSON', () => {
        expect(formatProbeBody(base)).toBe('{\n  "name": "ditto"\n}');
    });

    it('returns raw body when JSON parse is unavailable', () => {
        expect(
            formatProbeBody({
                ...base,
                parsed: null,
                body: '203.0.113.1',
            }),
        ).toBe('203.0.113.1');
    });

    it('returns connection errors', () => {
        expect(
            formatProbeBody({
                ...base,
                ok: false,
                error: 'Connection failed: timeout',
                body: '',
            }),
        ).toBe('Connection failed: timeout');
    });
});

describe('probeStatusLabel', () => {
    it('labels HTTP status codes', () => {
        expect(probeStatusLabel(base)).toBe('200');
    });

    it('labels probe errors', () => {
        expect(probeStatusLabel({ ...base, error: 'fail', status: null })).toBe('PROBE_ERR');
    });
});

describe('probeStatusTone', () => {
    it('marks successful probes as ok', () => {
        expect(probeStatusTone(base)).toBe('ok');
    });

    it('marks client errors as error', () => {
        expect(probeStatusTone({ ...base, ok: false, status: 404 })).toBe('error');
    });
});

import { describe, expect, it } from 'vitest';
import { formatJson, inspectJson } from './json-formatter';

const sampleJson = '{"node":"foray-core","status":"sync","tools":["json_formatter"],"payload":{"latency":0.4,"verified":true}}';

describe('formatJson', () => {
    it('pretty prints valid JSON', () => {
        const result = formatJson(sampleJson, 'pretty', 2);

        expect(result.error).toBe('');
        expect(result.output).toContain('\n');
        expect(JSON.parse(result.output)).toEqual(JSON.parse(sampleJson));
    });

    it('minifies valid JSON', () => {
        const pretty = formatJson(sampleJson, 'pretty', 2);
        const minified = formatJson(sampleJson, 'minify');

        expect(minified.error).toBe('');
        expect(minified.output).not.toContain('\n');
        expect(minified.output.length).toBeLessThan(pretty.output.length);
    });

    it('rejects invalid JSON payloads', () => {
        const result = formatJson('{invalid', 'pretty');

        expect(result.output).toBe('');
        expect(result.error).not.toBe('');
    });
});

describe('inspectJson', () => {
    it('counts keys and nodes in nested JSON', () => {
        const stats = inspectJson(sampleJson);

        expect(stats.keys).toBeGreaterThan(0);
        expect(stats.nodes).toBeGreaterThan(stats.keys);
    });

    it('returns zero stats for invalid JSON', () => {
        expect(inspectJson('{bad-json')).toEqual({ keys: 0, nodes: 0 });
    });
});

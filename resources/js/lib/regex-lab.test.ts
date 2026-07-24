import { describe, expect, it } from 'vitest';
import { appendRegexToken, escapeRegexLiteral, formatRegexMatches, testRegex } from './regex-lab';

const defaultFlags = { g: true, i: false, m: false, s: false, u: false };

describe('testRegex', () => {
    it('finds global matches', () => {
        const result = testRegex('\\d+', defaultFlags, 'node 42 and 7');

        expect(result.error).toBe('');
        expect(result.matches).toHaveLength(2);
        expect(result.matches[0]?.match).toBe('42');
    });

    it('returns syntax errors', () => {
        const result = testRegex('[unclosed', defaultFlags, 'test');

        expect(result.error).not.toBe('');
        expect(result.matches).toHaveLength(0);
    });

    it('captures groups', () => {
        const result = testRegex('(foray)-(\\w+)', defaultFlags, 'foray-core online');

        expect(result.matches[0]?.groups).toEqual(['foray', 'core']);
    });

    it('builds highlight segments', () => {
        const result = testRegex('node', defaultFlags, 'foray node online');

        expect(result.segments).toEqual([
            { text: 'foray ', matched: false },
            { text: 'node', matched: true },
            { text: ' online', matched: false },
        ]);
    });

    it('previews replacements', () => {
        const result = testRegex('foray', { ...defaultFlags, g: false }, 'foray-core', 'FORAY');

        expect(result.replacementPreview).toBe('FORAY-core');
    });
});

describe('regex helpers', () => {
    it('appends builder tokens', () => {
        expect(appendRegexToken('^', '\\d+')).toBe('^\\d+');
    });

    it('escapes literal values', () => {
        expect(escapeRegexLiteral('a.b')).toBe('a\\.b');
    });

    it('formats match output', () => {
        const output = formatRegexMatches([
            { index: 0, length: 3, match: 'abc', groups: ['bc'] },
        ]);

        expect(output).toContain('index=0');
        expect(output).toContain('groups=');
    });
});

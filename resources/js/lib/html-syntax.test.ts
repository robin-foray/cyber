import { describe, expect, it } from 'vitest';
import { checkHtmlSyntax, formatHtmlSyntaxReport } from './html-syntax';

describe('checkHtmlSyntax', () => {
    it('accepts well-formed html', () => {
        const result = checkHtmlSyntax('<!doctype html><html><body><h1>ok</h1></body></html>');

        expect(result.valid).toBe(true);
        expect(result.error).toBe('');
    });

    it('reports unclosed tags', () => {
        const result = checkHtmlSyntax('<div><span>missing end');

        expect(result.valid).toBe(false);
        expect(result.issues.some((issue) => issue.message.includes('Unclosed <div>'))).toBe(true);
    });

    it('reports mismatched closing tags', () => {
        const result = checkHtmlSyntax('<div></span>');

        expect(result.valid).toBe(false);
        expect(result.issues.some((issue) => issue.message.includes('Mismatched closing tag'))).toBe(true);
    });

    it('rejects empty input', () => {
        const result = checkHtmlSyntax('   ');

        expect(result.valid).toBe(false);
        expect(result.error).toContain('empty');
    });

    it('formats a readable report', () => {
        const result = checkHtmlSyntax('<div></span>');
        const report = formatHtmlSyntaxReport(result);

        expect(report).toContain('L1');
        expect(report).toContain('[error]');
    });
});

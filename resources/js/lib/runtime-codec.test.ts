import { describe, expect, it } from 'vitest';
import { executeCodec, inspectJwt } from './runtime-codec';

const samplePayload = 'eyJub2RlIjoiZm9yYXktcnVudGltZSIsInN0YXR1cyI6Im9ubGluZSJ9';
const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.signature';

describe('executeCodec', () => {
    it('decodes base64 payloads', () => {
        const result = executeCodec('base64-decode', samplePayload);

        expect(result.error).toBe('');
        expect(result.output).toContain('foray-runtime');
    });

    it('encodes and decodes text with base64 roundtrip', () => {
        const encoded = executeCodec('base64-encode', 'foray-runtime');
        const decoded = executeCodec('base64-decode', encoded.output);

        expect(encoded.error).toBe('');
        expect(decoded.error).toBe('');
        expect(decoded.output).toBe('foray-runtime');
    });

    it('encodes and decodes URL fragments', () => {
        const encoded = executeCodec('url-encode', 'hello world?x=1');
        const decoded = executeCodec('url-decode', encoded.output);

        expect(encoded.error).toBe('');
        expect(decoded.error).toBe('');
        expect(decoded.output).toBe('hello world?x=1');
    });

    it('inspects JWT header and payload', () => {
        const result = executeCodec('jwt-inspect', sampleJwt);

        expect(result.error).toBe('');
        expect(result.output).toContain('"alg": "HS256"');
        expect(result.output).toContain('"sub": "123"');
        expect(result.output).toContain('"signature_present": true');
    });

    it('rejects malformed base64 input', () => {
        const result = executeCodec('base64-decode', '%%%');

        expect(result.output).toBe('');
        expect(result.error).not.toBe('');
    });
});

describe('inspectJwt', () => {
    it('requires at least header and payload segments', () => {
        expect(() => inspectJwt('only-one-segment')).toThrow('JWT must contain at least header and payload segments.');
    });
});

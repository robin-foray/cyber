export type CodecMode = 'base64-encode' | 'base64-decode' | 'url-encode' | 'url-decode' | 'jwt-inspect';

export function executeCodec(mode: CodecMode, input: string): { output: string; error: string } {
    try {
        let output = '';

        if (mode === 'base64-encode') {
            output = btoa(unescape(encodeURIComponent(input)));
        }

        if (mode === 'base64-decode') {
            output = decodeURIComponent(escape(atob(input.trim())));
        }

        if (mode === 'url-encode') {
            output = encodeURIComponent(input);
        }

        if (mode === 'url-decode') {
            output = decodeURIComponent(input);
        }

        if (mode === 'jwt-inspect') {
            output = inspectJwt(input);
        }

        return { output, error: '' };
    } catch (exception) {
        return {
            output: '',
            error: exception instanceof Error ? exception.message : 'Codec operation failed',
        };
    }
}

export function inspectJwt(token: string) {
    const parts = token.trim().split('.');

    if (parts.length < 2) {
        throw new Error('JWT must contain at least header and payload segments.');
    }

    const header = decodeBase64Url(parts[0]);
    const payload = decodeBase64Url(parts[1]);

    return JSON.stringify(
        {
            header: JSON.parse(header),
            payload: JSON.parse(payload),
            signature_present: Boolean(parts[2]),
        },
        null,
        2,
    );
}

function decodeBase64Url(segment: string) {
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');

    return decodeURIComponent(escape(atob(padded)));
}

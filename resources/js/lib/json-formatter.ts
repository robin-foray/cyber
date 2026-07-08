export type FormatMode = 'pretty' | 'minify';

export function formatJson(input: string, mode: FormatMode, indent = 2): { output: string; error: string } {
    try {
        const parsed = JSON.parse(input);
        const output = mode === 'pretty' ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed);

        return { output, error: '' };
    } catch (exception) {
        return {
            output: '',
            error: exception instanceof Error ? exception.message : 'Invalid JSON payload',
        };
    }
}

export function inspectJson(payload: string) {
    try {
        const parsed: unknown = JSON.parse(payload);
        const result = { keys: 0, nodes: 0 };
        walkJson(parsed, result);

        return result;
    } catch {
        return { keys: 0, nodes: 0 };
    }
}

function walkJson(value: unknown, result: { keys: number; nodes: number }) {
    result.nodes += 1;

    if (Array.isArray(value)) {
        value.forEach((item) => walkJson(item, result));
        return;
    }

    if (value && typeof value === 'object') {
        const entries = Object.entries(value);
        result.keys += entries.length;
        entries.forEach(([, item]) => walkJson(item, result));
    }
}

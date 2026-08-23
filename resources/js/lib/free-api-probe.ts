export type FreeApiProbeResult = {
    ok: boolean;
    status: number | null;
    duration_ms: number;
    content_type: string | null;
    body: string;
    parsed: unknown;
    truncated: boolean;
    endpoint: string;
    error: string | null;
};

export function formatProbeBody(result: FreeApiProbeResult): string {
    if (result.error) {
        return result.error;
    }

    if (result.parsed !== null && result.parsed !== undefined) {
        return JSON.stringify(result.parsed, null, 2);
    }

    return result.body;
}

export function probeStatusLabel(result: FreeApiProbeResult): string {
    if (result.error) {
        return 'PROBE_ERR';
    }

    if (result.status === null) {
        return 'NO_STATUS';
    }

    return String(result.status);
}

export function probeStatusTone(result: FreeApiProbeResult): 'ok' | 'warn' | 'error' {
    if (result.error || result.status === null) {
        return 'error';
    }

    if (result.ok) {
        return 'ok';
    }

    if (result.status >= 400) {
        return 'error';
    }

    return 'warn';
}

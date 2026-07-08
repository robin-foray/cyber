export type CronFieldKey = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'weekday';

type ParsedField = {
    values: number[];
    text: string;
    restricted: boolean;
};

type ParsedCron = Record<CronFieldKey, ParsedField>;

const fieldRules: Record<CronFieldKey, { label: string; min: number; max: number; aliases?: Record<string, number> }> = {
    second: { label: 'Second', min: 0, max: 59 },
    minute: { label: 'Minute', min: 0, max: 59 },
    hour: { label: 'Hour', min: 0, max: 23 },
    day: { label: 'Day', min: 1, max: 31 },
    month: {
        label: 'Month',
        min: 1,
        max: 12,
        aliases: { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 },
    },
    weekday: {
        label: 'Weekday',
        min: 0,
        max: 7,
        aliases: { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 },
    },
};

const fieldOrder: CronFieldKey[] = ['second', 'minute', 'hour', 'day', 'month', 'weekday'];

export function analyzeCron(expression: string) {
    try {
        const parsed = parseCron(expression);
        const nextRuns = collectNextRuns(parsed);

        if (!nextRuns.length) {
            throw new Error('No runtime found in the next year. Try a less restrictive expression.');
        }

        return {
            parsed,
            nextRuns,
            summary: fieldOrder.map((field) => `${fieldRules[field].label}: ${parsed[field].text}`),
            error: '',
        };
    } catch (exception) {
        return {
            parsed: undefined,
            nextRuns: [],
            summary: [],
            error: exception instanceof Error ? exception.message : 'Cron parse failed.',
        };
    }
}

export function formatRun(date: Date) {
    return new Intl.DateTimeFormat('hu-HU', {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
}

function parseCron(expression: string): ParsedCron {
    const rawParts = expression.trim().split(/\s+/).filter(Boolean);
    const parts = normalizeCronParts(rawParts);

    if (parts.length !== 6) {
        throw new Error('Cron expression must contain 6 fields with seconds, 5 classic fields, or 4 fields when the minute is omitted.');
    }

    return {
        second: parseField(parts[0], 'second'),
        minute: parseField(parts[1], 'minute'),
        hour: parseField(parts[2], 'hour'),
        day: parseField(parts[3], 'day'),
        month: parseField(parts[4], 'month'),
        weekday: parseField(parts[5], 'weekday'),
    };
}

function normalizeCronParts(rawParts: string[]) {
    if (rawParts.length === 4) {
        return ['0', '0', ...rawParts];
    }

    if (rawParts.length === 5) {
        return ['0', ...rawParts];
    }

    return rawParts;
}

function parseField(rawValue: string, field: CronFieldKey): ParsedField {
    const rule = fieldRules[field];
    const normalized = rawValue.toLowerCase();
    const values = new Set<number>();

    for (const segment of normalized.split(',')) {
        const [rangePart, stepPart] = segment.split('/');
        const step = stepPart ? Number(stepPart) : 1;

        if (!Number.isInteger(step) || step <= 0) {
            throw new Error(`${rule.label} step must be a positive number.`);
        }

        const [start, end] = resolveRange(rangePart, field);

        for (let value = start; value <= end; value += step) {
            const cronValue = field === 'weekday' && value === 7 ? 0 : value;
            if (cronValue < rule.min || cronValue > (field === 'weekday' ? 6 : rule.max)) {
                throw new Error(`${rule.label} value ${value} is outside allowed range.`);
            }
            values.add(cronValue);
        }
    }

    if (!values.size) {
        throw new Error(`${rule.label} field has no valid values.`);
    }

    const orderedValues = [...values].sort((a, b) => a - b);

    return {
        values: orderedValues,
        text: describeField(rawValue, orderedValues, field),
        restricted: normalized !== '*',
    };
}

function resolveRange(rangePart: string, field: CronFieldKey): [number, number] {
    const rule = fieldRules[field];

    if (rangePart === '*') {
        return [rule.min, rule.max];
    }

    if (rangePart.includes('-')) {
        const [startRaw, endRaw] = rangePart.split('-');
        const start = resolveToken(startRaw, field);
        const end = resolveToken(endRaw, field);

        if (start > end) {
            throw new Error(`${rule.label} range start cannot be greater than range end.`);
        }

        return [start, end];
    }

    const value = resolveToken(rangePart, field);
    return [value, value];
}

function resolveToken(token: string, field: CronFieldKey) {
    const rule = fieldRules[field];
    const aliasValue = rule.aliases?.[token];
    const value = aliasValue ?? Number(token);

    if (!Number.isInteger(value)) {
        throw new Error(`${rule.label} contains unknown token: ${token}`);
    }

    if (value < rule.min || value > rule.max) {
        throw new Error(`${rule.label} value ${value} is outside ${rule.min}-${rule.max}.`);
    }

    return value;
}

function describeField(rawValue: string, values: number[], field: CronFieldKey) {
    const rule = fieldRules[field];

    if (rawValue === '*') {
        return `every ${rule.label.toLowerCase()}`;
    }

    if (rawValue.includes('/')) {
        return `${rawValue} pulse`;
    }

    if (values.length <= 6) {
        return values.map((value) => labelValue(value, field)).join(', ');
    }

    return `${values.length} selected`;
}

function labelValue(value: number, field: CronFieldKey) {
    if (field === 'weekday') {
        return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][value] ?? String(value);
    }

    if (field === 'month') {
        return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][value - 1] ?? String(value);
    }

    return String(value).padStart(2, '0');
}

function collectNextRuns(parsed: ParsedCron) {
    const runs: Date[] = [];
    const start = new Date();
    start.setMilliseconds(0);
    start.setSeconds(start.getSeconds() + 1);

    const candidate = new Date(start);
    candidate.setSeconds(0, 0);

    for (let index = 0; index < 525600 && runs.length < 8; index += 1) {
        if (matchesMinuteCron(candidate, parsed)) {
            for (const second of parsed.second.values) {
                const run = new Date(candidate);
                run.setSeconds(second, 0);

                if (run >= start) {
                    runs.push(run);
                }

                if (runs.length >= 8) {
                    break;
                }
            }
        }

        candidate.setMinutes(candidate.getMinutes() + 1);
    }

    return runs;
}

function matchesMinuteCron(date: Date, parsed: ParsedCron) {
    return (
        parsed.minute.values.includes(date.getMinutes()) &&
        parsed.hour.values.includes(date.getHours()) &&
        parsed.day.values.includes(date.getDate()) &&
        parsed.month.values.includes(date.getMonth() + 1) &&
        parsed.weekday.values.includes(date.getDay())
    );
}

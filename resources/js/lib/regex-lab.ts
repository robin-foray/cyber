export type RegexFlagKey = 'g' | 'i' | 'm' | 's' | 'u';

export type RegexFlags = Record<RegexFlagKey, boolean>;

export type RegexMatch = {
    index: number;
    length: number;
    match: string;
    groups: string[];
};

export type RegexHighlightSegment = {
    text: string;
    matched: boolean;
};

export type RegexTestResult = {
    matches: RegexMatch[];
    segments: RegexHighlightSegment[];
    replacementPreview: string;
    error: string;
    flags: string;
};

export type RegexBuilderToken = {
    label: string;
    token: string;
    description: string;
};

export type RegexPreset = {
    label: string;
    pattern: string;
    flags: Partial<RegexFlags>;
    sample: string;
};

export const defaultRegexFlags: RegexFlags = {
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
};

export const regexFlagOptions: Array<{ key: RegexFlagKey; label: string; description: string }> = [
    { key: 'g', label: 'global', description: 'Find all matches' },
    { key: 'i', label: 'ignoreCase', description: 'Case-insensitive' },
    { key: 'm', label: 'multiline', description: '^ and $ match line boundaries' },
    { key: 's', label: 'dotAll', description: '. matches newlines' },
    { key: 'u', label: 'unicode', description: 'Unicode-aware matching' },
];

export const regexBuilderTokens: RegexBuilderToken[] = [
    { label: 'Start', token: '^', description: 'Start anchor' },
    { label: 'End', token: '$', description: 'End anchor' },
    { label: 'Any', token: '.*', description: 'Any characters' },
    { label: 'Lazy Any', token: '.*?', description: 'Any characters (lazy)' },
    { label: 'Digit', token: '\\d', description: 'Single digit' },
    { label: 'Digits', token: '\\d+', description: 'One or more digits' },
    { label: 'Word', token: '\\w+', description: 'Word characters' },
    { label: 'Space', token: '\\s+', description: 'Whitespace run' },
    { label: 'Lower', token: '[a-z]+', description: 'Lowercase letters' },
    { label: 'Upper', token: '[A-Z]+', description: 'Uppercase letters' },
    { label: 'Hex', token: '[0-9a-fA-F]+', description: 'Hex characters' },
    { label: 'Group', token: '()', description: 'Capturing group' },
    { label: 'Optional', token: '?', description: 'Optional quantifier' },
    { label: 'One+', token: '+', description: 'One or more' },
    { label: 'Zero+', token: '*', description: 'Zero or more' },
    { label: 'Alt', token: '|', description: 'Alternation' },
];

export const regexPresets: RegexPreset[] = [
    {
        label: 'Email',
        pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        flags: { g: true, i: true },
        sample: 'ops@foray.local contact@node.dev invalid@',
    },
    {
        label: 'IPv4',
        pattern: '\\b(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(?:\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)){3}\\b',
        flags: { g: true },
        sample: '10.0.0.42 255.255.255.0 999.1.1.1',
    },
    {
        label: 'Slug',
        pattern: '[a-z0-9]+(?:-[a-z0-9]+)*',
        flags: { g: true, i: true },
        sample: 'foray-core dev-tools regex-lab',
    },
    {
        label: 'Hex Color',
        pattern: '#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b',
        flags: { g: true, i: true },
        sample: 'primary #ccff00 backup #f0c surface #201f1f',
    },
    {
        label: 'URL',
        pattern: 'https?:\\/\\/[^\\s]+',
        flags: { g: true, i: true },
        sample: 'Visit https://foray.local/dev-tools and http://node.io',
    },
];

export function flagsToString(flags: RegexFlags) {
    return regexFlagOptions.map((option) => (flags[option.key] ? option.key : '')).join('');
}

export function parseFlagsString(value: string): RegexFlags {
    return {
        g: value.includes('g'),
        i: value.includes('i'),
        m: value.includes('m'),
        s: value.includes('s'),
        u: value.includes('u'),
    };
}

export function appendRegexToken(pattern: string, token: string) {
    return `${pattern}${token}`;
}

export function escapeRegexLiteral(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function testRegex(pattern: string, flags: RegexFlags, haystack: string, replacement = ''): RegexTestResult {
    const flagString = flagsToString(flags);

    if (pattern.trim() === '') {
        return emptyResult(flagString, 'Regex pattern is required.');
    }

    let expression: RegExp;

    try {
        expression = new RegExp(pattern, flagString);
    } catch (exception) {
        return emptyResult(flagString, exception instanceof Error ? exception.message : 'Invalid regular expression.');
    }

    const matches: RegexMatch[] = [];

    if (flags.g) {
        const globalExpression = new RegExp(pattern, `${flagString.includes('g') ? flagString : `${flagString}g`}`);

        for (const match of haystack.matchAll(globalExpression)) {
            if (match.index === undefined) {
                continue;
            }

            matches.push({
                index: match.index,
                length: match[0].length,
                match: match[0],
                groups: match.slice(1),
            });
        }
    } else {
        const match = expression.exec(haystack);

        if (match && match.index !== undefined) {
            matches.push({
                index: match.index,
                length: match[0].length,
                match: match[0],
                groups: match.slice(1),
            });
        }
    }

    return {
        matches,
        segments: buildHighlightSegments(haystack, matches),
        replacementPreview: buildReplacementPreview(expression, haystack, replacement),
        error: '',
        flags: flagString,
    };
}

function buildHighlightSegments(haystack: string, matches: RegexMatch[]): RegexHighlightSegment[] {
    if (matches.length === 0) {
        return [{ text: haystack, matched: false }];
    }

    const segments: RegexHighlightSegment[] = [];
    let cursor = 0;

    matches.forEach((match) => {
        if (match.index > cursor) {
            segments.push({
                text: haystack.slice(cursor, match.index),
                matched: false,
            });
        }

        segments.push({
            text: haystack.slice(match.index, match.index + match.length),
            matched: true,
        });

        cursor = match.index + match.length;
    });

    if (cursor < haystack.length) {
        segments.push({
            text: haystack.slice(cursor),
            matched: false,
        });
    }

    return segments;
}

function buildReplacementPreview(expression: RegExp, haystack: string, replacement: string) {
    if (replacement.trim() === '') {
        return '';
    }

    try {
        return haystack.replace(expression, replacement);
    } catch (exception) {
        return exception instanceof Error ? exception.message : 'Replacement failed.';
    }
}

function emptyResult(flags: string, error: string): RegexTestResult {
    return {
        matches: [],
        segments: [],
        replacementPreview: '',
        error,
        flags,
    };
}

export function formatRegexMatches(matches: RegexMatch[]) {
    if (matches.length === 0) {
        return '// no matches';
    }

    return matches
        .map((match, index) => {
            const groups = match.groups.length > 0 ? ` groups=[${match.groups.map((group) => JSON.stringify(group)).join(', ')}]` : '';

            return `#${index + 1} index=${match.index} match=${JSON.stringify(match.match)}${groups}`;
        })
        .join('\n');
}

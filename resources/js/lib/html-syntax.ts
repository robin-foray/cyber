export type HtmlSyntaxIssue = {
    line: number;
    message: string;
    severity: 'error' | 'warning';
};

export type HtmlSyntaxResult = {
    valid: boolean;
    issues: HtmlSyntaxIssue[];
    error: string;
};

const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);

const optionalCloseElements = new Set(['li', 'p', 'td', 'th', 'tr', 'body', 'html', 'head']);

export function checkHtmlSyntax(input: string): HtmlSyntaxResult {
    const issues: HtmlSyntaxIssue[] = [];

    if (input.trim() === '') {
        return {
            valid: false,
            issues: [{ line: 1, message: 'HTML payload is empty.', severity: 'error' }],
            error: 'HTML payload is empty.',
        };
    }

    const lines = input.split(/\r?\n/);

    lines.forEach((line, index) => {
        const lineNumber = index + 1;

        if (line.includes('<!--') && !line.includes('-->')) {
            issues.push({
                line: lineNumber,
                message: 'Unclosed HTML comment.',
                severity: 'error',
            });
        }

        const unclosedTagStart = line.lastIndexOf('<');
        const unclosedTagEnd = line.lastIndexOf('>');

        if (unclosedTagStart > unclosedTagEnd) {
            issues.push({
                line: lineNumber,
                message: 'Unclosed tag delimiter (`>` missing).',
                severity: 'error',
            });
        }

        const quoteIssues = findUnbalancedQuotes(line);

        quoteIssues.forEach((message) => {
            issues.push({
                line: lineNumber,
                message,
                severity: 'error',
            });
        });
    });

    const opaqueInput = maskOpaqueRegions(input);
    const tagIssues = validateTagStructure(opaqueInput, lines);
    issues.push(...tagIssues);

    const duplicateIdIssues = findDuplicateIds(input);
    issues.push(...duplicateIdIssues);

    const parserIssues = collectParserIssues(input);
    issues.push(...parserIssues);

    const dedupedIssues = dedupeIssues(issues);
    const hasErrors = dedupedIssues.some((issue) => issue.severity === 'error');

    return {
        valid: !hasErrors,
        issues: dedupedIssues,
        error: hasErrors ? dedupedIssues.find((issue) => issue.severity === 'error')?.message ?? 'HTML syntax error' : '',
    };
}

function maskOpaqueRegions(input: string) {
    return input
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) => ' '.repeat(match.length))
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (match) => ' '.repeat(match.length));
}

function validateTagStructure(input: string, lines: string[]) {
    const issues: HtmlSyntaxIssue[] = [];
    const stack: Array<{ tag: string; line: number }> = [];
    const tagPattern = /<\/?([a-zA-Z][\w:-]*)\b[^>]*?>/g;

    let match = tagPattern.exec(input);

    while (match) {
        const fullTag = match[0];
        const tagName = match[1].toLowerCase();
        const line = lineNumberAtIndex(input, match.index, lines);
        const isClosing = fullTag.startsWith('</');
        const isSelfClosing = fullTag.endsWith('/>') || voidElements.has(tagName);

        if (fullTag.startsWith('<!') || fullTag.startsWith('<?')) {
            match = tagPattern.exec(input);
            continue;
        }

        if (isClosing) {
            if (stack.length === 0) {
                issues.push({
                    line,
                    message: `Unexpected closing tag </${tagName}>.`,
                    severity: 'error',
                });
            } else {
                const opened = stack[stack.length - 1];

                if (opened.tag === tagName) {
                    stack.pop();
                } else if (optionalCloseElements.has(opened.tag)) {
                    stack.pop();
                    tagPattern.lastIndex = match.index;
                    continue;
                } else {
                    issues.push({
                        line,
                        message: `Mismatched closing tag </${tagName}>; expected </${opened.tag}>.`,
                        severity: 'error',
                    });
                    stack.pop();
                }
            }
        } else if (!isSelfClosing) {
            stack.push({ tag: tagName, line });
        }

        match = tagPattern.exec(input);
    }

    stack.forEach((opened) => {
        issues.push({
            line: opened.line,
            message: `Unclosed <${opened.tag}> tag.`,
            severity: 'error',
        });
    });

    return issues;
}

function findDuplicateIds(input: string) {
    const issues: HtmlSyntaxIssue[] = [];
    const seen = new Map<string, number>();
    const idPattern = /\bid\s*=\s*(['"])(.*?)\1/gi;

    let match = idPattern.exec(input);

    while (match) {
        const id = match[2];
        const line = lineNumberAtIndex(input, match.index, input.split(/\r?\n/));

        if (seen.has(id)) {
            issues.push({
                line,
                message: `Duplicate id attribute "${id}" (also used on line ${seen.get(id)}).`,
                severity: 'warning',
            });
        } else {
            seen.set(id, line);
        }

        match = idPattern.exec(input);
    }

    return issues;
}

function collectParserIssues(input: string) {
    if (typeof DOMParser === 'undefined') {
        return [];
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(input, 'text/html');
    const parserError = document.querySelector('parsererror');

    if (!parserError) {
        return [];
    }

    const message = parserError.textContent?.trim() || 'Browser parser reported invalid HTML.';

    return [
        {
            line: 1,
            message,
            severity: 'error' as const,
        },
    ];
}

function findUnbalancedQuotes(line: string) {
    const issues: string[] = [];
    const tagPattern = /<[^>]+>/g;
    let match = tagPattern.exec(line);

    while (match) {
        const tag = match[0];
        const attributes = tag.slice(1, -1).replace(/^[^\s]+\s*/, '');

        for (const quote of [`"`, `'`] as const) {
            const count = attributes.split(quote).length - 1;

            if (count % 2 !== 0) {
                issues.push(`Unbalanced ${quote} quotes in tag attributes.`);
            }
        }

        match = tagPattern.exec(line);
    }

    return issues;
}

function lineNumberAtIndex(input: string, index: number, lines: string[]) {
    const before = input.slice(0, index);
    const lineIndex = before.split(/\r?\n/).length - 1;

    return lineIndex + 1 || lines.length || 1;
}

function dedupeIssues(issues: HtmlSyntaxIssue[]) {
    const seen = new Set<string>();

    return issues.filter((issue) => {
        const key = `${issue.line}:${issue.severity}:${issue.message}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });
}

export function formatHtmlSyntaxReport(result: HtmlSyntaxResult) {
    if (result.valid) {
        return '// html syntax valid';
    }

    if (result.issues.length === 0) {
        return result.error || '// html syntax invalid';
    }

    return result.issues.map((issue) => `L${issue.line} [${issue.severity}] ${issue.message}`).join('\n');
}

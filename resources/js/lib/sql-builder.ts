export type SqlWhereOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL';

export type SqlWhereLogic = 'AND' | 'OR';

export type SqlWhereClause = {
    column: string;
    operator: SqlWhereOperator;
    value: string;
    logic: SqlWhereLogic;
};

export type SqlBuilderInput = {
    select: string;
    from: string;
    where: SqlWhereClause[];
};

export type SqlBuilderResult = {
    output: string;
    error: string;
    selectCount: number;
    whereCount: number;
};

export const sqlWhereOperators: SqlWhereOperator[] = [
    '=',
    '!=',
    '>',
    '>=',
    '<',
    '<=',
    'LIKE',
    'NOT LIKE',
    'IN',
    'NOT IN',
    'IS NULL',
    'IS NOT NULL',
];

export const sqlBuilderPresets: Array<{
    label: string;
    select: string;
    from: string;
    where: SqlWhereClause[];
}> = [
    {
        label: 'Active users',
        select: 'id, name, email',
        from: 'users',
        where: [{ column: 'is_active', operator: '=', value: '1', logic: 'AND' }],
    },
    {
        label: 'Recent orders',
        select: 'id, user_id, total',
        from: 'orders',
        where: [
            { column: 'created_at', operator: '>=', value: '2026-01-01', logic: 'AND' },
            { column: 'status', operator: '=', value: 'paid', logic: 'AND' },
        ],
    },
    {
        label: 'Name search',
        select: '*',
        from: 'products',
        where: [{ column: 'name', operator: 'LIKE', value: '%cyber%', logic: 'AND' }],
    },
];

export function createEmptyWhereClause(logic: SqlWhereLogic = 'AND'): SqlWhereClause {
    return {
        column: '',
        operator: '=',
        value: '',
        logic,
    };
}

export function buildSelectQuery(input: SqlBuilderInput): SqlBuilderResult {
    try {
        const selectColumns = parseSelectColumns(input.select);
        const fromTable = normalizeIdentifier(input.from, 'FROM');

        if (!selectColumns.length) {
            throw new Error('SELECT needs at least one column or *.');
        }

        const whereParts: string[] = [];

        for (const [index, clause] of input.where.entries()) {
            const rendered = renderWhereClause(clause);

            if (!rendered) {
                continue;
            }

            if (index === 0 || whereParts.length === 0) {
                whereParts.push(rendered);
            } else {
                whereParts.push(`${clause.logic} ${rendered}`);
            }
        }

        const lines = [`SELECT ${selectColumns.join(', ')}`, `FROM ${fromTable}`];

        if (whereParts.length) {
            lines.push(`WHERE ${whereParts.join(' ')}`);
        }

        return {
            output: `${lines.join('\n')};`,
            error: '',
            selectCount: selectColumns.length,
            whereCount: whereParts.length,
        };
    } catch (exception) {
        return {
            output: '',
            error: exception instanceof Error ? exception.message : 'SQL build failed.',
            selectCount: 0,
            whereCount: 0,
        };
    }
}

function parseSelectColumns(raw: string): string[] {
    const trimmed = raw.trim();

    if (!trimmed) {
        return [];
    }

    return trimmed
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((column) => (column === '*' ? '*' : normalizeIdentifier(column, 'SELECT')));
}

function renderWhereClause(clause: SqlWhereClause): string | null {
    const column = clause.column.trim();
    const value = clause.value.trim();

    if (!column && !value) {
        return null;
    }

    if (!column) {
        throw new Error('WHERE column is required when a condition is set.');
    }

    const identifier = normalizeIdentifier(column, 'WHERE');
    const operator = clause.operator;

    if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
        return `${identifier} ${operator}`;
    }

    if (!value) {
        throw new Error(`WHERE value is required for ${operator}.`);
    }

    if (operator === 'IN' || operator === 'NOT IN') {
        return `${identifier} ${operator} (${formatInList(value)})`;
    }

    return `${identifier} ${operator} ${formatSqlValue(value)}`;
}

function formatInList(raw: string): string {
    const values = raw
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (!values.length) {
        throw new Error('IN / NOT IN needs at least one value.');
    }

    return values.map((value) => formatSqlValue(value)).join(', ');
}

function formatSqlValue(raw: string): string {
    const trimmed = raw.trim();

    if (trimmed === '') {
        return "''";
    }

    if (/^(null)$/i.test(trimmed)) {
        return 'NULL';
    }

    if (/^true$/i.test(trimmed)) {
        return 'TRUE';
    }

    if (/^false$/i.test(trimmed)) {
        return 'FALSE';
    }

    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return trimmed;
    }

    if (
        (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
        const inner = trimmed.slice(1, -1);
        return `'${escapeSqlString(inner)}'`;
    }

    return `'${escapeSqlString(trimmed)}'`;
}

function escapeSqlString(value: string): string {
    return value.replace(/'/g, "''");
}

function normalizeIdentifier(raw: string, context: string): string {
    const trimmed = raw.trim();

    if (!trimmed) {
        throw new Error(`${context} value is required.`);
    }

    if (trimmed === '*') {
        return '*';
    }

    if (/^[`"[]/.test(trimmed) || trimmed.includes('.')) {
        return trimmed
            .split('.')
            .map((part) => normalizeIdentifierPart(part, context))
            .join('.');
    }

    return normalizeIdentifierPart(trimmed, context);
}

function normalizeIdentifierPart(raw: string, context: string): string {
    const trimmed = raw.trim();

    if (
        (trimmed.startsWith('`') && trimmed.endsWith('`')) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
        return trimmed;
    }

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed)) {
        throw new Error(`${context} identifier "${trimmed}" is invalid. Use letters, numbers, underscore.`);
    }

    return trimmed;
}

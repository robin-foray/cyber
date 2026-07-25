import { describe, expect, it } from 'vitest';
import { buildSelectQuery, createEmptyWhereClause } from './sql-builder';

describe('buildSelectQuery', () => {
    it('builds a simple select with from', () => {
        const result = buildSelectQuery({
            select: 'id, name',
            from: 'users',
            where: [],
        });

        expect(result.error).toBe('');
        expect(result.output).toBe('SELECT id, name\nFROM users;');
        expect(result.selectCount).toBe(2);
        expect(result.whereCount).toBe(0);
    });

    it('builds where pairs with and/or logic and quoted values', () => {
        const result = buildSelectQuery({
            select: '*',
            from: 'orders',
            where: [
                { column: 'status', operator: '=', value: 'paid', logic: 'AND' },
                { column: 'total', operator: '>', value: '100', logic: 'AND' },
                { column: 'note', operator: 'LIKE', value: "%o's%", logic: 'OR' },
            ],
        });

        expect(result.error).toBe('');
        expect(result.output).toBe(
            "SELECT *\nFROM orders\nWHERE status = 'paid' AND total > 100 OR note LIKE '%o''s%';",
        );
        expect(result.whereCount).toBe(3);
    });

    it('supports null operators and in lists', () => {
        const result = buildSelectQuery({
            select: 'id',
            from: 'products',
            where: [
                { column: 'deleted_at', operator: 'IS NULL', value: '', logic: 'AND' },
                { column: 'category_id', operator: 'IN', value: '1, 2, 3', logic: 'AND' },
            ],
        });

        expect(result.error).toBe('');
        expect(result.output).toBe(
            'SELECT id\nFROM products\nWHERE deleted_at IS NULL AND category_id IN (1, 2, 3);',
        );
    });

    it('skips blank where rows and rejects invalid identifiers', () => {
        const blankSkipped = buildSelectQuery({
            select: 'id',
            from: 'users',
            where: [createEmptyWhereClause()],
        });

        expect(blankSkipped.error).toBe('');
        expect(blankSkipped.output).toBe('SELECT id\nFROM users;');

        const invalid = buildSelectQuery({
            select: 'id',
            from: 'users; drop',
            where: [],
        });

        expect(invalid.error).toContain('identifier');
        expect(invalid.output).toBe('');
    });
});

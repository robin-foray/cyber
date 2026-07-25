---
name: foray-sql-builder
description: Foray SQL SELECT builder dev-tool. Use when editing sql-builder lib/page, SELECT/FROM/WHERE pairs, /dev-tools/sql-builder, or SQL command generation.
---

# Foray SQL Builder

Client-only SELECT query builder that assembles clean SQL from form fields.

## Paths

| Piece | Location |
|-------|----------|
| Lib | `resources/js/lib/sql-builder.ts` |
| Vitest | `resources/js/lib/sql-builder.test.ts` |
| Page | `resources/js/pages/dev-tools/sql-builder.tsx` |
| Route | `GET /dev-tools/sql-builder` → `dev-tools.sql-builder` |
| CMS page | `DevToolPage` slug `sql-builder` (CmsSeeder) |
| Nav | COOL_STUFF child `SQL_BUILDER` + cool-stuff menu category `DATA` |

## Behaviour

- **SELECT**: comma-separated columns or `*`
- **FROM**: table identifier
- **WHERE pairs**: column + operator + value, joined with AND/OR
- Output: multiline syntax-clean `SELECT … FROM … WHERE …;`
- Strings escaped (`'` → `''`), bare numbers, `IS NULL` / `IN (...)` supported
- Invalid identifiers return `{ output: '', error }`

## Extend

1. Add operators to `sqlWhereOperators` + `renderWhereClause`
2. Keep `buildSelectQuery` pure (no DOM)
3. Register presets in `sqlBuilderPresets`
4. Run `npm test -- sql-builder` and `./vendor/bin/phpunit --filter DevTools`

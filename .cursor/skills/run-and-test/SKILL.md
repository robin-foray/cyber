---
name: run-and-test
description: Run the Foray dev environment, execute tests, lint, and build. Use when verifying changes, debugging CI failures, or setting up the project.
---

# Run & Test Workflow

## Initial setup

```bash
cp .env.example .env
composer install
npm ci
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

## Development

Full stack (recommended):

```bash
composer run dev
```

Runs concurrently: `php artisan serve`, `queue:listen`, `pail`, `npm run dev`.

Individual:

```bash
php artisan serve          # http://localhost:8000
npm run dev                # Vite HMR
```

## Tests

```bash
# All PHP tests (CI runs this)
./vendor/bin/phpunit

# Filtered
./vendor/bin/phpunit --filter DevTools
./vendor/bin/phpunit --filter Authentication

# Frontend lib tests (local only, not in CI)
npm test
npm run test:watch
```

## Lint & format

```bash
vendor/bin/pint              # PHP (also in lint.yml)
npm run lint                 # ESLint
npm run format               # Prettier write
npm run format:check         # Prettier check only
```

## Build

```bash
npm run build                # Production assets (CI runs this)
npm run build:ssr            # SSR build
```

## CI parity check

Reproduce CI locally:

```bash
npm ci && npm run build
touch database/database.sqlite
composer install
cp .env.example .env
php artisan key:generate
./vendor/bin/phpunit
```

## Common issues

| Problem | Fix |
|---------|-----|
| `VITE_APP_NAME` missing | Copy `.env.example`, run `key:generate` |
| SQLite errors | `touch database/database.sqlite && php artisan migrate` |
| Session/cache errors | Ensure migrations ran (uses database driver) |
| Ziggy `route()` undefined | Run `php artisan serve` (Ziggy generates routes) |

## Test environment

`phpunit.xml` sets:
- `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`
- `BCRYPT_ROUNDS=4`
- `SESSION_DRIVER=array`, `CACHE_STORE=array`

Do not rely on persisted DB state between PHPUnit tests.

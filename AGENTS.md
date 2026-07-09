# Foray (Cyber) — Agent Guide

Laravel 12 + Inertia 2 + React 19 monolith with a dual UI: cyberpunk public shell (`CyberShell`) and shadcn admin shell (`AppLayout`).

## Quick start

```bash
cp .env.example .env
composer install
npm ci
php artisan key:generate
touch database/database.sqlite
php artisan migrate
composer run dev   # php artisan serve + queue + pail + vite
```

Single commands:

| Task | Command |
|------|---------|
| Backend tests | `./vendor/bin/phpunit` |
| Frontend tests | `npm test` |
| Lint PHP | `vendor/bin/pint` |
| Lint/format JS | `npm run lint && npm run format:check` |
| Build assets | `npm run build` |

## Architecture

```
routes/web.php          → public pages + dev-tools + auth-gated dashboard/profile
routes/auth.php         → login, register, password reset
routes/settings.php     → settings (auth required)

resources/js/pages/     → Inertia pages (path mirrors render name)
resources/js/lib/       → pure TS logic for dev-tools (+ Vitest tests)
resources/js/components/cyber/  → cyber UI shell
resources/js/components/ui/     → shadcn/ui primitives

app/Http/Controllers/   → Laravel controllers
tests/Feature/          → PHPUnit feature tests
```

## Layout decision tree

| Area | Layout | Example routes |
|------|--------|----------------|
| Public / dev-tools / cyber profile | `CyberShell` | `/`, `/dev-tools/*`, `/profile`, `/login` |
| Dashboard / settings | `AppLayout` (shadcn sidebar) | `/dashboard`, `/settings/*` |
| Password reset / verify email | `AuthLayout` | `/forgot-password`, `/reset-password` |

## Dev-tools pattern

1. **Client-only** (preferred): logic in `resources/js/lib/<name>.ts`, page in `resources/js/pages/dev-tools/<name>.tsx`, route closure in `web.php`, Vitest in `lib/<name>.test.ts`.
2. **Server-backed** (when PHP is needed): add controller under `App\Http\Controllers\DevTools\`, JSON endpoints for API, Inertia page for UI. Example: `HashGeneratorController` (bcrypt).

When adding a dev-tool, add a `NavigationItem` child under DEV_TOOLS in Filament (not hardcoded sidebar).

## Adding new site features (mandatory checklist)

Every new public function **must** include:

1. **Filament admin** — model, migration, Resource (or extend existing CMS). See `.cursor/rules/filament-cms.mdc`
2. **Tests** — PHPUnit (routes, CMS/ContentService, API); Vitest for client lib logic
3. **ContentService** — if data appears on the frontend, expose via `cms` Inertia prop
4. **CmsSeeder** — seed default content for new CMS models

A feature is **not complete** without Filament + tests.

## Auth & users

- First registered user → `role: admin`, `title: Root Operator`
- Subsequent users → `role: member`, `title: Neural Operator`
- Cyber identity fields: `role`, `title`, `avatar_seed`, `bio` (see `/profile`)
- Settings profile (`/settings/profile`) handles email/name + account deletion
- Shared Inertia prop: `auth.user` with `avatar_url`, `is_admin` appended
- **Filament admin** at `/admin` — only `role: admin` users (`canAccessPanel`)

## CMS (Filament)

Content is database-driven and shared via Inertia `cms` prop (see `ContentService`).

| Admin resource | Frontend usage |
|----------------|----------------|
| Menüpontok | Sidebar navigation + dev-tools submenu |
| Social linkek | Sidebar footer icons |
| Hero szekció | Welcome page hero |
| Dev konzol preview | Welcome console section |
| Integrity metrikák | Welcome skill bars |
| Tech stack | Welcome stacks grid |
| Ticker üzenetek | Topbar + footer tickers |
| Deployment lépések | Deployments dev-tool page |
| Dev-tool oldalak | Dev-tool fejlécek, címek, minta input |
| Oldal szekciók | PROJECTS / SYSTEM_LOGS anchor szekciók |
| Oldal beállítások | Page titles, copyright, topbar labels, stacks copy |

Seed default content: `php artisan db:seed --class=CmsSeeder`
Default admin: `admin@foray.local` / `password`

## Testing conventions

- **PHPUnit** (CI): class-based tests in `tests/Feature/` and `tests/Unit/`. Use `assertInertia()` for page checks, `postJson` for API. Pest is **not** installed.
- **Vitest**: co-located `*.test.ts` next to lib files. **Not in CI yet** — run locally with `npm test`.

## Styling

- Tailwind CSS v4 via `@theme` in `resources/css/app.css` (no `tailwind.config.js`)
- Primary cyber color: `#ccff00` (neon green)
- Cyber utility classes: `.cyber-grid`, `.cyber-tool-button`, `.cyber-input`, `.glow-text`
- shadcn/ui in `components/ui/` — use for admin/settings, not dev-tools

## CI

- `tests.yml`: `npm ci` → `npm run build` → `phpunit` on push/PR to `develop`/`main`
- `lint.yml`: Pint + Prettier + ESLint

## Agent resources in this repo

| Path | Purpose |
|------|---------|
| `.cursor/rules/` | Auto-applied coding rules per stack area |
| `.cursor/rules/filament-cms.mdc` | Filament + CMS requirements for new features |
| `.cursor/skills/` | Step-by-step workflows for common tasks |
| `.cursor/mcp.json.example` | Recommended MCP servers (copy & configure locally) |

## Known quirks

- `profile.update` route name exists in both `web.php` and `settings.php` — settings wins (loaded last)
- `tests/Pest.php` exists but Pest is not a dependency — use PHPUnit
- Deployments dev-tool content is CMS-managed via `DeploymentStepResource`

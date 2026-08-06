---
name: foray-cyber-dashboard
description: Foray cyber Laravel+Inertia dashboard. Use when working in cyber-dashboard, Foray UI, Filament admin, machines/tech-stack/useful-sites/free-apis, sidebar, or cyber components.
---

# Foray Cyber Dashboard

Laravel 12 + Inertia React + Tailwind cyber shell. Admin: Filament at `/admin`.

## Stack map

| Area | Path |
|------|------|
| Routes | `routes/web.php` |
| Cyber UI | `resources/js/components/cyber/` |
| Pages | `resources/js/pages/` |
| Models | `app/Models/` |
| Filament | `app/Filament/Resources/` |
| Seeders | `database/seeders/` |
| Tests | `tests/Feature/` |

## Main public modules

- `/` welcome + cyber shell (auth required; guests see login gate)
- `/machines` masonry gallery + categories
- `/tech-stack` interactive stack registry
- `/useful-sites` link cards
- `/free-apis` curated free API registry
- `/dev-tools/*` utilities
- `/admin` Filament (role `admin` only)

Private site: no public registration; only seeded admin (`FORAY_ADMIN_*`) can sign in.

## Conventions

- Brand: lime `#ccff00`, dark surfaces, SpecularButton / Dock / Masonry patterns
- Content modules: Category model + item model + seeder + Inertia page + Filament resources + Feature tests + skill
- Collapsed sidebar nav icons: `2rem` square (`specular-button--nav-icon`)
- Detail panels on mobile: `scrollIntoView` on select

## Commands

```bash
php artisan serve --host=127.0.0.1 --port=8000
npm run dev -- --host 127.0.0.1 --port 5173
php artisan test
php artisan db:seed --class=MachineSeeder
```

Admin (seed): `robin.foray@gmail.com` / `Cursor2026!` (`AdminUserSeeder`)

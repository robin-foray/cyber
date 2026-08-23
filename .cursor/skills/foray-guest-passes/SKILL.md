---
name: foray-guest-passes
description: Foray QR guest passes with expiry, custom identity, and admin view tracking. Use when editing guest pass redemption, GuestPassResource, stats page, or site.access middleware.
---

# Foray Guest Passes

QR / link based guest access without admin login. Employers or visitors get a scoped cyber session with custom name, avatar, expiry banner, and admin view analytics.

## Models

- `GuestPass` — token, display identity, `expires_at`, optional `allowed_routes`, `view_count`
- `GuestPassView` — per-page visit log (`path`, `route_name`, `page_label`, IP, UA)

## Routes

| Route | Purpose |
|-------|---------|
| `GET /pass/{token}` | Redeem pass → guest session (`guest-pass.redeem`) |
| `POST /guest-pass/logout` | End guest session |
| `GET /media/guest-pass/{id}` | Custom avatar (session or admin) |
| Cyber pages | `site.access` middleware (admin **or** valid guest pass) |

## Admin (Filament → Statisztika)

- **Vendég belépők** — CRUD, QR preview (QuickChart), copy link, revoke, view log relation
- **Vendég statisztika** — aggregate counters + global recent views table

## Frontend

- Shared Inertia prop: `guestPass` (null for admin/full users)
- `GuestPassBanner` in `CyberShell` — name + expiry
- Sidebar/topbar guest identity + `END_GUEST` logout

## Security

- Token in URL only at redeem time; session stores `guest_pass_id`
- Host-scoped routes via `allowed_routes` (default: cyber catalog + dev-tools)
- `/profile`, `/dashboard`, `/settings/*`, `/admin` remain admin-only (`auth` middleware)
- Redeem throttled `10/min`

## Tests

`tests/Feature/GuestPass/*` — redeem, access, view tracking, Filament smoke

## Extend

1. New public cyber route → add name to `GuestPass::DEFAULT_ALLOWED_ROUTES` + Filament checkbox labels
2. New tracked page label → `GuestPassViewTracker::pageLabel()`
3. Run `./vendor/bin/phpunit --filter GuestPass`

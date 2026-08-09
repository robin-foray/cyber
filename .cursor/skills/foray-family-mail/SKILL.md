---
name: foray-family-mail
description: Foray family mail admin (foray.hu). Use when editing Filament Levelezés, MailServer page, FamilyMailbox resource, FamilyMailSeeder, or mail server settings.
---

# Foray Family Mail (admin only)

Admin-only Filament module for managing `@foray.hu` family mailboxes. No public/Inertia page.

## Paths

| Area | Path |
|------|------|
| Settings page | `app/Filament/Pages/MailServer.php` → `/admin/mail-server` |
| Blade view | `resources/views/filament/pages/mail-server.blade.php` |
| Mailboxes resource | `app/Filament/Resources/FamilyMailboxResource.php` |
| Models | `MailServerSetting`, `FamilyMailbox` |
| Migration | `database/migrations/2026_08_09_140000_create_family_mail_tables.php` |
| Seeder | `FamilyMailSeeder` (via `DatabaseSeeder` / `foray:install`) |
| Config | `config/foray.php` → `mail.*` / `FORAY_MAIL_*` env |
| Tests | `tests/Feature/Admin/FamilyMailAdminTest.php` |

## Nav

Filament group **Levelezés**:
1. Levelezőszerver — IMAP/SMTP/webmail + domain settings + stats
2. Családi emailek — CRUD for mailbox / alias / forward

## Mailbox types

- `mailbox` — full inbox (`quota_mb`, `password_rotated_at`)
- `alias` / `forward` — requires `forward_to`

Email address = `local_part@domain` (accessor `email`). Unique on `(local_part, domain)`.

## How to extend

1. Add fields via migration + model `$fillable` / casts
2. Update `FamilyMailboxResource` form/table
3. Extend `FamilyMailSeeder` with `updateOrCreate` (idempotent)
4. Cover with PHPUnit in `FamilyMailAdminTest`
5. Re-run `php artisan foray:install` (or seed) on production

This module is an **inventory / ops panel**, not a live Postfix provisioner. Actual mailbox creation happens on the mail server; keep Filament in sync manually.

## Mail server setup (ops)

Step-by-step for installing mail on the live host (DNS, Mailcow or Postfix+Dovecot, webmail, Filament sync):

→ [`deploy/mail-server.md`](../../../deploy/mail-server.md)

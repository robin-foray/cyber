---
name: foray-family-mail
description: Foray family mail admin for @foray.hu addresses. Use when editing Filament Levelezés, MailServer page, FamilyMailbox resource, or FamilyMailSeeder. Webmail is external Roundcube — no Foray /webmail page.
---

# Foray Family Mail (Admin)

Admin inventory for `@foray.hu` addresses. **Webmail lives on the server (Roundcube)** at `FORAY_MAIL_WEBMAIL_URL` — do not add a Foray `/webmail` cyber page.

## Paths

| Area | Path |
|------|------|
| Filament settings | `/admin/mail-server` → `MailServer` page |
| Filament CRUD | `/admin/family-mailboxes` → `FamilyMailboxResource` |
| Models | `MailServerSetting`, `FamilyMailbox` |
| Migration | `2026_08_09_140000_create_family_mail_tables.php` |
| Seeder | `FamilyMailSeeder` |
| Config | `config/foray.php` → `mail.*` / `FORAY_MAIL_*` |
| Ops guide | `deploy/mail-server.md` |

## Flow

1. Seed / configure IMAP·SMTP·webmail URL in Filament **Levelezés → Levelezőszerver**
2. Create mailbox / alias / forward records in Filament
3. Provision the real mailbox on the mail stack (Mailcow/Postfix) — Filament is inventory only
4. Users open Roundcube via the configured `webmail_url` (external link from admin)

## Mailbox types

- `mailbox` — full inbox (`quota_mb`, `password_rotated_at`)
- `alias` / `forward` — requires `forward_to`

## Tests

- `tests/Feature/Admin/FamilyMailAdminTest.php`

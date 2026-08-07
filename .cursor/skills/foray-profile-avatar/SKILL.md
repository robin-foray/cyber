---
name: foray-profile-avatar
description: Foray cyber profile avatar upload. Use when editing /profile avatar upload, avatar_path, DiceBear seed, media avatar route, or profile identity sync.
---

# Foray profile avatar

## Behavior

| Action | Effect |
|--------|--------|
| Upload | Stores image on Laravel `public` disk (`storage/app/public/avatars`); sets `users.avatar_path` |
| Reseed | Sets new DiceBear `avatar_seed` and clears custom avatar on save (via `remove_avatar`) |
| Clear | Removes custom file and falls back to DiceBear |

`User::avatar_url` points at `/media/avatar?v=…` when `avatar_path` is set (served by `ProfileController@avatar`). No `storage:link` required. DiceBear is used only when there is no custom file.

## Key files

| Area | Path |
|------|------|
| Update / delete / stream | `app/Http/Controllers/ProfileController.php` |
| URL accessors | `app/Models/User.php` (`avatar_url`, `has_custom_avatar`) |
| Routes | `profile.update` (PATCH+POST), `profile.avatar` (`GET /media/avatar`) |
| UI | `resources/js/pages/profile.tsx` — POST + `_method=patch` + FormData |
| Shared props | `HandleInertiaRequests` appends `avatar_url`, `has_custom_avatar` |
| Tests | `tests/Feature/CyberProfileTest.php` |

## How to extend

1. Keep writing avatars to the `public` disk (writable by the web user under `storage/`).
2. Serve bytes through `profile.avatar` — do not rebuild URLs from `APP_URL` or `/storage`.
3. FormData must send `remove_avatar` as `0`/`1` and omit `avatar` when no file is selected.
4. Upload always wins over `remove_avatar` when both are present.

## Tests

- Upload → `avatar_path` set, file on `public` disk, URL starts with `/media/avatar`, not DiceBear
- Media route streams the file
- Remove → file gone, DiceBear URL restored
- Upload + `remove_avatar=1` → new file kept

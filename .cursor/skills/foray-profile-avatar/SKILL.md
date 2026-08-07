---
name: foray-profile-avatar
description: Foray cyber profile avatar upload. Use when editing /profile avatar upload, avatar_path, DiceBear seed, public/avatars storage, or profile identity sync.
---

# Foray profile avatar

## Behavior

| Action | Effect |
|--------|--------|
| Upload | Stores image on `public_web` disk at `public/avatars/*`; sets `users.avatar_path` |
| Reseed | Sets new DiceBear `avatar_seed` and clears custom avatar on save (via `remove_avatar`) |
| Clear | Removes custom file and falls back to DiceBear |

`User::avatar_url` prefers `/avatars/{file}` (web root). Legacy files on the Laravel `public` disk still map to `/storage/{file}`.

## Key files

| Area | Path |
|------|------|
| Update / delete | `app/Http/Controllers/ProfileController.php` |
| URL accessors | `app/Models/User.php` (`avatar_url`, `has_custom_avatar`) |
| UI | `resources/js/pages/profile.tsx` |
| Shared props | `HandleInertiaRequests` appends `avatar_url`, `has_custom_avatar` |
| Tests | `tests/Feature/CyberProfileTest.php` |

## How to extend

1. Keep avatar binaries out of git (`public/avatars/.gitignore`).
2. Delete from both `public_web` and `public` disks when clearing (legacy compat).
3. Prefer root-relative URLs — do not build avatar URLs from `APP_URL` (avoids mixed-content / wrong-host breakage).

## Tests

- Upload → `avatar_path` set, file on `public_web`, URL starts with `/avatars/`
- Remove → file gone, DiceBear URL restored
- Legacy → `/storage/...` when file only exists on `public` disk

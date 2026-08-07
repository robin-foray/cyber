---
name: foray-auth-gate
description: Foray private auth gate. Use when changing login-on-index, removing registration, protecting public routes behind auth, or admin-only access.
---

# Foray Auth Gate (private site)

The site is **private**: guests only see the login gate; the full cyber shell requires an authenticated **admin** session. Public registration is disabled.

## Behavior

| Actor | `/` (home) | Rest of site |
|-------|------------|--------------|
| Guest | Standalone `auth/login` (no CyberShell) | Redirect → `route('home')` |
| Admin (authenticated) | `welcome` inside CyberShell | Full access |
| Non-admin credentials | Login rejected (`auth.failed`) | — |

- Registration routes (`/register`) are **removed** (404). Dead page/controller files are deleted so Vite does not emit `register-*.js`.
- Password reset routes (`/forgot-password`, `/reset-password`) are **removed** (404). Dead page/controller files are deleted so Vite does not emit `forgot-password-*.js` / `reset-password-*.js`.
- `/login` GET redirects to `/`.
- POST `/login` (`login.store`) remains for the form.
- Single operator account: `AdminUserSeeder` + `config/foray.php` / `FORAY_ADMIN_*`.
- Auth pages kept: `auth/login`, `auth/confirm-password`, `auth/verify-email`.

## Key files

| Area | Path |
|------|------|
| Index dual render | `routes/web.php` (`/` → login or welcome) |
| Auth routes | `routes/auth.php` (no register) |
| Guest/user redirects | `bootstrap/app.php` (`redirectGuestsTo` / `redirectUsersTo` → home) |
| Admin-only login | `app/Http/Requests/Auth/LoginRequest.php` |
| Post-login / logout | `AuthenticatedSessionController` → `route('home')` |
| Login UI | `resources/js/pages/auth/login.tsx` — full-screen gate, **not** wrapped in CyberShell; no reset link |
| Logout UI | Cyber sidebar `DISCONNECT`, topbar `Disconnect`, profile `Disconnect_Session` → POST `route('logout')` |
| Profile avatar | `/profile` — upload custom image (`avatar_path` on `public` disk) or DiceBear `avatar_seed`; `Reseed` / `Clear`; live preview |
| Seed admin | `database/seeders/AdminUserSeeder.php` |

## How to extend

1. Keep new public pages inside `Route::middleware(['auth'])` in `web.php`.
2. Feature tests: guests `assertRedirect(route('home'))`; happy path `actingAs(User::factory()->admin()->create())`.
3. Do **not** re-enable registration without an explicit product decision.
4. Production: set strong `FORAY_ADMIN_PASSWORD` and run `php artisan foray:install` (or seed `AdminUserSeeder`).
5. If every route 404s on Apache: DocumentRoot → `public/`, `a2enmod rewrite`, `AllowOverride All` (see `README.md` / `deploy/apache-vhost.conf.example`).

## Tests

- `tests/Feature/Auth/AuthenticationTest.php` — index login, admin auth, member reject
- `tests/Feature/Auth/RegistrationTest.php` — register 404
- Catalog / DevTools feature tests assert auth gate

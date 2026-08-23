---
name: foray-dynamic-qr
description: Foray dynamic QR redirect links with fixed public hash URL and admin-controlled destination. Use when editing /qr-links page, QrLinkResource, QR style presets, or /q/{slug} redirects.
---

# Foray Dynamic QR

Physical QR codes encode a **fixed Foray URL** with an opaque hash; the redirect target changes in admin/UI without reprinting.

## Flow

1. Admin creates link at `/qr-links` (auth) or Filament **Statisztika → Dinamikus QR linkek**
2. Permanent URL: `{FORAY_QR_PUBLIC_BASE_URL}/q/{hash}` (16 hex chars, auto-generated, **immutable**)
3. Edit anytime: name, destination_url, notes, is_active — hash never changes
4. Pick a **QR style preset** (client-side) for preview/download — preference stored in `localStorage` per link
5. Delete removes the link (printed QR stops resolving)
6. Public `GET /q/{slug}` → 302 away + scan log

## Ownership

Each QR link belongs to the user who created it (`created_by`). Users only see and manage their own links:

- Cyber `/qr-links` — `QrLink::ownedBy(auth user)` query
- Route model binding — `{qrLink}` resolves only within current user's links (404 otherwise)
- Filament — `QrLinkResource::getEloquentQuery()` scoped to `Auth::id()`

Public `/q/{hash}` redirect is global (anyone with the printed QR can scan).

## Models

- `QrLink` — name, slug (hash), destination_url, notes, scan_count, is_active
- `QrLinkScan` — audit trail (destination at scan time, IP, UA)
- Hash via `QrLink::generateUniqueHash()` on create (`slug` column kept for route compat)

## QR styles (client)

Lib: `resources/js/lib/qr-code.ts`

- `QR_STYLE_PRESETS` — named themes (colors + module shape + eye style)
- Shapes: `square` | `rounded` | `soft` | `dots` | `diamond`
- Eyes: `square` | `rounded` | `circle` | `leaf`
- `generateQrSvg` / `generateQrCodeDataUrl` render styled SVG (PNG when canvas available)
- UI picker: `resources/js/components/cyber/qr-style-picker.tsx` (`QrStylePicker`, `useQrLinkPreview`)
- Also available on `/dev-tools/qr-generator` via style select

Styles are **not** stored on the model — redirect URL is style-agnostic; choice is local per browser for print/download.

## Config

`config/foray.php` → `foray.qr.public_base_url` from `FORAY_QR_PUBLIC_BASE_URL` (default `APP_URL`)

## UI

- Cyber page: `/qr-links` — create, edit, style picker, delete, download styled QR
- Mobile: `/qr-links/mobile` — same + sticky save + style picker
- Filament: CRUD + scan relation manager (hash shown read-only; quickchart preview remains cyber default)

## Routes

| Method | Path | Name |
|--------|------|------|
| GET | `/qr-links` | `qr-links.index` |
| GET | `/qr-links/mobile` | `qr-links.mobile` |
| POST | `/qr-links` | `qr-links.store` |
| PATCH | `/qr-links/{qrLink}` | `qr-links.update` |
| DELETE | `/qr-links/{qrLink}` | `qr-links.destroy` |
| GET | `/q/{slug}` | `qr.redirect` |

## Tests

- PHPUnit: `tests/Feature/QrLinks/*`
- Vitest: `resources/js/lib/qr-code.test.ts` (presets + svg/data URL generation)

---
name: foray-dynamic-qr
description: Foray dynamic QR redirect links with fixed public hash URL, stored appearance (styles, logo, frames, embed HTML), and admin-controlled destination. Use when editing /qr-links, QrLinkResource, QR design, or /q/{slug} redirects.
---

# Foray Dynamic QR

Physical QR codes encode a **fixed Foray URL** with an opaque hash; the redirect target changes in admin/UI without reprinting.

## Flow

1. Admin creates link at `/qr-links` (auth) or Filament **Statisztika → Dinamikus QR linkek**
2. Permanent URL: `{FORAY_QR_PUBLIC_BASE_URL}/q/{hash}` (16 hex chars, auto-generated, **immutable**)
3. Edit anytime: name, destination_url, notes, is_active — hash never changes
4. Design is **stored on the model**: style preset, color/shape overrides, logo, frame, caption, and optional embed HTML
5. Download PNG / SVG / HTML from the cyber UI — HTML uses `{{qr}} {{name}} {{url}} {{caption}} {{subtitle}}`
6. Delete removes the link (printed QR stops resolving)
7. Public `GET /q/{slug}` → 302 away + scan log

## Ownership

Each QR link belongs to the user who created it (`created_by`). Users only see and manage their own links:

- Cyber `/qr-links` — `QrLink::ownedBy(auth user)` query
- Route model binding — `{qrLink}` resolves only within current user's links (404 otherwise)
- Filament — `QrLinkResource::getEloquentQuery()` scoped to `Auth::id()`

Public `/q/{hash}` redirect is global (anyone with the printed QR can scan).

## Models

- `QrLink` — name, slug (hash), destination_url, notes, logo_path, design JSON, scan_count, is_active
- `QrLinkScan` — audit trail (destination at scan time, IP, UA)
- Hash via `QrLink::generateUniqueHash()` on create (`slug` column kept for route compat)

## QR appearance (stored)

Lib: `resources/js/lib/qr-code.ts`, `qr-frame.ts`, `qr-design.ts`

- `design` JSON on `qr_links`: style_id, dark/light, module_shape, eye_style, logo_size/pad/shape, frame, caption, subtitle, embed_html
- `logo_path` on the public disk, streamed at `GET /qr-links/{qrLink}/logo`
- Frames: `bare | badge | card | banner | sticker | poster | custom`
- Logo overlay punches a center hole and uses error correction **H**
- Custom HTML preview is a sandboxed iframe; download is a standalone HTML file
- UI: `resources/js/components/cyber/qr-design-editor.tsx`
- Filament appearance section on `QrLinkResource`

The public redirect URL stays style-agnostic. Appearance is for print/preview/download.

## Config

`config/foray.php` → `foray.qr.public_base_url` from `FORAY_QR_PUBLIC_BASE_URL` (default `APP_URL`)

## UI

- Cyber page: `/qr-links` — create, edit, design studio (style/logo/HTML), delete, download PNG/SVG/HTML
- Mobile: `/qr-links/mobile` — same + sticky save
- Filament: CRUD + appearance + scan relation manager

## Routes

| Method | Path | Name |
|--------|------|------|
| GET | `/qr-links` | `qr-links.index` |
| GET | `/qr-links/mobile` | `qr-links.mobile` |
| POST | `/qr-links` | `qr-links.store` |
| POST/PATCH | `/qr-links/{qrLink}` | `qr-links.update` |
| GET | `/qr-links/{qrLink}/logo` | `qr-links.logo` |
| DELETE | `/qr-links/{qrLink}` | `qr-links.destroy` |
| GET | `/q/{slug}` | `qr.redirect` |

## Tests

- PHPUnit: `tests/Feature/QrLinks/*`
- Vitest: `resources/js/lib/qr-code.test.ts`, `qr-frame.test.ts`

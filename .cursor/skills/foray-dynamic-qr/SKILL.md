---
name: foray-dynamic-qr
description: Foray dynamic QR redirect links with fixed public URL and admin-controlled destination. Use when editing /qr-links page, QrLinkResource, or /q/{slug} redirects.
---

# Foray Dynamic QR

Physical QR codes encode a **fixed Foray URL**; the redirect target changes in admin/UI without reprinting.

## Flow

1. Admin creates link at `/qr-links` (auth) or Filament **Statisztika → Dinamikus QR linkek**
2. Permanent URL: `{FORAY_QR_PUBLIC_BASE_URL}/q/{slug}` (prod: `https://foray.hu/q/polo`)
3. Change **destination_url** anytime — scans follow the latest target
4. Public `GET /q/{slug}` → 302 away + scan log

## Models

- `QrLink` — name, slug, destination_url, scan_count
- `QrLinkScan` — audit trail (destination at scan time, IP, UA)

## Config

`config/foray.php` → `foray.qr.public_base_url` from `FORAY_QR_PUBLIC_BASE_URL` (default `APP_URL`)

## UI

- Cyber page: `/qr-links` — create, download QR PNG, update destination, copy fixed URL
- Filament: full CRUD + scan relation manager

## Tests

`tests/Feature/QrLinks/*`

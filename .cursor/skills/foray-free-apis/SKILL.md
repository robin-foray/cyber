---
name: foray-free-apis
description: Foray free public API registry. Use when editing free APIs, categories, /free-apis page, FreeApiSeeder, or Filament Free APIs resources.
---

# Foray Free APIs

- Models: `FreeApiCategory`, `FreeApi`
- Page: `resources/js/pages/free-apis/index.tsx`
- Route: `GET /free-apis` (`free-apis.index`)
- Filter: `?category={slug}` + client search / auth / CORS
- Filament group: **Free APIs** (`FreeApiCategoryResource`, `FreeApiResource`)
- Seeder: `FreeApiSeeder` (kurált lista, inspiráció: [public-apis/public-apis](https://github.com/public-apis/public-apis) + https://free-apis.github.io/#/browse)
- Tests: `tests/Feature/FreeApis/FreeApisPageTest.php`

## Public APIs expansion

Seeder categories include **Anime**, **Games & Comics**, **News**, **Art & Design**, **Music** plus extras in existing groups. Notable entries sourced from public-apis: Public APIs (GitHub catalog), Jikan, Studio Ghibli, Open Trivia DB, Hacker News, Nominatim, OpenAlex, Radio Browser.

## Fields

`url` (docs), `base_url`, `sample_endpoint`, `examples` (JSON chips: label/endpoint/hint), `auth` (`none|apiKey|oauth|bearer`), `https`, `cors`, `icon`, `is_active`

## UI

- Category filters: shared `CategoryChip`
- Cards + detail scrollIntoView
- **Interactive examples**: clickable chips auto-run Live Probe
- **Demo preview**: image / text / metric card from JSON (`resources/js/lib/free-api-demo.ts`)
- Live Probe: server-side GET via `POST /free-apis/probe` (CORS bypass)
- Copy endpoint / Open Docs

## Filament

`FreeApiResource` — Repeater for `examples`
- **Live Probe:** `POST /free-apis/probe` (`free-apis.probe`) — server-side GET proxy for registered catalog hosts only. UI panel on `/free-apis` with editable endpoint, status/timing and formatted response (`resources/js/lib/free-api-probe.ts`).

## Deploy

`php artisan migrate --seed` — FreeApiSeeder a DatabaseSeeder-ben.

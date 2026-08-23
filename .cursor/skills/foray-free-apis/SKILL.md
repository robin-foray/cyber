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

`url` (docs), `base_url`, `sample_endpoint`, `auth` (`none|apiKey|oauth|bearer`), `https`, `cors`, `icon`, `is_active`

## UI

- Category filters: shared `CategoryChip` (`resources/js/components/cyber/category-chip.tsx`) — plain buttons with `flex-wrap`, not SpecularButton (WebGL inset overflow on mobile).
- Cards: mobile 2-col full-width (same as tech-stack); detail scrollIntoView; copy sample; Try Sample / Open Docs.
- **Live Probe:** `POST /free-apis/probe` (`free-apis.probe`) — server-side GET proxy for registered catalog hosts only. UI panel on `/free-apis` with editable endpoint, status/timing and formatted response (`resources/js/lib/free-api-probe.ts`).

## Deploy

`php artisan migrate --seed` — FreeApiSeeder a DatabaseSeeder-ben.

---
name: foray-tech-stack
description: Foray tech stack registry. Use when editing tech categories/stacks, /tech-stack page, TechStackSeeder, SVG icons, or Filament Tech Stack resources.
---

# Foray Tech Stack

- Models: `TechCategory`, `TechStack`
- Page: `resources/js/pages/tech-stack/index.tsx`
- Terminal home: `resources/js/pages/welcome.tsx` ← kategorizált DB stackek + live `telemetry` / `integrity` (`WelcomeController`)
- Route: `GET /tech-stack` (`tech-stack.index`), `GET /` (`home`)
- Filter: `?category={slug}`
- Filament: TechCategoryResource, TechStackResource (FileUpload → `public/stacks`)
- Seeder: `TechStackSeeder` (zonebackend StackSeeder tartalom + SVG path)
- Icons: `public/stacks/*.svg` (svgl.app / simpleicons fallback), DB `icon` = `stacks/{slug}.svg`
- Disk: `public_web` (`config/filesystems.php`) → `public_path()`
- Tests: `TechStackPageTest`, `TechStackSeederTest`, `WelcomePageTest`

## Deploy

`php artisan migrate --seed` (vagy `db:seed`) feltölti a 26 stacket. Filamentből utána szerkeszthető.

Cards: fixed `9.5rem` width. Detail panel scrolls into view on select (`detailRef`).
Frontend: SVG path → `<img>`, legacy Lucide key → Cpu fallback.

---
name: foray-useful-sites
description: Foray useful sites link registry. Use when editing useful sites/categories, /useful-sites page, UsefulSiteSeeder, or Filament Useful Sites resources.
---

# Foray Useful Sites

- Models: `UsefulSiteCategory`, `UsefulSite`
- Page: `resources/js/pages/useful-sites/index.tsx`
- Route: `GET /useful-sites` (`useful-sites.index`)
- Filter: `?category={slug}`
- Filament: UsefulSiteCategoryResource, UsefulSiteResource
- Seeder: `UsefulSiteSeeder`
- Tests: `tests/Feature/UsefulSites/UsefulSitesPageTest.php`

Cards open detail panel (scrollIntoView); Open Site / double-click opens external URL.

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
- Seeder: `UsefulSiteSeeder` (includes **GitHub Essentials**: Public APIs + curated learning/interview repos)
- Tests: `tests/Feature/UsefulSites/UsefulSitesPageTest.php`, `CatalogSeederTest`

Cards open detail panel (scrollIntoView); Open Site / double-click opens external URL.

## GitHub Essentials category

Seeded under slug `github-essentials`. Notable entries: Public APIs, Build Your Own X, Developer Roadmap, System Design Primer, Coding Interview University, Tech Interview Handbook, You Don't Know JS, The Book of Secret Knowledge.

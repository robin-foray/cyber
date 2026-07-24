---
name: foray-machines
description: Foray machine gallery (masonry). Use when editing machines, machine categories, /machines page, MachineSeeder, or Filament Machines resources.
---

# Foray Machines

- Models: `Machine`, `MachineCategory`
- Page: `resources/js/pages/machines/gallery.tsx` + `components/cyber/masonry.tsx`
- Route: `GET /machines` (`machines.index`)
- Filter: `?category={slug}`
- Filament: MachineCategoryResource, MachineResource
- Seeder: `MachineSeeder`
- Tests: `tests/Feature/Machines/MachineGalleryTest.php`

Extend: add category/machine via Filament or seeder; masonry items need `img`, `height`, `title`.

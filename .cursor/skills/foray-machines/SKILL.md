---
name: foray-machines
description: Foray machine gallery (masonry). Use when editing machines, machine categories, /machines page, MachineSeeder, or Filament Machines resources.
---

# Foray Machines

- Models: `Machine`, `MachineCategory`
- Page: `resources/js/pages/machines/gallery.tsx` + `components/cyber/masonry.tsx`
- Lightbox: `components/cyber/machine-lightbox.tsx` — mobile fullscreen (object-contain, swipe-down close, safe-area); desktop centered dialog
- Route: `GET /machines` (`machines.index`)
- Filter: `?category={slug}`
- Filament: MachineCategoryResource, MachineResource
- Seeder: `MachineSeeder`
- Tests: `tests/Feature/Machines/MachineGalleryTest.php`

Extend: add category/machine via Filament or seeder; masonry items need `img`, `height`, `title`.

## Mobile image viewer

Do **not** reuse the old inset card modal on phones. Open machines via `MachineLightbox` (portal to `document.body`) so the photo is full-bleed / contain and details sit in a bottom panel.

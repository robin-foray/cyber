---
name: foray-admin-packages
description: Foray Filament admin packages — dashboard metric widgets, Spatie activity log UI, Excel exports, sticky header. Use when editing admin dashboard widgets, activity logging on CMS models, ExportBulkAction, or AdminPanelProvider plugins.
---

# Foray Admin Packages

## Installed packages

| Package | Role |
|---------|------|
| `laboiteacode/filament-dashboard-widgets` | Metric / breakdown / recent-item dashboard widgets |
| `alizharb/filament-activity-log` | Filament UI over `spatie/laravel-activitylog` |
| `pxlrbt/filament-excel` | Table `ExportBulkAction` (xlsx) |
| `awcodes/filament-sticky-header` | Sticky floating admin topbar |

## Panel wiring

`app/Providers/Filament/AdminPanelProvider.php`:

- Plugins: `FilamentDashboardWidgetsPlugin`, `StickyHeaderPlugin` (floating+colored), `ActivityLogPlugin` (nav group `Rendszer`)
- Theme: `resources/css/filament/admin/theme.css` via `viteTheme()` (Vite input in `vite.config.js`)
- Dashboard widgets: `MachinesMetricWidget`, `UsefulSitesMetricWidget`, `FreeApisMetricWidget`, `TechStacksMetricWidget`, `ContentInventoryBreakdownWidget`, `RecentMachinesWidget`

## Activity logging

- Trait: `App\Models\Concerns\LogsCmsActivity` (fillable + dirty only)
- Applied on: `Machine`, `UsefulSite`, `FreeApi`, `TechStack`, `NavigationItem`
- Causers: `User` uses `CausesActivity`
- Config: `config/activitylog.php`, `config/filament-activity-log.php`
- Admin UI: `/admin/activity-logs`

## Excel export

`ExportBulkAction::make()` on catalog tables:

- `MachineResource`, `UsefulSiteResource`, `FreeApiResource`, `TechStackResource`

## Extend

1. New metric → widget under `app/Filament/Widgets/` extending `MetricWidget` / `BreakdownWidget` / `RecentItemsWidget`, register in `AdminPanelProvider::widgets()`
2. New logged model → `use LogsCmsActivity` on the Eloquent model
3. New exportable table → add `use pxlrbt\FilamentExcel\Actions\ExportBulkAction` to `toolbarActions`

## Tests

`tests/Feature/Admin/FilamentPackagesTest.php` — dashboard widgets, activity-logs route, CMS create → activity row, catalog list pages.

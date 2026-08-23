---
name: foray-admin-packages
description: Foray Filament admin packages — dashboard metric widgets, Spatie activity log UI, Excel exports, sticky header, Google Analytics, environment indicator, spotlight, jobs monitor, exception viewer. Use when editing admin dashboard widgets, activity logging on CMS models, ExportBulkAction, GA stats, queue monitors, exceptions, or AdminPanelProvider plugins.
---

# Foray Admin Packages

## Installed packages

| Package | Role |
|---------|------|
| `laboiteacode/filament-dashboard-widgets` | Metric / breakdown / recent-item dashboard widgets |
| `alizharb/filament-activity-log` | Filament UI over `spatie/laravel-activitylog` |
| `pxlrbt/filament-excel` | Table `ExportBulkAction` (xlsx) |
| `awcodes/filament-sticky-header` | Sticky floating admin topbar |
| `bezhansalleh/filament-google-analytics` | GA4 stats dashboard + widgets (`spatie/laravel-analytics`) |
| `pxlrbt/filament-environment-indicator` | Env badge / border + debug warning in production |
| `pxlrbt/filament-spotlight` | ⌘K / Ctrl+K command palette for resources |
| `croustibat/filament-jobs-monitor` | Queue job monitor (all drivers) |
| `bezhansalleh/filament-exceptions` | Persisted exception viewer in admin |

## Panel wiring

`app/Providers/Filament/AdminPanelProvider.php`:

- Plugins: `FilamentDashboardWidgetsPlugin`, `StickyHeaderPlugin` (floating+colored), `GoogleAnalyticsPlugin`, `EnvironmentIndicatorPlugin` (admin-visible, git branch, prod debug warning), `SpotlightPlugin`, `FilamentJobsMonitorPlugin` (nav group `Rendszer`), `FilamentExceptionsPlugin` (nav group `Rendszer`), `ActivityLogPlugin` (nav group `Rendszer`)
- Theme: `resources/css/filament/admin/theme.css` via `viteTheme()` (Vite input in `vite.config.js`)
- Dashboard widgets: `MachinesMetricWidget`, `UsefulSitesMetricWidget`, `FreeApisMetricWidget`, `TechStacksMetricWidget`, `ContentInventoryBreakdownWidget`, `RecentMachinesWidget`

## Google Analytics

- Page: `App\Filament\Pages\AnalyticsDashboard` (nav group **Statisztika**) → `/admin/analytics-dashboard`
- Config: `config/google-analytics.php` (`dedicated_dashboard` = false — custom page owns nav), `config/analytics.php`
- Env: `ANALYTICS_PROPERTY_ID`
- Credentials: `storage/app/analytics/service-account-credentials.json` (gitignored; see Spatie laravel-analytics docs)
- Theme `@source` includes the GA package views/widgets

## Activity logging

- Trait: `App\Models\Concerns\LogsCmsActivity` (fillable + dirty only)
- Applied on: `Machine`, `UsefulSite`, `FreeApi`, `TechStack`, `NavigationItem`
- Causers: `User` uses `CausesActivity`
- Config: `config/activitylog.php`, `config/filament-activity-log.php`
- Admin UI: `/admin/activity-logs`

## Queue monitor & exceptions

- Jobs: `/admin/queue-monitors` — config `config/filament-jobs-monitor.php`
- Exceptions: `/admin/exceptions` — `php artisan exceptions:install` already run
- Both under nav group **Rendszer**

## Excel export

`ExportBulkAction::make()` on catalog tables:

- `MachineResource`, `UsefulSiteResource`, `FreeApiResource`, `TechStackResource`

## Extend

1. New metric → widget under `app/Filament/Widgets/` extending `MetricWidget` / `BreakdownWidget` / `RecentItemsWidget`, register in `AdminPanelProvider::widgets()`
2. New logged model → `use LogsCmsActivity` on the Eloquent model
3. New exportable table → add `use pxlrbt\FilamentExcel\Actions\ExportBulkAction` to `toolbarActions`
4. GA widgets → enable `filament_dashboard` / `global` flags in `config/google-analytics.php`

## Tests

`tests/Feature/Admin/FilamentPackagesTest.php` — dashboard widgets, activity-logs route, CMS create → activity row, catalog list pages, analytics dashboard, queue-monitors, exceptions.

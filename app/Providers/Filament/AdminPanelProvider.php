<?php

namespace App\Providers\Filament;

use AlizHarb\ActivityLog\ActivityLogPlugin;
use App\Filament\Widgets\ContentInventoryBreakdownWidget;
use App\Filament\Widgets\FreeApisMetricWidget;
use App\Filament\Widgets\MachinesMetricWidget;
use App\Filament\Widgets\RecentMachinesWidget;
use App\Filament\Widgets\TechStacksMetricWidget;
use App\Filament\Widgets\UsefulSitesMetricWidget;
use Awcodes\StickyHeader\StickyHeaderPlugin;
use BezhanSalleh\GoogleAnalytics\GoogleAnalyticsPlugin;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use LaBoiteACode\FilamentDashboardWidgets\FilamentDashboardWidgetsPlugin;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->login()
            ->brandName('Foray Admin')
            ->brandLogo(asset('logo.svg'))
            ->brandLogoHeight('2.25rem')
            ->favicon(asset('favicon.svg'))
            ->colors([
                'primary' => '#ccff00',
            ])
            ->plugins([
                FilamentDashboardWidgetsPlugin::make(),
                StickyHeaderPlugin::make()->floating()->colored(),
                GoogleAnalyticsPlugin::make(),
                ActivityLogPlugin::make()
                    ->label('Log')
                    ->pluralLabel('Activity logs')
                    ->navigationGroup('Rendszer')
                    ->navigationSort(90),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                AccountWidget::class,
                MachinesMetricWidget::class,
                UsefulSitesMetricWidget::class,
                FreeApisMetricWidget::class,
                TechStacksMetricWidget::class,
                ContentInventoryBreakdownWidget::class,
                RecentMachinesWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}

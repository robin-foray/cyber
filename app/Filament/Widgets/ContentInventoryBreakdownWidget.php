<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\FreeApis\FreeApiResource;
use App\Filament\Resources\Machines\MachineResource;
use App\Filament\Resources\NavigationItems\NavigationItemResource;
use App\Filament\Resources\TechStacks\TechStackResource;
use App\Filament\Resources\UsefulSites\UsefulSiteResource;
use App\Models\FreeApi;
use App\Models\Machine;
use App\Models\NavigationItem;
use App\Models\TechStack;
use App\Models\UsefulSite;
use LaBoiteACode\FilamentDashboardWidgets\Data\BreakdownItem;
use LaBoiteACode\FilamentDashboardWidgets\Widgets\BreakdownWidget;

class ContentInventoryBreakdownWidget extends BreakdownWidget
{
    protected static ?int $sort = 5;

    protected ?string $heading = 'Content inventory';

    protected int|string|array $columnSpan = 'full';

    protected function getItems(): array
    {
        return [
            BreakdownItem::make('Machines', Machine::query()->count())
                ->icon('heroicon-o-cpu-chip')
                ->color('primary')
                ->url(MachineResource::getUrl('index')),
            BreakdownItem::make('Useful sites', UsefulSite::query()->count())
                ->icon('heroicon-o-globe-alt')
                ->color('info')
                ->url(UsefulSiteResource::getUrl('index')),
            BreakdownItem::make('Free APIs', FreeApi::query()->count())
                ->icon('heroicon-o-code-bracket')
                ->color('success')
                ->url(FreeApiResource::getUrl('index')),
            BreakdownItem::make('Tech stacks', TechStack::query()->count())
                ->icon('heroicon-o-squares-2x2')
                ->color('warning')
                ->url(TechStackResource::getUrl('index')),
            BreakdownItem::make('Navigation', NavigationItem::query()->count())
                ->icon('heroicon-o-bars-3')
                ->color('gray')
                ->url(NavigationItemResource::getUrl('index')),
        ];
    }
}

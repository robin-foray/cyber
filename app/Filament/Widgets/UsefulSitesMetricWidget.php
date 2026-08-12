<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\UsefulSites\UsefulSiteResource;
use App\Models\UsefulSite;
use LaBoiteACode\FilamentDashboardWidgets\Data\Metric;
use LaBoiteACode\FilamentDashboardWidgets\Widgets\MetricWidget;

class UsefulSitesMetricWidget extends MetricWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 1;

    protected function getMetric(): Metric
    {
        return Metric::make('Useful sites', UsefulSite::query()->count())
            ->description('Link registry')
            ->icon('heroicon-o-globe-alt')
            ->color('info')
            ->url(UsefulSiteResource::getUrl('index'));
    }
}

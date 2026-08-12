<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\FreeApis\FreeApiResource;
use App\Models\FreeApi;
use LaBoiteACode\FilamentDashboardWidgets\Data\Metric;
use LaBoiteACode\FilamentDashboardWidgets\Widgets\MetricWidget;

class FreeApisMetricWidget extends MetricWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 1;

    protected function getMetric(): Metric
    {
        return Metric::make('Free APIs', FreeApi::query()->count())
            ->description('Public API catalog')
            ->icon('heroicon-o-code-bracket')
            ->color('success')
            ->url(FreeApiResource::getUrl('index'));
    }
}

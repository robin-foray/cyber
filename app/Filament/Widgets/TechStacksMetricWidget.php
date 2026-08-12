<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\TechStacks\TechStackResource;
use App\Models\TechStack;
use LaBoiteACode\FilamentDashboardWidgets\Data\Metric;
use LaBoiteACode\FilamentDashboardWidgets\Widgets\MetricWidget;

class TechStacksMetricWidget extends MetricWidget
{
    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = 1;

    protected function getMetric(): Metric
    {
        return Metric::make('Tech stacks', TechStack::query()->count())
            ->description('Stack registry')
            ->icon('heroicon-o-squares-2x2')
            ->color('warning')
            ->url(TechStackResource::getUrl('index'));
    }
}

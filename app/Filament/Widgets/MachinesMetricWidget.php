<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Machines\MachineResource;
use App\Models\Machine;
use LaBoiteACode\FilamentDashboardWidgets\Data\Metric;
use LaBoiteACode\FilamentDashboardWidgets\Widgets\MetricWidget;

class MachinesMetricWidget extends MetricWidget
{
    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 1;

    protected function getMetric(): Metric
    {
        return Metric::make('Machines', Machine::query()->count())
            ->description('Gallery entries')
            ->icon('heroicon-o-cpu-chip')
            ->color('primary')
            ->url(MachineResource::getUrl('index'));
    }
}

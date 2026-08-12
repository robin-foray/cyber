<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Machines\MachineResource;
use App\Models\Machine;
use LaBoiteACode\FilamentDashboardWidgets\Data\RecentItem;
use LaBoiteACode\FilamentDashboardWidgets\Widgets\RecentItemsWidget;

class RecentMachinesWidget extends RecentItemsWidget
{
    protected static ?int $sort = 6;

    protected ?string $heading = 'Recent machines';

    protected int|string|array $columnSpan = 2;

    protected function getViewAllUrl(): ?string
    {
        return MachineResource::getUrl('index');
    }

    protected function getItems(): array
    {
        return Machine::query()
            ->with('category')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Machine $machine) => RecentItem::make(
                $machine->name,
                $machine->category?->name,
            )
                ->meta($machine->slug)
                ->icon('heroicon-o-cpu-chip')
                ->url(MachineResource::getUrl('edit', ['record' => $machine])))
            ->all();
    }
}

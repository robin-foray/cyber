<?php

namespace App\Filament\Resources\HomeConsoleContents\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\HomeConsoleContents\HomeConsoleContentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListHomeConsoleContents extends ListRecords
{
    protected static string $resource = HomeConsoleContentResource::class;

    protected function getHeaderActions(): array
    {
        return HomeConsoleContentResource::canCreate() ? [CreateAction::make()] : [];
    }
}

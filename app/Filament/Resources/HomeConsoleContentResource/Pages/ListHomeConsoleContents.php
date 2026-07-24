<?php

namespace App\Filament\Resources\HomeConsoleContentResource\Pages;

use App\Filament\Resources\HomeConsoleContentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListHomeConsoleContents extends ListRecords
{
    protected static string $resource = HomeConsoleContentResource::class;

    protected function getHeaderActions(): array
    {
        return HomeConsoleContentResource::canCreate() ? [Actions\CreateAction::make()] : [];
    }
}

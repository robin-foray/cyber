<?php

namespace App\Filament\Resources\FreeApis\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\FreeApis\FreeApiResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFreeApis extends ListRecords
{
    protected static string $resource = FreeApiResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

<?php

namespace App\Filament\Resources\FreeApiResource\Pages;

use App\Filament\Resources\FreeApiResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFreeApis extends ListRecords
{
    protected static string $resource = FreeApiResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

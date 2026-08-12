<?php

namespace App\Filament\Resources\MachineCategories\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\MachineCategories\MachineCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMachineCategories extends ListRecords
{
    protected static string $resource = MachineCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}

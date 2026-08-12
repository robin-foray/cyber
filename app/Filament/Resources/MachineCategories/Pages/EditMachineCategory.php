<?php

namespace App\Filament\Resources\MachineCategories\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\MachineCategories\MachineCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMachineCategory extends EditRecord
{
    protected static string $resource = MachineCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

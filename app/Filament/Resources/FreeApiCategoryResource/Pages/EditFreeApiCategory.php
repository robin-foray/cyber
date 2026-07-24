<?php

namespace App\Filament\Resources\FreeApiCategoryResource\Pages;

use App\Filament\Resources\FreeApiCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFreeApiCategory extends EditRecord
{
    protected static string $resource = FreeApiCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}

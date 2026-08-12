<?php

namespace App\Filament\Resources\FreeApiCategories\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\FreeApiCategories\FreeApiCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFreeApiCategory extends EditRecord
{
    protected static string $resource = FreeApiCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

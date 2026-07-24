<?php

namespace App\Filament\Resources\FreeApiCategoryResource\Pages;

use App\Filament\Resources\FreeApiCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFreeApiCategories extends ListRecords
{
    protected static string $resource = FreeApiCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

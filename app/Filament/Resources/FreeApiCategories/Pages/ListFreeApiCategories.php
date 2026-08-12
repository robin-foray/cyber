<?php

namespace App\Filament\Resources\FreeApiCategories\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\FreeApiCategories\FreeApiCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFreeApiCategories extends ListRecords
{
    protected static string $resource = FreeApiCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

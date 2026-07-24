<?php

namespace App\Filament\Resources\UsefulSiteCategoryResource\Pages;

use App\Filament\Resources\UsefulSiteCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUsefulSiteCategories extends ListRecords
{
    protected static string $resource = UsefulSiteCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

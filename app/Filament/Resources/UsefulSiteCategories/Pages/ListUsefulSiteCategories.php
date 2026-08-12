<?php

namespace App\Filament\Resources\UsefulSiteCategories\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\UsefulSiteCategories\UsefulSiteCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUsefulSiteCategories extends ListRecords
{
    protected static string $resource = UsefulSiteCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

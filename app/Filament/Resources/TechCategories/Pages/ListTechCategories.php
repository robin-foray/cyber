<?php

namespace App\Filament\Resources\TechCategories\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\TechCategories\TechCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTechCategories extends ListRecords
{
    protected static string $resource = TechCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

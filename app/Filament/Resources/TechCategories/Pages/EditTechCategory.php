<?php

namespace App\Filament\Resources\TechCategories\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\TechCategories\TechCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTechCategory extends EditRecord
{
    protected static string $resource = TechCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

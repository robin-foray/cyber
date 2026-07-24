<?php

namespace App\Filament\Resources\TechCategoryResource\Pages;

use App\Filament\Resources\TechCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTechCategory extends EditRecord
{
    protected static string $resource = TechCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}

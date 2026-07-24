<?php

namespace App\Filament\Resources\UsefulSiteCategoryResource\Pages;

use App\Filament\Resources\UsefulSiteCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUsefulSiteCategory extends EditRecord
{
    protected static string $resource = UsefulSiteCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}

<?php

namespace App\Filament\Resources\UsefulSiteCategories\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\UsefulSiteCategories\UsefulSiteCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUsefulSiteCategory extends EditRecord
{
    protected static string $resource = UsefulSiteCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

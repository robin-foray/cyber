<?php

namespace App\Filament\Resources\UsefulSites\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\UsefulSites\UsefulSiteResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUsefulSite extends EditRecord
{
    protected static string $resource = UsefulSiteResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

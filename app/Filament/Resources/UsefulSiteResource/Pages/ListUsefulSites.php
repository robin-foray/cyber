<?php

namespace App\Filament\Resources\UsefulSiteResource\Pages;

use App\Filament\Resources\UsefulSiteResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUsefulSites extends ListRecords
{
    protected static string $resource = UsefulSiteResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

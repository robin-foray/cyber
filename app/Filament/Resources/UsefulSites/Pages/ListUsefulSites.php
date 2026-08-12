<?php

namespace App\Filament\Resources\UsefulSites\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\UsefulSites\UsefulSiteResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUsefulSites extends ListRecords
{
    protected static string $resource = UsefulSiteResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

<?php

namespace App\Filament\Resources\HeroContentResource\Pages;

use App\Filament\Resources\HeroContentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListHeroContents extends ListRecords
{
    protected static string $resource = HeroContentResource::class;

    protected function getHeaderActions(): array
    {
        return HeroContentResource::canCreate() ? [Actions\CreateAction::make()] : [];
    }
}

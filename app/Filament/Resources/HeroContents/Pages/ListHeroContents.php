<?php

namespace App\Filament\Resources\HeroContents\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\HeroContents\HeroContentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListHeroContents extends ListRecords
{
    protected static string $resource = HeroContentResource::class;

    protected function getHeaderActions(): array
    {
        return HeroContentResource::canCreate() ? [CreateAction::make()] : [];
    }
}

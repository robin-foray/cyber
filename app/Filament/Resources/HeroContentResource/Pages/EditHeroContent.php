<?php

namespace App\Filament\Resources\HeroContentResource\Pages;

use App\Filament\Resources\HeroContentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditHeroContent extends EditRecord
{
    protected static string $resource = HeroContentResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}

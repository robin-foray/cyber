<?php

namespace App\Filament\Resources\HeroContents\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\HeroContents\HeroContentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditHeroContent extends EditRecord
{
    protected static string $resource = HeroContentResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

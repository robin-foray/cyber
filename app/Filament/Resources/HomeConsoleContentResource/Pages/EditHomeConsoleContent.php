<?php

namespace App\Filament\Resources\HomeConsoleContentResource\Pages;

use App\Filament\Resources\HomeConsoleContentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditHomeConsoleContent extends EditRecord
{
    protected static string $resource = HomeConsoleContentResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}

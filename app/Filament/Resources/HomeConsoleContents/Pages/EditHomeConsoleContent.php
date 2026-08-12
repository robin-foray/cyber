<?php

namespace App\Filament\Resources\HomeConsoleContents\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\HomeConsoleContents\HomeConsoleContentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditHomeConsoleContent extends EditRecord
{
    protected static string $resource = HomeConsoleContentResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

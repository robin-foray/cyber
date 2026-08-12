<?php

namespace App\Filament\Resources\FreeApis\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\FreeApis\FreeApiResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFreeApi extends EditRecord
{
    protected static string $resource = FreeApiResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

<?php

namespace App\Filament\Resources\FreeApiResource\Pages;

use App\Filament\Resources\FreeApiResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFreeApi extends EditRecord
{
    protected static string $resource = FreeApiResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}

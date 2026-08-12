<?php

namespace App\Filament\Resources\Machines\Pages;

use Filament\Actions\DeleteAction;
use App\Filament\Resources\Machines\MachineResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMachine extends EditRecord
{
    protected static string $resource = MachineResource::class;

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}

<?php

namespace App\Filament\Resources\StackTechnologyResource\Pages;

use App\Filament\Resources\StackTechnologyResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageStackTechnologies extends ManageRecords
{
    protected static string $resource = StackTechnologyResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

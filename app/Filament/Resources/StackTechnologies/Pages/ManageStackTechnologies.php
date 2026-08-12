<?php

namespace App\Filament\Resources\StackTechnologies\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\StackTechnologies\StackTechnologyResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageStackTechnologies extends ManageRecords
{
    protected static string $resource = StackTechnologyResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

<?php

namespace App\Filament\Resources\DeploymentStepResource\Pages;

use App\Filament\Resources\DeploymentStepResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageDeploymentSteps extends ManageRecords
{
    protected static string $resource = DeploymentStepResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

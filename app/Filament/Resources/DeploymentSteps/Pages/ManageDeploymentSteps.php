<?php

namespace App\Filament\Resources\DeploymentSteps\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\DeploymentSteps\DeploymentStepResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageDeploymentSteps extends ManageRecords
{
    protected static string $resource = DeploymentStepResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

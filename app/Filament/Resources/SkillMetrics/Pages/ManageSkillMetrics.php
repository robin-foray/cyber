<?php

namespace App\Filament\Resources\SkillMetrics\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\SkillMetrics\SkillMetricResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageSkillMetrics extends ManageRecords
{
    protected static string $resource = SkillMetricResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

<?php

namespace App\Filament\Resources\SkillMetricResource\Pages;

use App\Filament\Resources\SkillMetricResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageSkillMetrics extends ManageRecords
{
    protected static string $resource = SkillMetricResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

<?php

namespace App\Filament\Resources\TickerMessages\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\TickerMessages\TickerMessageResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageTickerMessages extends ManageRecords
{
    protected static string $resource = TickerMessageResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}

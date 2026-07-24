<?php

namespace App\Filament\Resources\TickerMessageResource\Pages;

use App\Filament\Resources\TickerMessageResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageTickerMessages extends ManageRecords
{
    protected static string $resource = TickerMessageResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

<?php

namespace App\Filament\Resources\GuestPasses\Pages;

use App\Filament\Resources\GuestPasses\GuestPassResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListGuestPasses extends ListRecords
{
    protected static string $resource = GuestPassResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}

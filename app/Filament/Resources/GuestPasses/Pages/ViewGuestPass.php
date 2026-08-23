<?php

namespace App\Filament\Resources\GuestPasses\Pages;

use App\Filament\Resources\GuestPasses\GuestPassResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewGuestPass extends ViewRecord
{
    protected static string $resource = GuestPassResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}

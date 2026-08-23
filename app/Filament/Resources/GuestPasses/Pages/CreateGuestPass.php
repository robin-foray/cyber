<?php

namespace App\Filament\Resources\GuestPasses\Pages;

use App\Filament\Resources\GuestPasses\GuestPassResource;
use Filament\Resources\Pages\CreateRecord;

class CreateGuestPass extends CreateRecord
{
    protected static string $resource = GuestPassResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return GuestPassResource::mutateFormDataBeforeCreate($data);
    }
}

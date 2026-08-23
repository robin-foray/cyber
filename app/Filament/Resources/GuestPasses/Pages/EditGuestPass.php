<?php

namespace App\Filament\Resources\GuestPasses\Pages;

use App\Filament\Resources\GuestPasses\GuestPassResource;
use Filament\Resources\Pages\EditRecord;

class EditGuestPass extends EditRecord
{
    protected static string $resource = GuestPassResource::class;
}

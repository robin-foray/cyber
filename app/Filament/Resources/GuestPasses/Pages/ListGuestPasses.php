<?php

namespace App\Filament\Resources\GuestPasses\Pages;

use App\Filament\Resources\GuestPasses\GuestPassResource;
use Filament\Resources\Pages\ListRecords;

class ListGuestPasses extends ListRecords
{
    protected static string $resource = GuestPassResource::class;
}

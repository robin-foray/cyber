<?php

namespace App\Filament\Resources\DevToolPages\Pages;

use App\Filament\Resources\DevToolPages\DevToolPageResource;
use Filament\Resources\Pages\EditRecord;
use Filament\Resources\Pages\ManageRecords;

class ManageDevToolPages extends ManageRecords
{
    protected static string $resource = DevToolPageResource::class;
}

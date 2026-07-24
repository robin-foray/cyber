<?php

namespace App\Filament\Resources\DevToolPageResource\Pages;

use App\Filament\Resources\DevToolPageResource;
use Filament\Resources\Pages\EditRecord;
use Filament\Resources\Pages\ManageRecords;

class ManageDevToolPages extends ManageRecords
{
    protected static string $resource = DevToolPageResource::class;
}

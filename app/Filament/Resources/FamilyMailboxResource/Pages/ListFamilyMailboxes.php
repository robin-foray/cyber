<?php

namespace App\Filament\Resources\FamilyMailboxResource\Pages;

use App\Filament\Resources\FamilyMailboxResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFamilyMailboxes extends ListRecords
{
    protected static string $resource = FamilyMailboxResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}

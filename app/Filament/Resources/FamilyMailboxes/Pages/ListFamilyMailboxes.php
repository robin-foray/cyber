<?php

namespace App\Filament\Resources\FamilyMailboxes\Pages;

use App\Filament\Resources\FamilyMailboxes\FamilyMailboxResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFamilyMailboxes extends ListRecords
{
    protected static string $resource = FamilyMailboxResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}

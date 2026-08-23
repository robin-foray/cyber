<?php

namespace App\Filament\Resources\FamilyMailboxes\Pages;

use App\Filament\Resources\FamilyMailboxes\FamilyMailboxResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFamilyMailbox extends EditRecord
{
    protected static string $resource = FamilyMailboxResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

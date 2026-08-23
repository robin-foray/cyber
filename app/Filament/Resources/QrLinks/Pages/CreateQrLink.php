<?php

namespace App\Filament\Resources\QrLinks\Pages;

use App\Filament\Resources\QrLinks\QrLinkResource;
use Filament\Resources\Pages\CreateRecord;

class CreateQrLink extends CreateRecord
{
    protected static string $resource = QrLinkResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return QrLinkResource::mutateFormDataBeforeCreate($data);
    }
}

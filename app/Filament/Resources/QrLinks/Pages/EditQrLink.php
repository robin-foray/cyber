<?php

namespace App\Filament\Resources\QrLinks\Pages;

use App\Filament\Resources\QrLinks\QrLinkResource;
use Filament\Resources\Pages\EditRecord;

class EditQrLink extends EditRecord
{
    protected static string $resource = QrLinkResource::class;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function mutateFormDataBeforeSave(array $data): array
    {
        return QrLinkResource::mutateFormDataBeforeSave($data);
    }
}

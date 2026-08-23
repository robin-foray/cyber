<?php

namespace App\Filament\Resources\QrLinks\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ScansRelationManager extends RelationManager
{
    protected static string $relationship = 'scans';

    protected static ?string $title = 'Scan napló';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('scanned_at')->dateTime('Y-m-d H:i:s')->sortable(),
                TextColumn::make('destination_url')->limit(50)->copyable(),
                TextColumn::make('ip_address')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('scanned_at', 'desc')
            ->paginated([10, 25, 50]);
    }
}

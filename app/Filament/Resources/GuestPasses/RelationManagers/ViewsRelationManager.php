<?php

namespace App\Filament\Resources\GuestPasses\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ViewsRelationManager extends RelationManager
{
    protected static string $relationship = 'views';

    protected static ?string $title = 'Megtekintési napló';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('viewed_at')
                    ->label('Időpont')
                    ->dateTime('Y-m-d H:i:s')
                    ->sortable(),
                TextColumn::make('page_label')
                    ->label('Oldal')
                    ->searchable(),
                TextColumn::make('path')
                    ->label('Útvonal')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('route_name')
                    ->label('Route')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('viewed_at', 'desc')
            ->paginated([10, 25, 50]);
    }
}

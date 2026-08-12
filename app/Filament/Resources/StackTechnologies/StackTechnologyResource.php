<?php

namespace App\Filament\Resources\StackTechnologies;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use App\Filament\Resources\StackTechnologies\Pages\ManageStackTechnologies;
use App\Models\StackTechnology;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class StackTechnologyResource extends Resource
{
    protected static ?string $model = StackTechnology::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-squares-2x2';

    protected static string | \UnitEnum | null $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Tech stack';

    protected static ?string $modelLabel = 'Stack elem';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required(),
            TextInput::make('signal')->required(),
            Textarea::make('summary')->rows(3)->required(),
            TagsInput::make('bullets')->label('Bullet pontok')->required(),
            TextInput::make('docs_url')->label('Dokumentáció URL')->url()->required(),
            TextInput::make('icon')->label('Lucide ikon')->required(),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('signal'),
                TextColumn::make('sort_order')->sortable(),
                IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageStackTechnologies::route('/'),
        ];
    }
}

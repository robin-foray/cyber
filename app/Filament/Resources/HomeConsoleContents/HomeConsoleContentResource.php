<?php

namespace App\Filament\Resources\HomeConsoleContents;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
use App\Filament\Resources\HomeConsoleContents\Pages\ListHomeConsoleContents;
use App\Filament\Resources\HomeConsoleContents\Pages\CreateHomeConsoleContent;
use App\Filament\Resources\HomeConsoleContents\Pages\EditHomeConsoleContent;
use App\Models\HomeConsoleContent;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class HomeConsoleContentResource extends Resource
{
    protected static ?string $model = HomeConsoleContent::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-command-line';

    protected static string | \UnitEnum | null $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Dev konzol preview';

    protected static ?string $modelLabel = 'Dev konzol';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('section_label')->label('Szekció címke')->required(),
            Textarea::make('input_sample')->label('Input minta')->rows(4)->required(),
            Textarea::make('output_sample')->label('Output minta')->rows(4)->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('section_label')->label('Címke'),
            ])
            ->recordActions([EditAction::make()]);
    }

    public static function canCreate(): bool
    {
        return HomeConsoleContent::query()->count() === 0;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListHomeConsoleContents::route('/'),
            'create' => CreateHomeConsoleContent::route('/create'),
            'edit' => EditHomeConsoleContent::route('/{record}/edit'),
        ];
    }
}

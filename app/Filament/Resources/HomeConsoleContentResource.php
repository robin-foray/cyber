<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HomeConsoleContentResource\Pages;
use App\Models\HomeConsoleContent;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class HomeConsoleContentResource extends Resource
{
    protected static ?string $model = HomeConsoleContent::class;

    protected static ?string $navigationIcon = 'heroicon-o-command-line';

    protected static ?string $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Dev konzol preview';

    protected static ?string $modelLabel = 'Dev konzol';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('section_label')->label('Szekció címke')->required(),
            Forms\Components\Textarea::make('input_sample')->label('Input minta')->rows(4)->required(),
            Forms\Components\Textarea::make('output_sample')->label('Output minta')->rows(4)->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('section_label')->label('Címke'),
            ])
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function canCreate(): bool
    {
        return HomeConsoleContent::query()->count() === 0;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListHomeConsoleContents::route('/'),
            'create' => Pages\CreateHomeConsoleContent::route('/create'),
            'edit' => Pages\EditHomeConsoleContent::route('/{record}/edit'),
        ];
    }
}

<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroContentResource\Pages;
use App\Models\HeroContent;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class HeroContentResource extends Resource
{
    protected static ?string $model = HeroContent::class;

    protected static ?string $navigationIcon = 'heroicon-o-sparkles';

    protected static ?string $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Hero szekció';

    protected static ?string $modelLabel = 'Hero';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('badge')->label('Badge szöveg')->required(),
            Forms\Components\TextInput::make('title_line')->label('Cím első sor')->required(),
            Forms\Components\TextInput::make('title_accent')->label('Kiemelt szó')->required(),
            Forms\Components\TextInput::make('cta_label')->label('Gomb felirat'),
            Forms\Components\TextInput::make('background_image')->label('Háttérkép URL')->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title_line')->label('Cím'),
                Tables\Columns\TextColumn::make('title_accent')->label('Kiemelés'),
            ])
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([]);
    }

    public static function canCreate(): bool
    {
        return HeroContent::query()->count() === 0;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListHeroContents::route('/'),
            'create' => Pages\CreateHeroContent::route('/create'),
            'edit' => Pages\EditHeroContent::route('/{record}/edit'),
        ];
    }
}

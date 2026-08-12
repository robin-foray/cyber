<?php

namespace App\Filament\Resources\HeroContents;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
use App\Filament\Resources\HeroContents\Pages\ListHeroContents;
use App\Filament\Resources\HeroContents\Pages\CreateHeroContent;
use App\Filament\Resources\HeroContents\Pages\EditHeroContent;
use App\Models\HeroContent;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class HeroContentResource extends Resource
{
    protected static ?string $model = HeroContent::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-sparkles';

    protected static string | \UnitEnum | null $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Hero szekció';

    protected static ?string $modelLabel = 'Hero';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('badge')->label('Badge szöveg')->required(),
            TextInput::make('title_line')->label('Cím első sor')->required(),
            TextInput::make('title_accent')->label('Kiemelt szó')->required(),
            TextInput::make('cta_label')->label('Gomb felirat'),
            TextInput::make('background_image')->label('Háttérkép URL')->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title_line')->label('Cím'),
                TextColumn::make('title_accent')->label('Kiemelés'),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([]);
    }

    public static function canCreate(): bool
    {
        return HeroContent::query()->count() === 0;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListHeroContents::route('/'),
            'create' => CreateHeroContent::route('/create'),
            'edit' => EditHeroContent::route('/{record}/edit'),
        ];
    }
}

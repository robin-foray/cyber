<?php

namespace App\Filament\Resources\SocialLinks;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use App\Filament\Resources\SocialLinks\Pages\ManageSocialLinks;
use App\Models\SocialLink;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class SocialLinkResource extends Resource
{
    protected static ?string $model = SocialLink::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-link';

    protected static string | \UnitEnum | null $navigationGroup = 'Navigáció';

    protected static ?string $navigationLabel = 'Social linkek';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('platform')->label('Platform')->required(),
            TextInput::make('url')->label('URL')->url(),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('platform'),
                TextColumn::make('url')->limit(30),
                IconColumn::make('is_active')->boolean(),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageSocialLinks::route('/')];
    }
}

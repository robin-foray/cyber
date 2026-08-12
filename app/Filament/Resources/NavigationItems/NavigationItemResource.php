<?php

namespace App\Filament\Resources\NavigationItems;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\NavigationItems\Pages\ListNavigationItems;
use App\Filament\Resources\NavigationItems\Pages\CreateNavigationItem;
use App\Filament\Resources\NavigationItems\Pages\EditNavigationItem;
use App\Models\NavigationItem;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class NavigationItemResource extends Resource
{
    protected static ?string $model = NavigationItem::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-bars-3';

    protected static string | \UnitEnum | null $navigationGroup = 'Navigáció';

    protected static ?string $navigationLabel = 'Menüpontok';

    protected static ?string $modelLabel = 'Menüpont';

    protected static ?string $pluralModelLabel = 'Menüpontok';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Menü beállítások')->schema([
                Select::make('parent_id')
                    ->label('Szülő menü')
                    ->relationship('parent', 'label')
                    ->searchable()
                    ->placeholder('Főmenü elem'),
                TextInput::make('label')
                    ->label('Felirat')
                    ->required()
                    ->maxLength(255),
                TextInput::make('href')
                    ->label('URL')
                    ->maxLength(255)
                    ->helperText('Dev-tools csoportnál hagyható üresen.'),
                TextInput::make('icon')
                    ->label('Lucide ikon')
                    ->maxLength(255)
                    ->helperText('Pl. Terminal, Construction, Share2'),
                TextInput::make('sort_order')
                    ->label('Sorrend')
                    ->numeric()
                    ->default(0)
                    ->required(),
                Toggle::make('is_group')
                    ->label('Csoport (almenüvel)'),
                Toggle::make('requires_auth')
                    ->label('Csak bejelentkezve'),
                Toggle::make('is_active')
                    ->label('Aktív')
                    ->default(true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')->label('Felirat')->searchable(),
                TextColumn::make('parent.label')->label('Szülő')->placeholder('—'),
                TextColumn::make('href')->label('URL')->limit(30),
                TextColumn::make('sort_order')->label('Sorrend')->sortable(),
                IconColumn::make('is_group')->label('Csoport')->boolean(),
                IconColumn::make('is_active')->label('Aktív')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNavigationItems::route('/'),
            'create' => CreateNavigationItem::route('/create'),
            'edit' => EditNavigationItem::route('/{record}/edit'),
        ];
    }
}

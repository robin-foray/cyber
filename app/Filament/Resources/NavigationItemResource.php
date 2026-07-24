<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NavigationItemResource\Pages;
use App\Models\NavigationItem;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class NavigationItemResource extends Resource
{
    protected static ?string $model = NavigationItem::class;

    protected static ?string $navigationIcon = 'heroicon-o-bars-3';

    protected static ?string $navigationGroup = 'Navigáció';

    protected static ?string $navigationLabel = 'Menüpontok';

    protected static ?string $modelLabel = 'Menüpont';

    protected static ?string $pluralModelLabel = 'Menüpontok';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Menü beállítások')->schema([
                Forms\Components\Select::make('parent_id')
                    ->label('Szülő menü')
                    ->relationship('parent', 'label')
                    ->searchable()
                    ->placeholder('Főmenü elem'),
                Forms\Components\TextInput::make('label')
                    ->label('Felirat')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('href')
                    ->label('URL')
                    ->maxLength(255)
                    ->helperText('Dev-tools csoportnál hagyható üresen.'),
                Forms\Components\TextInput::make('icon')
                    ->label('Lucide ikon')
                    ->maxLength(255)
                    ->helperText('Pl. Terminal, Construction, Share2'),
                Forms\Components\TextInput::make('sort_order')
                    ->label('Sorrend')
                    ->numeric()
                    ->default(0)
                    ->required(),
                Forms\Components\Toggle::make('is_group')
                    ->label('Csoport (almenüvel)'),
                Forms\Components\Toggle::make('requires_auth')
                    ->label('Csak bejelentkezve'),
                Forms\Components\Toggle::make('is_active')
                    ->label('Aktív')
                    ->default(true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('label')->label('Felirat')->searchable(),
                Tables\Columns\TextColumn::make('parent.label')->label('Szülő')->placeholder('—'),
                Tables\Columns\TextColumn::make('href')->label('URL')->limit(30),
                Tables\Columns\TextColumn::make('sort_order')->label('Sorrend')->sortable(),
                Tables\Columns\IconColumn::make('is_group')->label('Csoport')->boolean(),
                Tables\Columns\IconColumn::make('is_active')->label('Aktív')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNavigationItems::route('/'),
            'create' => Pages\CreateNavigationItem::route('/create'),
            'edit' => Pages\EditNavigationItem::route('/{record}/edit'),
        ];
    }
}

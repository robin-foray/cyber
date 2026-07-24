<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TickerMessageResource\Pages;
use App\Models\TickerMessage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TickerMessageResource extends Resource
{
    protected static ?string $model = TickerMessage::class;

    protected static ?string $navigationIcon = 'heroicon-o-bolt';

    protected static ?string $navigationGroup = 'Rendszer';

    protected static ?string $navigationLabel = 'Ticker üzenetek';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('location')
                ->label('Hely')
                ->options(['topbar' => 'Topbar', 'footer' => 'Footer'])
                ->required(),
            Forms\Components\TextInput::make('text')->label('Szöveg')->required(),
            Forms\Components\Toggle::make('is_highlighted')->label('Kiemelt (primary szín)'),
            Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('location')->badge(),
                Tables\Columns\TextColumn::make('text')->limit(40),
                Tables\Columns\IconColumn::make('is_highlighted')->boolean(),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ManageTickerMessages::route('/')];
    }
}

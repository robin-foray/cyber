<?php

namespace App\Filament\Resources\TickerMessages;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use App\Filament\Resources\TickerMessages\Pages\ManageTickerMessages;
use App\Models\TickerMessage;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class TickerMessageResource extends Resource
{
    protected static ?string $model = TickerMessage::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-bolt';

    protected static string | \UnitEnum | null $navigationGroup = 'Rendszer';

    protected static ?string $navigationLabel = 'Ticker üzenetek';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('location')
                ->label('Hely')
                ->options(['topbar' => 'Topbar', 'footer' => 'Footer'])
                ->required(),
            TextInput::make('text')->label('Szöveg')->required(),
            Toggle::make('is_highlighted')->label('Kiemelt (primary szín)'),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('location')->badge(),
                TextColumn::make('text')->limit(40),
                IconColumn::make('is_highlighted')->boolean(),
                TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageTickerMessages::route('/')];
    }
}

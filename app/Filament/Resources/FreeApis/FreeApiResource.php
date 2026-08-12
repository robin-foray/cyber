<?php

namespace App\Filament\Resources\FreeApis;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\FreeApis\Pages\ListFreeApis;
use App\Filament\Resources\FreeApis\Pages\CreateFreeApi;
use App\Filament\Resources\FreeApis\Pages\EditFreeApi;
use App\Models\FreeApi;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class FreeApiResource extends Resource
{
    protected static ?string $model = FreeApi::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-globe-alt';

    protected static string | \UnitEnum | null $navigationGroup = 'Free APIs';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('free_api_category_id')
                ->relationship('category', 'name')
                ->required()
                ->searchable()
                ->preload(),
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            TextInput::make('url')->url()->required()->label('Docs URL')->columnSpanFull(),
            TextInput::make('base_url')->url()->label('Base URL')->columnSpanFull(),
            TextInput::make('sample_endpoint')->url()->label('Sample endpoint')->columnSpanFull(),
            Textarea::make('summary')->rows(3)->columnSpanFull(),
            Select::make('auth')
                ->options([
                    'none' => 'No Auth',
                    'apiKey' => 'API Key',
                    'oauth' => 'OAuth',
                    'bearer' => 'Bearer',
                ])
                ->required()
                ->native(false),
            Select::make('icon')
                ->options([
                    'globe' => 'globe',
                    'code' => 'code',
                    'braces' => 'braces',
                    'package' => 'package',
                    'paw' => 'paw',
                    'zap' => 'zap',
                    'coins' => 'coins',
                    'network' => 'network',
                    'map' => 'map',
                    'cloud' => 'cloud',
                    'smile' => 'smile',
                    'message' => 'message',
                    'tv' => 'tv',
                    'rocket' => 'rocket',
                    'book' => 'book',
                    'utensils' => 'utensils',
                    'users' => 'users',
                    'graduation' => 'graduation',
                ])
                ->required()
                ->native(false),
            Toggle::make('https')->default(true),
            Toggle::make('cors')->default(false),
            TextInput::make('sort_order')->numeric()->default(0)->required(),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('category.name')->sortable(),
                TextColumn::make('auth')->badge(),
                IconColumn::make('https')->boolean(),
                IconColumn::make('cors')->boolean(),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                SelectFilter::make('free_api_category_id')
                    ->relationship('category', 'name')
                    ->label('Category'),
                SelectFilter::make('auth')
                    ->options([
                        'none' => 'No Auth',
                        'apiKey' => 'API Key',
                        'oauth' => 'OAuth',
                        'bearer' => 'Bearer',
                    ]),
                TernaryFilter::make('is_active'),
                TernaryFilter::make('cors'),
            ])
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
            'index' => ListFreeApis::route('/'),
            'create' => CreateFreeApi::route('/create'),
            'edit' => EditFreeApi::route('/{record}/edit'),
        ];
    }
}

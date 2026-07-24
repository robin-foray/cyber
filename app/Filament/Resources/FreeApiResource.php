<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FreeApiResource\Pages;
use App\Models\FreeApi;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class FreeApiResource extends Resource
{
    protected static ?string $model = FreeApi::class;

    protected static ?string $navigationIcon = 'heroicon-o-globe-alt';

    protected static ?string $navigationGroup = 'Free APIs';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('free_api_category_id')
                ->relationship('category', 'name')
                ->required()
                ->searchable()
                ->preload(),
            Forms\Components\TextInput::make('name')->required()->maxLength(255),
            Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            Forms\Components\TextInput::make('url')->url()->required()->label('Docs URL')->columnSpanFull(),
            Forms\Components\TextInput::make('base_url')->url()->label('Base URL')->columnSpanFull(),
            Forms\Components\TextInput::make('sample_endpoint')->url()->label('Sample endpoint')->columnSpanFull(),
            Forms\Components\Textarea::make('summary')->rows(3)->columnSpanFull(),
            Forms\Components\Select::make('auth')
                ->options([
                    'none' => 'No Auth',
                    'apiKey' => 'API Key',
                    'oauth' => 'OAuth',
                    'bearer' => 'Bearer',
                ])
                ->required()
                ->native(false),
            Forms\Components\Select::make('icon')
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
            Forms\Components\Toggle::make('https')->default(true),
            Forms\Components\Toggle::make('cors')->default(false),
            Forms\Components\TextInput::make('sort_order')->numeric()->default(0)->required(),
            Forms\Components\Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('category.name')->sortable(),
                Tables\Columns\TextColumn::make('auth')->badge(),
                Tables\Columns\IconColumn::make('https')->boolean(),
                Tables\Columns\IconColumn::make('cors')->boolean(),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                Tables\Filters\SelectFilter::make('free_api_category_id')
                    ->relationship('category', 'name')
                    ->label('Category'),
                Tables\Filters\SelectFilter::make('auth')
                    ->options([
                        'none' => 'No Auth',
                        'apiKey' => 'API Key',
                        'oauth' => 'OAuth',
                        'bearer' => 'Bearer',
                    ]),
                Tables\Filters\TernaryFilter::make('is_active'),
                Tables\Filters\TernaryFilter::make('cors'),
            ])
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
            'index' => Pages\ListFreeApis::route('/'),
            'create' => Pages\CreateFreeApi::route('/create'),
            'edit' => Pages\EditFreeApi::route('/{record}/edit'),
        ];
    }
}

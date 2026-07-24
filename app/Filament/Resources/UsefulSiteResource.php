<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UsefulSiteResource\Pages;
use App\Models\UsefulSite;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UsefulSiteResource extends Resource
{
    protected static ?string $model = UsefulSite::class;

    protected static ?string $navigationIcon = 'heroicon-o-link';

    protected static ?string $navigationGroup = 'Useful Sites';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('useful_site_category_id')
                ->relationship('category', 'name')
                ->required()
                ->searchable()
                ->preload(),
            Forms\Components\TextInput::make('name')->required()->maxLength(255),
            Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            Forms\Components\TextInput::make('url')->url()->required()->columnSpanFull(),
            Forms\Components\Textarea::make('summary')->rows(3)->columnSpanFull(),
            Forms\Components\Select::make('icon')
                ->options([
                    'film' => 'film',
                    'image' => 'image',
                    'layout' => 'layout',
                    'layers' => 'layers',
                    'pen' => 'pen',
                    'box' => 'box',
                    'package' => 'package',
                    'globe' => 'globe',
                    'code' => 'code',
                    'braces' => 'braces',
                    'link' => 'link',
                ])
                ->required()
                ->native(false),
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
                Tables\Columns\TextColumn::make('url')->limit(40)->url(fn (UsefulSite $record) => $record->url, true),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                Tables\Filters\SelectFilter::make('useful_site_category_id')
                    ->relationship('category', 'name')
                    ->label('Category'),
                Tables\Filters\TernaryFilter::make('is_active'),
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
            'index' => Pages\ListUsefulSites::route('/'),
            'create' => Pages\CreateUsefulSite::route('/create'),
            'edit' => Pages\EditUsefulSite::route('/{record}/edit'),
        ];
    }
}

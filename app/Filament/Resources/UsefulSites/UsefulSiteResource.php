<?php

namespace App\Filament\Resources\UsefulSites;

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
use App\Filament\Resources\UsefulSites\Pages\ListUsefulSites;
use App\Filament\Resources\UsefulSites\Pages\CreateUsefulSite;
use App\Filament\Resources\UsefulSites\Pages\EditUsefulSite;
use App\Models\UsefulSite;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class UsefulSiteResource extends Resource
{
    protected static ?string $model = UsefulSite::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-link';

    protected static string | \UnitEnum | null $navigationGroup = 'Useful Sites';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('useful_site_category_id')
                ->relationship('category', 'name')
                ->required()
                ->searchable()
                ->preload(),
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            TextInput::make('url')->url()->required()->columnSpanFull(),
            Textarea::make('summary')->rows(3)->columnSpanFull(),
            Select::make('icon')
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
                TextColumn::make('url')->limit(40)->url(fn (UsefulSite $record) => $record->url, true),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                SelectFilter::make('useful_site_category_id')
                    ->relationship('category', 'name')
                    ->label('Category'),
                TernaryFilter::make('is_active'),
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
            'index' => ListUsefulSites::route('/'),
            'create' => CreateUsefulSite::route('/create'),
            'edit' => EditUsefulSite::route('/{record}/edit'),
        ];
    }
}

<?php

namespace App\Filament\Resources\UsefulSiteCategories;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\UsefulSiteCategories\Pages\ListUsefulSiteCategories;
use App\Filament\Resources\UsefulSiteCategories\Pages\CreateUsefulSiteCategory;
use App\Filament\Resources\UsefulSiteCategories\Pages\EditUsefulSiteCategory;
use App\Models\UsefulSiteCategory;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class UsefulSiteCategoryResource extends Resource
{
    protected static ?string $model = UsefulSiteCategory::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-folder';

    protected static string | \UnitEnum | null $navigationGroup = 'Useful Sites';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            Textarea::make('description')->rows(3)->columnSpanFull(),
            TextInput::make('sort_order')->numeric()->default(0)->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('slug'),
                TextColumn::make('sites_count')->counts('sites')->label('Sites'),
                TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
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
            'index' => ListUsefulSiteCategories::route('/'),
            'create' => CreateUsefulSiteCategory::route('/create'),
            'edit' => EditUsefulSiteCategory::route('/{record}/edit'),
        ];
    }
}

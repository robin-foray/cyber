<?php

namespace App\Filament\Resources\FreeApiCategories;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ColorColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\FreeApiCategories\Pages\ListFreeApiCategories;
use App\Filament\Resources\FreeApiCategories\Pages\CreateFreeApiCategory;
use App\Filament\Resources\FreeApiCategories\Pages\EditFreeApiCategory;
use App\Models\FreeApiCategory;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class FreeApiCategoryResource extends Resource
{
    protected static ?string $model = FreeApiCategory::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-folder';

    protected static string | \UnitEnum | null $navigationGroup = 'Free APIs';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            TextInput::make('accent')->default('#ccff00')->maxLength(20),
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
                ColorColumn::make('accent'),
                TextColumn::make('apis_count')->counts('apis')->label('APIs'),
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
            'index' => ListFreeApiCategories::route('/'),
            'create' => CreateFreeApiCategory::route('/create'),
            'edit' => EditFreeApiCategory::route('/{record}/edit'),
        ];
    }
}

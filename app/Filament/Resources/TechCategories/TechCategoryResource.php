<?php

namespace App\Filament\Resources\TechCategories;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\ColorPicker;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\TechCategories\Pages\ListTechCategories;
use App\Filament\Resources\TechCategories\Pages\CreateTechCategory;
use App\Filament\Resources\TechCategories\Pages\EditTechCategory;
use App\Models\TechCategory;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class TechCategoryResource extends Resource
{
    protected static ?string $model = TechCategory::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-squares-2x2';

    protected static string | \UnitEnum | null $navigationGroup = 'Tech Stack';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            Textarea::make('description')->rows(3)->columnSpanFull(),
            ColorPicker::make('accent')->default('#ccff00'),
            TextInput::make('sort_order')->numeric()->default(0)->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ColorColumn::make('accent'),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('slug'),
                TextColumn::make('stacks_count')->counts('stacks')->label('Stacks'),
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
            'index' => ListTechCategories::route('/'),
            'create' => CreateTechCategory::route('/create'),
            'edit' => EditTechCategory::route('/{record}/edit'),
        ];
    }
}

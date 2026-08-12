<?php

namespace App\Filament\Resources\TechStacks;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\TechStacks\Pages\ListTechStacks;
use App\Filament\Resources\TechStacks\Pages\CreateTechStack;
use App\Filament\Resources\TechStacks\Pages\EditTechStack;
use App\Models\TechStack;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class TechStackResource extends Resource
{
    protected static ?string $model = TechStack::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-code-bracket';

    protected static string | \UnitEnum | null $navigationGroup = 'Tech Stack';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('tech_category_id')
                ->relationship('category', 'name')
                ->required()
                ->searchable()
                ->preload(),
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            TextInput::make('signal')->maxLength(120),
            FileUpload::make('icon')
                ->label('Icon')
                ->disk('public_web')
                ->directory('stacks')
                ->acceptedFileTypes(['image/svg+xml', 'image/png', 'image/webp', 'image/jpeg'])
                ->maxSize(1024)
                ->downloadable()
                ->openable()
                ->required()
                ->helperText('SVG/PNG a public/stacks mappába. Éles seedeléskor a StackSeeder ikonjai automatikusan ide kerülnek.'),
            TextInput::make('level')->numeric()->minValue(0)->maxValue(100)->default(80)->required(),
            Textarea::make('summary')->rows(3)->columnSpanFull(),
            TagsInput::make('bullets')->columnSpanFull(),
            TextInput::make('docs_url')->url()->columnSpanFull(),
            TextInput::make('sort_order')->numeric()->default(0)->required(),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('icon')
                    ->disk('public_web')
                    ->height(28)
                    ->square(),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('category.name')->sortable(),
                TextColumn::make('signal'),
                TextColumn::make('level')->sortable(),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                SelectFilter::make('tech_category_id')
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
            'index' => ListTechStacks::route('/'),
            'create' => CreateTechStack::route('/create'),
            'edit' => EditTechStack::route('/{record}/edit'),
        ];
    }
}

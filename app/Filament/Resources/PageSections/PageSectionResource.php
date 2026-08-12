<?php

namespace App\Filament\Resources\PageSections;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use App\Filament\Resources\PageSections\Pages\ManagePageSections;
use App\Filament\Resources\PageSections\Pages\EditPageSection;
use App\Models\PageSection;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class PageSectionResource extends Resource
{
    protected static ?string $model = PageSection::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-document-text';

    protected static string | \UnitEnum | null $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Oldal szekciók';

    protected static ?string $modelLabel = 'Szekció';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('slug')
                ->label('Anchor slug')
                ->required()
                ->disabledOn('edit')
                ->helperText('HTML id is #slug — pl. projects, logs'),
            TextInput::make('section_label')->label('Szekció címke')->required(),
            TextInput::make('title')->label('Cím')->required(),
            TextInput::make('title_accent')->label('Kiemelt szó'),
            Textarea::make('body')->label('Szöveg')->rows(4),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('slug'),
                TextColumn::make('section_label'),
                TextColumn::make('title'),
                IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->recordActions([EditAction::make()]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePageSections::route('/'),
            'edit' => EditPageSection::route('/{record}/edit'),
        ];
    }
}

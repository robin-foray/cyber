<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageSectionResource\Pages;
use App\Models\PageSection;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PageSectionResource extends Resource
{
    protected static ?string $model = PageSection::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Oldal szekciók';

    protected static ?string $modelLabel = 'Szekció';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('slug')
                ->label('Anchor slug')
                ->required()
                ->disabledOn('edit')
                ->helperText('HTML id is #slug — pl. projects, logs'),
            Forms\Components\TextInput::make('section_label')->label('Szekció címke')->required(),
            Forms\Components\TextInput::make('title')->label('Cím')->required(),
            Forms\Components\TextInput::make('title_accent')->label('Kiemelt szó'),
            Forms\Components\Textarea::make('body')->label('Szöveg')->rows(4),
            Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('slug'),
                Tables\Columns\TextColumn::make('section_label'),
                Tables\Columns\TextColumn::make('title'),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManagePageSections::route('/'),
            'edit' => Pages\EditPageSection::route('/{record}/edit'),
        ];
    }
}

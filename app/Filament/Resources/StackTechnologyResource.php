<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StackTechnologyResource\Pages;
use App\Models\StackTechnology;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class StackTechnologyResource extends Resource
{
    protected static ?string $model = StackTechnology::class;

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    protected static ?string $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Tech stack';

    protected static ?string $modelLabel = 'Stack elem';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('signal')->required(),
            Forms\Components\Textarea::make('summary')->rows(3)->required(),
            Forms\Components\TagsInput::make('bullets')->label('Bullet pontok')->required(),
            Forms\Components\TextInput::make('docs_url')->label('Dokumentáció URL')->url()->required(),
            Forms\Components\TextInput::make('icon')->label('Lucide ikon')->required(),
            Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('signal'),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageStackTechnologies::route('/'),
        ];
    }
}

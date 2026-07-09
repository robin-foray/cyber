<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DevToolPageResource\Pages;
use App\Models\DevToolPage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DevToolPageResource extends Resource
{
    protected static ?string $model = DevToolPage::class;

    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?string $navigationGroup = 'Dev Tools';

    protected static ?string $navigationLabel = 'Dev-tool oldalak';

    protected static ?string $modelLabel = 'Dev-tool oldal';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('slug')
                ->label('Slug')
                ->required()
                ->disabledOn('edit')
                ->helperText('Pl. console, hash-generator'),
            Forms\Components\TextInput::make('header_label')
                ->label('Fejléc címke')
                ->required()
                ->helperText('Pl. DEV_TOOL_01 // JSON_FORMATTER'),
            Forms\Components\TextInput::make('page_title')->label('Oldal cím (Head)')->required(),
            Forms\Components\TextInput::make('heading_prefix')->label('H1 első rész')->helperText('Üresen hagyva csak a fejléc címke jelenik meg.'),
            Forms\Components\TextInput::make('heading_accent')->label('H1 kiemelt rész'),
            Forms\Components\Textarea::make('sample_input')->label('Minta input')->rows(3),
            Forms\Components\TextInput::make('icon')->label('Lucide ikon')->helperText('Pl. Terminal, QrCode'),
            Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('slug'),
                Tables\Columns\TextColumn::make('header_label')->limit(40),
                Tables\Columns\TextColumn::make('page_title'),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageDevToolPages::route('/'),
            'edit' => Pages\EditDevToolPage::route('/{record}/edit'),
        ];
    }
}

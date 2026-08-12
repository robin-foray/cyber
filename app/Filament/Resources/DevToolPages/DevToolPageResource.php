<?php

namespace App\Filament\Resources\DevToolPages;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use App\Filament\Resources\DevToolPages\Pages\ManageDevToolPages;
use App\Filament\Resources\DevToolPages\Pages\EditDevToolPage;
use App\Models\DevToolPage;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class DevToolPageResource extends Resource
{
    protected static ?string $model = DevToolPage::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static string | \UnitEnum | null $navigationGroup = 'Dev Tools';

    protected static ?string $navigationLabel = 'Dev-tool oldalak';

    protected static ?string $modelLabel = 'Dev-tool oldal';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('slug')
                ->label('Slug')
                ->required()
                ->disabledOn('edit')
                ->helperText('Pl. console, hash-generator'),
            TextInput::make('header_label')
                ->label('Fejléc címke')
                ->required()
                ->helperText('Pl. DEV_TOOL_01 // JSON_FORMATTER'),
            TextInput::make('page_title')->label('Oldal cím (Head)')->required(),
            TextInput::make('heading_prefix')->label('H1 első rész')->helperText('Üresen hagyva csak a fejléc címke jelenik meg.'),
            TextInput::make('heading_accent')->label('H1 kiemelt rész'),
            Textarea::make('sample_input')->label('Minta input')->rows(3),
            TextInput::make('icon')->label('Lucide ikon')->helperText('Pl. Terminal, QrCode'),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('slug'),
                TextColumn::make('header_label')->limit(40),
                TextColumn::make('page_title'),
                TextColumn::make('sort_order')->sortable(),
                IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordActions([EditAction::make()]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageDevToolPages::route('/'),
            'edit' => EditDevToolPage::route('/{record}/edit'),
        ];
    }
}

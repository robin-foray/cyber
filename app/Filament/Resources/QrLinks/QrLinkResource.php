<?php

namespace App\Filament\Resources\QrLinks;

use App\Filament\Resources\QrLinks\Pages\CreateQrLink;
use App\Filament\Resources\QrLinks\Pages\EditQrLink;
use App\Filament\Resources\QrLinks\Pages\ListQrLinks;
use App\Filament\Resources\QrLinks\Pages\ViewQrLink;
use App\Filament\Resources\QrLinks\RelationManagers\ScansRelationManager;
use App\Models\QrLink;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\HtmlString;

class QrLinkResource extends Resource
{
    protected static ?string $model = QrLink::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-qr-code';

    protected static string|\UnitEnum|null $navigationGroup = 'Statisztika';

    protected static ?string $navigationLabel = 'Dinamikus QR linkek';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required()->maxLength(120),
            Placeholder::make('hash')
                ->label('Fix QR hash')
                ->content(fn (?QrLink $record): string => $record
                    ? $record->slug.' — a nyomtatott QR URL nem változtatható'
                    : 'Mentéskor automatikus 16 karakteres hash (pl. /q/a1b2c3d4e5f67890)')
                ->columnSpanFull(),
            TextInput::make('destination_url')
                ->label('Aktuális cél URL')
                ->url()
                ->required()
                ->columnSpanFull(),
            Textarea::make('notes')->rows(2)->columnSpanFull(),
            Toggle::make('is_active')->default(true),
            Section::make('Megjelenés')
                ->description('Stílus, logó, keret és egyedi HTML a nyomtatható QR-hez.')
                ->schema([
                    Select::make('design.style_id')
                        ->label('Stílus preset')
                        ->options(array_combine(QrLink::STYLE_IDS, QrLink::STYLE_IDS))
                        ->default('cyber'),
                    ColorPicker::make('design.dark')->label('Sötét szín')->nullable(),
                    ColorPicker::make('design.light')->label('Világos szín')->nullable(),
                    Select::make('design.module_shape')
                        ->label('Modul forma')
                        ->options(array_combine(QrLink::MODULE_SHAPES, QrLink::MODULE_SHAPES))
                        ->placeholder('Preset alap'),
                    Select::make('design.eye_style')
                        ->label('Eye stílus')
                        ->options(array_combine(QrLink::EYE_STYLES, QrLink::EYE_STYLES))
                        ->placeholder('Preset alap'),
                    Select::make('design.frame')
                        ->label('Keret')
                        ->options(array_combine(QrLink::FRAMES, QrLink::FRAMES))
                        ->default('bare'),
                    TextInput::make('design.logo_size')
                        ->label('Logó méret %')
                        ->numeric()
                        ->minValue(10)
                        ->maxValue(32)
                        ->default(22),
                    Select::make('design.logo_shape')
                        ->label('Logó forma')
                        ->options(array_combine(QrLink::LOGO_SHAPES, QrLink::LOGO_SHAPES))
                        ->default('rounded'),
                    Toggle::make('design.logo_pad')->label('Logó háttér')->default(true),
                    TextInput::make('design.caption')->label('Felirat')->maxLength(120),
                    TextInput::make('design.subtitle')->label('Alcím')->maxLength(200),
                    FileUpload::make('logo_path')
                        ->label('Logó')
                        ->disk('public')
                        ->directory('qr-logos')
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
                        ->maxSize(2048)
                        ->columnSpanFull(),
                    Textarea::make('design.embed_html')
                        ->label('Beágyazott HTML')
                        ->rows(8)
                        ->helperText('Helyőrzők: {{qr}} {{name}} {{url}} {{caption}} {{subtitle}}')
                        ->columnSpanFull(),
                ])
                ->columns(2)
                ->columnSpanFull(),
            Placeholder::make('preview')
                ->label('Nyomtatható QR')
                ->content(fn (?QrLink $record): HtmlString|string => $record
                    ? new HtmlString(self::previewHtml($record))
                    : 'Mentés után jelenik meg a fix QR és a hash URL.')
                ->columnSpanFull()
                ->visible(fn (?QrLink $record): bool => $record !== null),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('slug')->label('Hash')->copyable()->fontFamily('mono'),
                TextColumn::make('destination_url')->limit(40)->url(fn (QrLink $record) => $record->destination_url, true),
                TextColumn::make('scan_count')->label('Scan')->sortable(),
                TextColumn::make('last_scanned_at')->since()->sortable(),
                IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->filters([
                TernaryFilter::make('is_active'),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->ownedBy(Auth::id());
    }

    public static function getRelations(): array
    {
        return [
            ScansRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListQrLinks::route('/'),
            'create' => CreateQrLink::route('/create'),
            'view' => ViewQrLink::route('/{record}'),
            'edit' => EditQrLink::route('/{record}/edit'),
        ];
    }

    public static function mutateFormDataBeforeCreate(array $data): array
    {
        $data['created_by'] = Auth::id();

        return self::normalizeAppearanceData($data);
    }

    public static function mutateFormDataBeforeSave(array $data): array
    {
        return self::normalizeAppearanceData($data);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public static function normalizeAppearanceData(array $data): array
    {
        if (is_array($data['logo_path'] ?? null)) {
            $data['logo_path'] = $data['logo_path'][0] ?? null;
        }

        if (($data['logo_path'] ?? null) === [] || blank($data['logo_path'] ?? null)) {
            $data['logo_path'] = null;
        }

        $data['design'] = QrLink::normalizeDesign($data['design'] ?? []);

        return $data;
    }

    public static function previewHtml(QrLink $record): string
    {
        $url = e($record->public_url);
        $qr = e($record->qr_preview_url);
        $dest = e($record->destination_url);

        return <<<HTML
            <div class="space-y-3">
                <p class="font-mono text-sm break-all">{$url}</p>
                <img src="{$qr}" alt="QR" class="h-48 w-48 rounded-lg border border-gray-700 bg-black" />
                <p class="text-xs text-gray-400">Jelenlegi cél: <span class="font-mono">{$dest}</span></p>
            </div>
        HTML;
    }
}

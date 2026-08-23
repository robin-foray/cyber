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
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
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

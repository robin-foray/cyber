<?php

namespace App\Filament\Resources\GuestPasses;

use App\Filament\Resources\GuestPasses\Pages\CreateGuestPass;
use App\Filament\Resources\GuestPasses\Pages\EditGuestPass;
use App\Filament\Resources\GuestPasses\Pages\ListGuestPasses;
use App\Filament\Resources\GuestPasses\Pages\ViewGuestPass;
use App\Filament\Resources\GuestPasses\RelationManagers\ViewsRelationManager;
use App\Models\GuestPass;
use Carbon\CarbonInterface;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\HtmlString;

class GuestPassResource extends Resource
{
    protected static ?string $model = GuestPass::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-qr-code';

    protected static string|\UnitEnum|null $navigationGroup = 'Statisztika';

    protected static ?string $navigationLabel = 'Vendég belépők';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('label')
                ->label('Admin megjegyzés')
                ->required()
                ->maxLength(120)
                ->helperText('Belső címke — pl. „XY Kft. munkáltatói bemutató”.'),
            TextInput::make('display_name')
                ->label('Megjelenő név')
                ->required()
                ->maxLength(120),
            TextInput::make('title')
                ->label('Titulus / szerepkör')
                ->maxLength(120)
                ->placeholder('pl. HR Partner'),
            Textarea::make('bio')
                ->label('Rövid bio')
                ->rows(3)
                ->maxLength(500)
                ->columnSpanFull(),
            FileUpload::make('avatar_path')
                ->label('Profilkép')
                ->disk('public')
                ->directory('guest-pass-avatars')
                ->image()
                ->maxSize(2048)
                ->downloadable()
                ->openable()
                ->columnSpanFull(),
            TextInput::make('avatar_seed')
                ->label('DiceBear seed')
                ->maxLength(120)
                ->helperText('Ha nincs feltöltött kép, ebből generálódik az avatar.'),
            DateTimePicker::make('expires_at')
                ->label('Lejárat')
                ->required()
                ->native(false)
                ->seconds(false)
                ->default(fn (): CarbonInterface => now()->addWeek()->seconds(0))
                ->minDate(fn (): CarbonInterface => now()->startOfDay()),
            Toggle::make('is_active')
                ->label('Aktív')
                ->default(true),
            CheckboxList::make('allowed_routes')
                ->label('Engedélyezett oldalak')
                ->options(self::routeOptions())
                ->columns(2)
                ->helperText('Üresen hagyva az alapértelmezett cyber oldalak engedélyezettek.')
                ->columnSpanFull(),
            Placeholder::make('pass_link')
                ->label('Belépő link / QR')
                ->content(fn (?GuestPass $record): HtmlString|string => $record
                    ? new HtmlString(self::passLinkPreview($record))
                    : 'Mentés után generálódik a link és a QR kód.')
                ->columnSpanFull()
                ->visibleOn(['edit', 'view']),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar_url')
                    ->label('Avatar')
                    ->circular(),
                TextColumn::make('display_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('label')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('expires_at')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->color(fn (GuestPass $record): string => $record->isValid() ? 'success' : 'danger'),
                TextColumn::make('view_count')
                    ->label('Megtekintések')
                    ->sortable(),
                TextColumn::make('last_used_at')
                    ->since()
                    ->sortable()
                    ->toggleable(),
                IconColumn::make('is_active')
                    ->boolean(),
            ])
            ->defaultSort('expires_at', 'desc')
            ->filters([
                TernaryFilter::make('is_active'),
            ])
            ->emptyStateHeading('Nincs vendég belépő')
            ->emptyStateDescription('Hozz létre egy QR / link belépőt vendégeknek.')
            ->emptyStateActions([
                CreateAction::make()
                    ->url(fn (): string => static::getUrl('create')),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                Action::make('copyLink')
                    ->label('Link')
                    ->icon('heroicon-o-clipboard')
                    ->action(fn (GuestPass $record) => null)
                    ->extraAttributes(fn (GuestPass $record): array => [
                        'x-data' => '{}',
                        'x-on:click.prevent' => 'navigator.clipboard.writeText('.json_encode($record->redemption_url).')',
                    ]),
                Action::make('revoke')
                    ->label('Visszavonás')
                    ->icon('heroicon-o-no-symbol')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (GuestPass $record): bool => $record->revoked_at === null)
                    ->action(function (GuestPass $record): void {
                        $record->update([
                            'revoked_at' => now(),
                            'is_active' => false,
                        ]);
                    }),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            ViewsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListGuestPasses::route('/'),
            'create' => CreateGuestPass::route('/create'),
            'view' => ViewGuestPass::route('/{record}'),
            'edit' => EditGuestPass::route('/{record}/edit'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function routeOptions(): array
    {
        $labels = [
            'home' => 'Welcome',
            'machines.index' => 'Machines',
            'tech-stack.index' => 'Tech Stack',
            'useful-sites.index' => 'Useful Sites',
            'free-apis.index' => 'Free APIs',
            'dev-tools.console' => 'Dev Console',
            'dev-tools.qr-generator' => 'QR Generator',
            'dev-tools.hash-generator' => 'Hash Generator',
            'dev-tools.sql-builder' => 'SQL Builder',
        ];

        return collect(GuestPass::DEFAULT_ALLOWED_ROUTES)
            ->mapWithKeys(fn (string $route): array => [$route => $labels[$route] ?? $route])
            ->all();
    }

    public static function passLinkPreview(GuestPass $record): string
    {
        $url = e($record->redemption_url);
        $qr = e($record->qr_code_url);

        return <<<HTML
            <div class="space-y-3">
                <p class="font-mono text-sm break-all">{$url}</p>
                <img src="{$qr}" alt="QR code" class="h-48 w-48 rounded-lg border border-gray-700 bg-black" />
                <p class="text-xs text-gray-400">Szkennelés után vendég munkamenet indul — lejárat: {$record->expires_at->format('Y-m-d H:i')}</p>
            </div>
        HTML;
    }

    public static function mutateFormDataBeforeCreate(array $data): array
    {
        $data['created_by'] = Auth::id();

        if (($data['avatar_path'] ?? null) === [] || blank($data['avatar_path'] ?? null)) {
            $data['avatar_path'] = null;
        }

        if (($data['allowed_routes'] ?? null) === []) {
            $data['allowed_routes'] = null;
        }

        if (blank($data['expires_at'] ?? null)) {
            $data['expires_at'] = now()->addWeek();
        }

        return $data;
    }
}

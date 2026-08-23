<?php

namespace App\Filament\Resources\FamilyMailboxes;

use App\Filament\Resources\FamilyMailboxes\Pages\CreateFamilyMailbox;
use App\Filament\Resources\FamilyMailboxes\Pages\EditFamilyMailbox;
use App\Filament\Resources\FamilyMailboxes\Pages\ListFamilyMailboxes;
use App\Models\FamilyMailbox;
use App\Models\MailServerSetting;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class FamilyMailboxResource extends Resource
{
    protected static ?string $model = FamilyMailbox::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-envelope';

    protected static string|\UnitEnum|null $navigationGroup = 'Levelezés';

    protected static ?string $navigationLabel = 'Családi emailek';

    protected static ?string $modelLabel = 'családi email';

    protected static ?string $pluralModelLabel = 'családi emailek';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        $defaultDomain = MailServerSetting::current()->domain ?: 'foray.hu';

        return $schema->components([
            Section::make('Cím')
                ->columns(3)
                ->schema([
                    TextInput::make('local_part')
                        ->label('Felhasználónév')
                        ->required()
                        ->maxLength(64)
                        ->regex('/^[a-z0-9._+-]+$/i')
                        ->helperText('Csak a @ előtti rész, pl. anna')
                        ->unique(
                            table: FamilyMailbox::class,
                            column: 'local_part',
                            modifyRuleUsing: fn ($rule, Get $get) => $rule->where('domain', $get('domain') ?: 'foray.hu'),
                            ignoreRecord: true,
                        )
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn (Set $set, ?string $state) => $set(
                            'local_part',
                            strtolower(trim((string) $state)),
                        )),
                    TextInput::make('domain')
                        ->label('Domain')
                        ->required()
                        ->maxLength(255)
                        ->default($defaultDomain)
                        ->live(onBlur: true),
                    Placeholder::make('email_preview')
                        ->label('Teljes cím')
                        ->content(fn (Get $get): string => strtolower(trim((string) $get('local_part'))).'@'.($get('domain') ?: $defaultDomain)),
                ]),
            Section::make('Tulajdonos')
                ->columns(2)
                ->schema([
                    TextInput::make('display_name')
                        ->label('Megjelenő név')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('owner_name')
                        ->label('Családtag / tulajdonos')
                        ->maxLength(255),
                    Select::make('type')
                        ->label('Típus')
                        ->options(FamilyMailbox::typeOptions())
                        ->required()
                        ->native(false)
                        ->live(),
                    TextInput::make('forward_to')
                        ->label('Továbbítás ide')
                        ->email()
                        ->maxLength(255)
                        ->visible(fn (Get $get): bool => in_array($get('type'), [
                            FamilyMailbox::TYPE_ALIAS,
                            FamilyMailbox::TYPE_FORWARD,
                        ], true))
                        ->required(fn (Get $get): bool => in_array($get('type'), [
                            FamilyMailbox::TYPE_ALIAS,
                            FamilyMailbox::TYPE_FORWARD,
                        ], true)),
                    TextInput::make('quota_mb')
                        ->label('Kvóta (MB)')
                        ->numeric()
                        ->minValue(0)
                        ->visible(fn (Get $get): bool => $get('type') === FamilyMailbox::TYPE_MAILBOX),
                    DateTimePicker::make('password_rotated_at')
                        ->label('Jelszó utolsó cseréje')
                        ->seconds(false)
                        ->visible(fn (Get $get): bool => $get('type') === FamilyMailbox::TYPE_MAILBOX),
                ]),
            Section::make('Egyéb')
                ->columns(2)
                ->schema([
                    Textarea::make('notes')
                        ->label('Megjegyzés')
                        ->rows(3)
                        ->columnSpanFull(),
                    TextInput::make('sort_order')
                        ->label('Sorrend')
                        ->numeric()
                        ->default(0)
                        ->required(),
                    Toggle::make('is_active')
                        ->label('Aktív')
                        ->default(true),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('email')
                    ->label('Email')
                    ->state(fn (FamilyMailbox $record): string => $record->email)
                    ->searchable(['local_part', 'domain', 'display_name', 'owner_name'])
                    ->sortable(query: function ($query, string $direction) {
                        return $query->orderBy('local_part', $direction);
                    })
                    ->copyable(),
                TextColumn::make('display_name')
                    ->label('Név')
                    ->sortable(),
                TextColumn::make('owner_name')
                    ->label('Tulajdonos')
                    ->toggleable()
                    ->placeholder('—'),
                TextColumn::make('type')
                    ->label('Típus')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => FamilyMailbox::typeOptions()[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        FamilyMailbox::TYPE_MAILBOX => 'success',
                        FamilyMailbox::TYPE_ALIAS => 'info',
                        FamilyMailbox::TYPE_FORWARD => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('forward_to')
                    ->label('Továbbítás')
                    ->toggleable()
                    ->placeholder('—'),
                IconColumn::make('is_active')
                    ->label('Aktív')
                    ->boolean(),
                TextColumn::make('sort_order')
                    ->label('Sorrend')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order')
            ->filters([
                SelectFilter::make('type')
                    ->label('Típus')
                    ->options(FamilyMailbox::typeOptions()),
                TernaryFilter::make('is_active')
                    ->label('Aktív'),
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
            'index' => ListFamilyMailboxes::route('/'),
            'create' => CreateFamilyMailbox::route('/create'),
            'edit' => EditFamilyMailbox::route('/{record}/edit'),
        ];
    }
}

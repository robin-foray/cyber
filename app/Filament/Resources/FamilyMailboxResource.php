<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FamilyMailboxResource\Pages;
use App\Models\FamilyMailbox;
use App\Models\MailServerSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class FamilyMailboxResource extends Resource
{
    protected static ?string $model = FamilyMailbox::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationGroup = 'Levelezés';

    protected static ?string $navigationLabel = 'Családi emailek';

    protected static ?string $modelLabel = 'családi email';

    protected static ?string $pluralModelLabel = 'családi emailek';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        $defaultDomain = MailServerSetting::current()->domain ?: 'foray.hu';

        return $form->schema([
            Forms\Components\Section::make('Cím')
                ->schema([
                    Forms\Components\TextInput::make('local_part')
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
                        ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set(
                            'local_part',
                            strtolower(trim((string) $state)),
                        )),
                    Forms\Components\TextInput::make('domain')
                        ->label('Domain')
                        ->required()
                        ->maxLength(255)
                        ->default($defaultDomain),
                    Forms\Components\Placeholder::make('email_preview')
                        ->label('Teljes cím')
                        ->content(fn (Get $get): string => strtolower(trim((string) $get('local_part'))).'@'.($get('domain') ?: $defaultDomain)),
                ])
                ->columns(3),
            Forms\Components\Section::make('Tulajdonos')
                ->schema([
                    Forms\Components\TextInput::make('display_name')
                        ->label('Megjelenő név')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('owner_name')
                        ->label('Családtag')
                        ->maxLength(255),
                    Forms\Components\Select::make('type')
                        ->label('Típus')
                        ->options(FamilyMailbox::typeOptions())
                        ->required()
                        ->native(false)
                        ->live(),
                    Forms\Components\TextInput::make('forward_to')
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
                    Forms\Components\TextInput::make('quota_mb')
                        ->label('Kvóta (MB)')
                        ->numeric()
                        ->minValue(0)
                        ->visible(fn (Get $get): bool => $get('type') === FamilyMailbox::TYPE_MAILBOX),
                    Forms\Components\DateTimePicker::make('password_rotated_at')
                        ->label('Jelszó utolsó cseréje')
                        ->seconds(false)
                        ->visible(fn (Get $get): bool => $get('type') === FamilyMailbox::TYPE_MAILBOX),
                ])
                ->columns(2),
            Forms\Components\Section::make('Egyéb')
                ->schema([
                    Forms\Components\Textarea::make('notes')
                        ->label('Megjegyzés')
                        ->rows(3)
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('sort_order')
                        ->label('Sorrend')
                        ->numeric()
                        ->default(0)
                        ->required(),
                    Forms\Components\Toggle::make('is_active')
                        ->label('Aktív')
                        ->default(true),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->state(fn (FamilyMailbox $record): string => $record->email)
                    ->searchable(['local_part', 'domain', 'display_name', 'owner_name'])
                    ->sortable(query: function ($query, string $direction) {
                        return $query->orderBy('local_part', $direction);
                    })
                    ->copyable(),
                Tables\Columns\TextColumn::make('display_name')
                    ->label('Név')
                    ->sortable(),
                Tables\Columns\TextColumn::make('owner_name')
                    ->label('Családtag')
                    ->toggleable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('type')
                    ->label('Típus')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => FamilyMailbox::typeOptions()[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        FamilyMailbox::TYPE_MAILBOX => 'success',
                        FamilyMailbox::TYPE_ALIAS => 'info',
                        FamilyMailbox::TYPE_FORWARD => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('forward_to')
                    ->label('Továbbítás')
                    ->toggleable()
                    ->placeholder('—'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktív')
                    ->boolean(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Sorrend')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order')
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('Típus')
                    ->options(FamilyMailbox::typeOptions()),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Aktív'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFamilyMailboxes::route('/'),
            'create' => Pages\CreateFamilyMailbox::route('/create'),
            'edit' => Pages\EditFamilyMailbox::route('/{record}/edit'),
        ];
    }
}

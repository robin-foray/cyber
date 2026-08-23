<?php

namespace App\Filament\Pages;

use App\Filament\Resources\FamilyMailboxes\FamilyMailboxResource;
use App\Models\FamilyMailbox;
use App\Models\MailServerSetting;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class MailServer extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-server-stack';

    protected static string|UnitEnum|null $navigationGroup = 'Levelezés';

    protected static ?string $navigationLabel = 'Levelezőszerver';

    protected static ?string $title = 'Levelezőszerver';

    protected static ?string $slug = 'mail-server';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.mail-server';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(MailServerSetting::current()->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Domain és állapot')
                    ->description('A foray.hu családi levelezés adminisztrációja.')
                    ->columns(3)
                    ->schema([
                        TextInput::make('domain')
                            ->label('Domain')
                            ->required()
                            ->maxLength(255)
                            ->default('foray.hu'),
                        TextInput::make('display_name')
                            ->label('Megjelenő név')
                            ->required()
                            ->maxLength(255),
                        Toggle::make('is_enabled')
                            ->label('Szerver aktív')
                            ->default(true),
                    ]),
                Section::make('Kapcsolódási adatok')
                    ->columns(2)
                    ->schema([
                        TextInput::make('imap_host')
                            ->label('IMAP host')
                            ->maxLength(255)
                            ->placeholder('mail.foray.hu'),
                        TextInput::make('imap_port')
                            ->label('IMAP port')
                            ->numeric()
                            ->required()
                            ->default(993),
                        TextInput::make('smtp_host')
                            ->label('SMTP host')
                            ->maxLength(255)
                            ->placeholder('mail.foray.hu'),
                        TextInput::make('smtp_port')
                            ->label('SMTP port')
                            ->numeric()
                            ->required()
                            ->default(465),
                        TextInput::make('webmail_url')
                            ->label('Webmail URL')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull()
                            ->placeholder('https://webmail.foray.hu'),
                    ]),
                Section::make('Megjegyzések')
                    ->schema([
                        Textarea::make('admin_notes')
                            ->label('Admin jegyzetek')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $settings = MailServerSetting::current();
        $settings->fill($this->form->getState());
        $settings->save();

        Notification::make()
            ->title('Levelezőszerver beállítások mentve')
            ->success()
            ->send();
    }

    /**
     * @return array{total: int, active: int, mailbox: int, alias: int, forward: int, mailboxesUrl: string, webmailUrl: string|null}
     */
    public function getMailboxStatsProperty(): array
    {
        $query = FamilyMailbox::query();
        $settings = MailServerSetting::current();

        return [
            'total' => (clone $query)->count(),
            'active' => (clone $query)->where('is_active', true)->count(),
            'mailbox' => (clone $query)->where('type', FamilyMailbox::TYPE_MAILBOX)->count(),
            'alias' => (clone $query)->where('type', FamilyMailbox::TYPE_ALIAS)->count(),
            'forward' => (clone $query)->where('type', FamilyMailbox::TYPE_FORWARD)->count(),
            'mailboxesUrl' => FamilyMailboxResource::getUrl(),
            'webmailUrl' => $settings->webmail_url,
        ];
    }
}

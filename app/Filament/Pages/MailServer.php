<?php

namespace App\Filament\Pages;

use App\Models\FamilyMailbox;
use App\Models\MailServerSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class MailServer extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-server-stack';

    protected static ?string $navigationGroup = 'Levelezés';

    protected static ?string $navigationLabel = 'Levelezőszerver';

    protected static ?string $title = 'Levelezőszerver';

    protected static ?string $slug = 'mail-server';

    protected static ?int $navigationSort = 1;

    protected static string $view = 'filament.pages.mail-server';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(MailServerSetting::current()->attributesToArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Domain és állapot')
                    ->description('A foray.hu családi levelezés adminisztrációja. Csak az admin panelben látható.')
                    ->schema([
                        Forms\Components\TextInput::make('domain')
                            ->label('Domain')
                            ->required()
                            ->maxLength(255)
                            ->default('foray.hu'),
                        Forms\Components\TextInput::make('display_name')
                            ->label('Megjelenő név')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Toggle::make('is_enabled')
                            ->label('Szerver aktív')
                            ->default(true),
                    ])
                    ->columns(3),
                Forms\Components\Section::make('Kapcsolódási adatok')
                    ->schema([
                        Forms\Components\TextInput::make('imap_host')
                            ->label('IMAP host')
                            ->maxLength(255)
                            ->placeholder('mail.foray.hu'),
                        Forms\Components\TextInput::make('imap_port')
                            ->label('IMAP port')
                            ->numeric()
                            ->required()
                            ->default(993),
                        Forms\Components\TextInput::make('smtp_host')
                            ->label('SMTP host')
                            ->maxLength(255)
                            ->placeholder('mail.foray.hu'),
                        Forms\Components\TextInput::make('smtp_port')
                            ->label('SMTP port')
                            ->numeric()
                            ->required()
                            ->default(465),
                        Forms\Components\TextInput::make('webmail_url')
                            ->label('Webmail URL')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull()
                            ->placeholder('https://webmail.foray.hu'),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Megjegyzések')
                    ->schema([
                        Forms\Components\Textarea::make('admin_notes')
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
     * @return array{total: int, active: int, mailbox: int, alias: int, forward: int}
     */
    public function getMailboxStatsProperty(): array
    {
        $query = FamilyMailbox::query();

        return [
            'total' => (clone $query)->count(),
            'active' => (clone $query)->where('is_active', true)->count(),
            'mailbox' => (clone $query)->where('type', FamilyMailbox::TYPE_MAILBOX)->count(),
            'alias' => (clone $query)->where('type', FamilyMailbox::TYPE_ALIAS)->count(),
            'forward' => (clone $query)->where('type', FamilyMailbox::TYPE_FORWARD)->count(),
        ];
    }
}

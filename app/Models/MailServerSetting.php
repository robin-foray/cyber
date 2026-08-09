<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailServerSetting extends Model
{
    protected $fillable = [
        'domain',
        'display_name',
        'imap_host',
        'imap_port',
        'smtp_host',
        'smtp_port',
        'webmail_url',
        'admin_notes',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'imap_port' => 'integer',
            'smtp_port' => 'integer',
            'is_enabled' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'domain' => config('foray.mail.domain', 'foray.hu'),
                'display_name' => config('foray.mail.display_name', 'Foray Family Mail'),
                'imap_host' => config('foray.mail.imap_host'),
                'imap_port' => (int) config('foray.mail.imap_port', 993),
                'smtp_host' => config('foray.mail.smtp_host'),
                'smtp_port' => (int) config('foray.mail.smtp_port', 465),
                'webmail_url' => config('foray.mail.webmail_url'),
                'admin_notes' => config('foray.mail.admin_notes'),
                'is_enabled' => true,
            ],
        );
    }
}

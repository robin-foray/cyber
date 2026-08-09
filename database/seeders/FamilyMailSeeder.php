<?php

namespace Database\Seeders;

use App\Models\FamilyMailbox;
use App\Models\MailServerSetting;
use Illuminate\Database\Seeder;

class FamilyMailSeeder extends Seeder
{
    public function run(): void
    {
        MailServerSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'domain' => config('foray.mail.domain', 'foray.hu'),
                'display_name' => config('foray.mail.display_name', 'Foray Family Mail'),
                'imap_host' => config('foray.mail.imap_host', 'mail.foray.hu'),
                'imap_port' => (int) config('foray.mail.imap_port', 993),
                'smtp_host' => config('foray.mail.smtp_host', 'mail.foray.hu'),
                'smtp_port' => (int) config('foray.mail.smtp_port', 465),
                'webmail_url' => config('foray.mail.webmail_url', 'https://webmail.foray.hu'),
                'admin_notes' => config(
                    'foray.mail.admin_notes',
                    'Családi @foray.hu postafiókok nyilvántartása. A tényleges mailbox létrehozás a levelezőszerveren történik; itt az inventory és a beállítások élnek.'
                ),
                'is_enabled' => true,
            ],
        );

        $domain = (string) config('foray.mail.domain', 'foray.hu');

        $mailboxes = [
            [
                'local_part' => 'info',
                'display_name' => 'Foray Info',
                'owner_name' => 'Család',
                'type' => FamilyMailbox::TYPE_MAILBOX,
                'quota_mb' => 2048,
                'notes' => 'Általános családi postafiók',
                'sort_order' => 1,
            ],
            [
                'local_part' => 'admin',
                'display_name' => 'Mail Admin',
                'owner_name' => 'Robin Foray',
                'type' => FamilyMailbox::TYPE_MAILBOX,
                'quota_mb' => 5120,
                'notes' => 'Admin / üzemeltetés',
                'sort_order' => 2,
            ],
            [
                'local_part' => 'family',
                'display_name' => 'Family Alias',
                'owner_name' => 'Család',
                'type' => FamilyMailbox::TYPE_FORWARD,
                'forward_to' => 'info@'.$domain,
                'notes' => 'Családi alias → info',
                'sort_order' => 3,
            ],
        ];

        foreach ($mailboxes as $mailbox) {
            FamilyMailbox::query()->updateOrCreate(
                [
                    'local_part' => $mailbox['local_part'],
                    'domain' => $domain,
                ],
                array_merge($mailbox, [
                    'domain' => $domain,
                    'is_active' => true,
                ]),
            );
        }
    }
}

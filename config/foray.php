<?php

return [

    'admin' => [
        'email' => env('FORAY_ADMIN_EMAIL', 'robin.foray@gmail.com'),
        'password' => env('FORAY_ADMIN_PASSWORD', 'Cursor2026!'),
        'name' => env('FORAY_ADMIN_NAME', 'Robin Foray'),
        'title' => env('FORAY_ADMIN_TITLE', 'Root Operator'),
        'avatar_seed' => env('FORAY_ADMIN_AVATAR_SEED', 'robin-foray'),
    ],

    'qr' => [
        'public_base_url' => env('FORAY_QR_PUBLIC_BASE_URL', env('APP_URL', 'http://localhost')),
    ],

    'mail' => [
        'domain' => env('FORAY_MAIL_DOMAIN', 'foray.hu'),
        'display_name' => env('FORAY_MAIL_DISPLAY_NAME', 'Foray Family Mail'),
        'imap_host' => env('FORAY_MAIL_IMAP_HOST', 'mail.foray.hu'),
        'imap_port' => env('FORAY_MAIL_IMAP_PORT', 993),
        'smtp_host' => env('FORAY_MAIL_SMTP_HOST', 'mail.foray.hu'),
        'smtp_port' => env('FORAY_MAIL_SMTP_PORT', 465),
        'webmail_url' => env('FORAY_MAIL_WEBMAIL_URL', 'https://webmail.foray.hu'),
        'admin_notes' => env(
            'FORAY_MAIL_ADMIN_NOTES',
            'Családi @foray.hu postafiókok nyilvántartása. A tényleges mailbox létrehozás a levelezőszerveren történik; itt az inventory és a beállítások élnek.'
        ),
    ],

];

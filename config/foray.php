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

];

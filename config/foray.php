<?php

return [

    'admin' => [
        'email' => env('FORAY_ADMIN_EMAIL', 'admin@foray.local'),
        'password' => env('FORAY_ADMIN_PASSWORD', 'password'),
        'name' => env('FORAY_ADMIN_NAME', 'Root Operator'),
        'title' => env('FORAY_ADMIN_TITLE', 'Root Operator'),
        'avatar_seed' => env('FORAY_ADMIN_AVATAR_SEED', 'root-operator'),
    ],

];

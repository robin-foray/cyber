<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'robin.foray@gmail.com'],
            [
                'name' => 'Robin',
                'password' => 'Cursor2026!',
                'role' => 'admin',
                'title' => 'System Admin',
                'email_verified_at' => now(),
            ],
        );
    }
}

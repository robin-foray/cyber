<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => config('foray.admin.email')],
            [
                'name' => config('foray.admin.name'),
                'password' => Hash::make(config('foray.admin.password')),
                'role' => 'admin',
                'title' => config('foray.admin.title'),
                'avatar_seed' => config('foray.admin.avatar_seed'),
            ],
        );
    }
}

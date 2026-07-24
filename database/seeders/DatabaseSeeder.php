<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(MachineSeeder::class);
        $this->call(TechStackSeeder::class);
        $this->call(UsefulSiteSeeder::class);
        $this->call(FreeApiSeeder::class);
    }
}

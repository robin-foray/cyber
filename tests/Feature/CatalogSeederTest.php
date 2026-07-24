<?php

namespace Tests\Feature;

use App\Models\Machine;
use App\Models\UsefulSite;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\MachineSeeder;
use Database\Seeders\UsefulSiteSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CatalogSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_seeder_creates_admin_account(): void
    {
        $this->seed(AdminUserSeeder::class);

        $admin = User::query()->where('email', config('foray.admin.email'))->first();

        $this->assertNotNull($admin);
        $this->assertSame('admin', $admin->role);
        $this->assertTrue(Hash::check((string) config('foray.admin.password'), $admin->password));
    }

    public function test_machine_seeder_loads_gallery_catalog(): void
    {
        $this->seed(MachineSeeder::class);

        $this->assertGreaterThanOrEqual(1, Machine::query()->count());
        $this->get(route('machines.index'))->assertOk();
    }

    public function test_useful_site_seeder_loads_link_catalog(): void
    {
        $this->seed(UsefulSiteSeeder::class);

        $this->assertGreaterThanOrEqual(1, UsefulSite::query()->where('is_active', true)->count());
        $this->get(route('useful-sites.index'))->assertOk();
    }
}

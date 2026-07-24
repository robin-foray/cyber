<?php

namespace Tests\Feature\Cms;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class ForayInstallTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_is_idempotent(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('navigation_items', 20);
        $this->assertDatabaseCount('stack_technologies', 10);
        $this->assertDatabaseCount('dev_tool_pages', 11);
        $this->assertDatabaseCount('page_sections', 2);
        $this->assertSame(1, User::query()->where('role', 'admin')->count());
    }

    public function test_admin_user_seeder_uses_foray_config(): void
    {
        config([
            'foray.admin.email' => 'ops@foray.test',
            'foray.admin.password' => 'secret-ops',
            'foray.admin.name' => 'Ops Lead',
            'foray.admin.title' => 'Ops Lead',
            'foray.admin.avatar_seed' => 'ops-lead',
        ]);

        $this->seed(DatabaseSeeder::class);

        $admin = User::query()->where('email', 'ops@foray.test')->first();

        $this->assertNotNull($admin);
        $this->assertSame('admin', $admin->role);
        $this->assertSame('Ops Lead', $admin->name);
        $this->assertSame('Ops Lead', $admin->title);
        $this->assertSame('ops-lead', $admin->avatar_seed);
    }

    public function test_foray_install_command_runs_migrations_and_seeders(): void
    {
        Artisan::call('foray:install');

        $this->assertDatabaseCount('navigation_items', 20);
        $this->assertDatabaseHas('users', [
            'email' => config('foray.admin.email'),
            'role' => 'admin',
        ]);
    }
}

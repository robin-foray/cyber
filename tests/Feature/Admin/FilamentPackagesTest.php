<?php

namespace Tests\Feature\Admin;

use App\Models\Machine;
use App\Models\MachineCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class FilamentPackagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_loads_with_inventory_widgets(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Widget copy is Livewire-deferred; assert the dashboard mounts our widget classes.
        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertSee('App\\Filament\\Widgets\\MachinesMetricWidget', false)
            ->assertSee('App\\Filament\\Widgets\\UsefulSitesMetricWidget', false)
            ->assertSee('App\\Filament\\Widgets\\FreeApisMetricWidget', false)
            ->assertSee('App\\Filament\\Widgets\\TechStacksMetricWidget', false)
            ->assertSee('App\\Filament\\Widgets\\ContentInventoryBreakdownWidget', false)
            ->assertSee('App\\Filament\\Widgets\\RecentMachinesWidget', false);
    }

    public function test_admin_can_open_activity_logs_resource(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin/activity-logs')
            ->assertOk();
    }

    public function test_cms_model_changes_are_written_to_activity_log(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $category = MachineCategory::query()->create([
            'name' => 'Test category',
            'slug' => 'test-category',
            'sort_order' => 0,
        ]);

        $machine = Machine::query()->create([
            'machine_category_id' => $category->id,
            'name' => 'Logged Machine',
            'slug' => 'logged-machine',
            'description' => 'Activity log smoke',
            'image_url' => 'https://example.com/machine.png',
            'url' => null,
            'height' => 400,
            'sort_order' => 1,
        ]);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Machine::class,
            'subject_id' => $machine->id,
            'event' => 'created',
        ]);

        $this->assertGreaterThanOrEqual(1, Activity::query()->where('subject_type', Machine::class)->count());
    }

    public function test_catalog_list_pages_with_excel_export_load_for_admin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin/machines')
            ->assertOk();

        $this->actingAs($admin)
            ->get('/admin/useful-sites')
            ->assertOk();

        $this->actingAs($admin)
            ->get('/admin/free-apis')
            ->assertOk();

        $this->actingAs($admin)
            ->get('/admin/tech-stacks')
            ->assertOk();
    }
}

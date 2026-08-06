<?php

namespace Tests\Feature\Machines;

use App\Models\Machine;
use App\Models\MachineCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MachineGalleryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_machines_page(): void
    {
        $this->get(route('machines.index'))
            ->assertRedirect(route('home'));
    }

    public function test_machines_page_renders_with_categories_and_machines(): void
    {
        $category = MachineCategory::query()->create([
            'name' => 'Workstations',
            'slug' => 'workstations',
            'description' => 'Dev nodes',
            'sort_order' => 1,
        ]);

        Machine::query()->create([
            'machine_category_id' => $category->id,
            'name' => 'FORAY-WS-01',
            'slug' => 'foray-ws-01',
            'description' => 'Primary desk',
            'image_url' => 'https://example.com/machine.jpg',
            'height' => 500,
            'sort_order' => 1,
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('machines.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('machines/gallery')
                ->has('categories', 1)
                ->has('machines', 1)
                ->where('machines.0.name', 'FORAY-WS-01')
                ->where('activeCategory', null)
            );
    }

    public function test_machines_page_can_filter_by_category(): void
    {
        $alpha = MachineCategory::query()->create([
            'name' => 'Alpha',
            'slug' => 'alpha',
            'sort_order' => 1,
        ]);
        $beta = MachineCategory::query()->create([
            'name' => 'Beta',
            'slug' => 'beta',
            'sort_order' => 2,
        ]);

        Machine::query()->create([
            'machine_category_id' => $alpha->id,
            'name' => 'Alpha Unit',
            'slug' => 'alpha-unit',
            'image_url' => 'https://example.com/a.jpg',
            'height' => 400,
            'sort_order' => 1,
        ]);
        Machine::query()->create([
            'machine_category_id' => $beta->id,
            'name' => 'Beta Unit',
            'slug' => 'beta-unit',
            'image_url' => 'https://example.com/b.jpg',
            'height' => 400,
            'sort_order' => 1,
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('machines.index', ['category' => 'beta']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('machines/gallery')
                ->has('machines', 1)
                ->where('machines.0.name', 'Beta Unit')
                ->where('activeCategory', 'beta')
            );
    }
}

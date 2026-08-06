<?php

namespace Tests\Feature\FreeApis;

use App\Models\FreeApi;
use App\Models\FreeApiCategory;
use App\Models\User;
use Database\Seeders\FreeApiSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FreeApisPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_free_apis_page(): void
    {
        $this->get(route('free-apis.index'))
            ->assertRedirect(route('home'));
    }

    public function test_free_apis_page_renders_endpoints(): void
    {
        $category = FreeApiCategory::query()->create([
            'name' => 'Development',
            'slug' => 'development',
            'description' => 'Dev tools',
            'accent' => '#ccff00',
            'sort_order' => 1,
        ]);

        FreeApi::query()->create([
            'free_api_category_id' => $category->id,
            'name' => 'JSONPlaceholder',
            'slug' => 'jsonplaceholder',
            'url' => 'https://jsonplaceholder.typicode.com/',
            'base_url' => 'https://jsonplaceholder.typicode.com',
            'sample_endpoint' => 'https://jsonplaceholder.typicode.com/posts/1',
            'summary' => 'Fake REST API',
            'auth' => 'none',
            'https' => true,
            'cors' => true,
            'icon' => 'braces',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('free-apis.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('free-apis/index')
                ->has('categories', 1)
                ->has('apis', 1)
                ->where('apis.0.name', 'JSONPlaceholder')
                ->where('apis.0.auth', 'none')
                ->where('apis.0.host', 'jsonplaceholder.typicode.com')
            );
    }

    public function test_free_apis_page_hides_inactive_endpoints(): void
    {
        $category = FreeApiCategory::query()->create([
            'name' => 'Development',
            'slug' => 'development',
            'sort_order' => 1,
        ]);

        FreeApi::query()->create([
            'free_api_category_id' => $category->id,
            'name' => 'Hidden',
            'slug' => 'hidden',
            'url' => 'https://example.com',
            'auth' => 'none',
            'icon' => 'globe',
            'is_active' => false,
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('free-apis.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('free-apis/index')
                ->has('apis', 0)
            );
    }

    public function test_free_apis_page_filters_by_category(): void
    {
        $animals = FreeApiCategory::query()->create(['name' => 'Animals', 'slug' => 'animals', 'sort_order' => 1]);
        $dev = FreeApiCategory::query()->create(['name' => 'Development', 'slug' => 'development', 'sort_order' => 2]);

        FreeApi::query()->create([
            'free_api_category_id' => $animals->id,
            'name' => 'Dog API',
            'slug' => 'dog-api',
            'url' => 'https://dog.ceo/dog-api/',
            'auth' => 'none',
            'icon' => 'paw',
            'is_active' => true,
        ]);
        FreeApi::query()->create([
            'free_api_category_id' => $dev->id,
            'name' => 'httpbin',
            'slug' => 'httpbin',
            'url' => 'https://httpbin.org/',
            'auth' => 'none',
            'icon' => 'code',
            'is_active' => true,
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('free-apis.index', ['category' => 'development']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('apis', 1)
                ->where('apis.0.name', 'httpbin')
                ->where('activeCategory', 'development')
            );
    }

    public function test_free_api_seeder_loads_curated_catalog(): void
    {
        $this->seed(FreeApiSeeder::class);

        $this->assertGreaterThanOrEqual(8, FreeApiCategory::query()->count());
        $this->assertGreaterThanOrEqual(20, FreeApi::query()->where('is_active', true)->count());
        $this->assertDatabaseHas('free_apis', [
            'slug' => 'open-meteo',
            'auth' => 'none',
            'cors' => true,
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('free-apis.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('free-apis/index')
                ->has('apis')
                ->has('categories')
            );
    }
}

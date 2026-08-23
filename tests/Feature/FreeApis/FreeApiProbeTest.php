<?php

namespace Tests\Feature\FreeApis;

use App\Models\FreeApi;
use App\Models\FreeApiCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class FreeApiProbeTest extends TestCase
{
    use RefreshDatabase;

    private function seedDogApi(): FreeApi
    {
        $category = FreeApiCategory::query()->create([
            'name' => 'Animals',
            'slug' => 'animals',
            'sort_order' => 1,
        ]);

        return FreeApi::query()->create([
            'free_api_category_id' => $category->id,
            'name' => 'Dog API',
            'slug' => 'dog-api',
            'url' => 'https://dog.ceo/dog-api/',
            'base_url' => 'https://dog.ceo/api',
            'sample_endpoint' => 'https://dog.ceo/api/breeds/image/random',
            'summary' => 'Random dog images.',
            'auth' => 'none',
            'https' => true,
            'cors' => true,
            'icon' => 'paw',
            'sort_order' => 1,
            'is_active' => true,
        ]);
    }

    public function test_guests_cannot_probe_free_apis(): void
    {
        $this->postJson(route('free-apis.probe'), ['slug' => 'dog-api'])
            ->assertUnauthorized();
    }

    public function test_probe_returns_upstream_json_for_catalog_entry(): void
    {
        Http::fake([
            'dog.ceo/*' => Http::response([
                'message' => 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg',
                'status' => 'success',
            ], 200, ['Content-Type' => 'application/json']),
        ]);

        $this->seedDogApi();

        $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('free-apis.probe'), ['slug' => 'dog-api'])
            ->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('status', 200)
            ->assertJsonPath('parsed.status', 'success')
            ->assertJsonPath('endpoint', 'https://dog.ceo/api/breeds/image/random');
    }

    public function test_probe_rejects_unknown_slug(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('free-apis.probe'), ['slug' => 'missing-api'])
            ->assertNotFound();
    }

    public function test_probe_rejects_host_outside_catalog_entry(): void
    {
        $this->seedDogApi();

        $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('free-apis.probe'), [
                'slug' => 'dog-api',
                'endpoint' => 'https://example.com/secret',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['endpoint']);
    }

    public function test_probe_allows_custom_path_on_registered_host(): void
    {
        Http::fake([
            'dog.ceo/*' => Http::response(['status' => 'success'], 200),
        ]);

        $this->seedDogApi();

        $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('free-apis.probe'), [
                'slug' => 'dog-api',
                'endpoint' => 'https://dog.ceo/api/breeds/list/all',
            ])
            ->assertOk()
            ->assertJsonPath('endpoint', 'https://dog.ceo/api/breeds/list/all');
    }
}

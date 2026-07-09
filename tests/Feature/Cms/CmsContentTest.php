<?php

namespace Tests\Feature\Cms;

use App\Models\User;
use App\Services\ContentService;
use Database\Seeders\CmsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_content_service_returns_seeded_payload(): void
    {
        $this->seed(CmsSeeder::class);

        $payload = app(ContentService::class)->sharedPayload();

        $this->assertNotEmpty($payload['navigation']);
        $this->assertSame('Digital Future', $payload['hero']['titleAccent']);
        $this->assertCount(10, $payload['stacks']);
        $this->assertNotEmpty($payload['tickers']['topbar']);
        $this->assertNotEmpty($payload['deploymentSteps']);
    }

    public function test_authenticated_admin_can_open_filament_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk();
    }

    public function test_non_admin_cannot_access_filament_panel(): void
    {
        $user = User::factory()->create([
            'role' => 'member',
        ]);

        $this->assertFalse($user->canAccessPanel(filament()->getDefaultPanel()));
    }
}

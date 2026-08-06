<?php

namespace Tests\Feature\DevTools;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DevToolsPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_dev_tool_pages(): void
    {
        $this->get(route('dev-tools.console'))
            ->assertRedirect(route('home'));
    }

    public function test_console_page_renders(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('dev-tools.console'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('dev-tools/console'));
    }

    public function test_runtime_page_renders(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('dev-tools.runtime'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('dev-tools/runtime'));
    }

    public function test_cron_guru_page_renders(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('dev-tools.cron-guru'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('dev-tools/cron-guru'));
    }

    public function test_image_compressor_page_renders(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('dev-tools.image-compressor'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('dev-tools/image-compressor'));
    }

    public function test_deployments_page_renders(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('dev-tools.deployments'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('dev-tools/deployments'));
    }

    public function test_hash_generator_page_renders(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('dev-tools.hash-generator'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('dev-tools/hash-generator'));
    }

    public function test_hash_generator_can_create_bcrypt_hash(): void
    {
        $response = $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('dev-tools.hash-generator.bcrypt'), [
                'value' => 'secret',
                'rounds' => 10,
            ]);

        $response->assertOk()->assertJsonStructure(['hash']);
        $this->assertTrue(password_verify('secret', $response->json('hash')));
    }

    public function test_hash_generator_can_verify_bcrypt_hash(): void
    {
        $hash = password_hash('secret', PASSWORD_BCRYPT);
        $user = User::factory()->admin()->create();

        $this->actingAs($user)
            ->postJson(route('dev-tools.hash-generator.verify'), [
                'value' => 'secret',
                'hash' => $hash,
            ])
            ->assertOk()
            ->assertJson(['matches' => true]);

        $this->actingAs($user)
            ->postJson(route('dev-tools.hash-generator.verify'), [
                'value' => 'wrong',
                'hash' => $hash,
            ])
            ->assertOk()
            ->assertJson(['matches' => false]);
    }
}

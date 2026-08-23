<?php

namespace Tests\Feature\GuestPass;

use App\Models\GuestPass;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestPassRedemptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_token_starts_guest_session_and_redirects_home(): void
    {
        $pass = GuestPass::factory()->create([
            'display_name' => 'Acme Corp',
        ]);

        $this->get(route('guest-pass.redeem', ['token' => $pass->token]))
            ->assertRedirect(route('home'));

        $this->assertNotNull(session('guest_pass_id'));
    }

    public function test_expired_token_returns_gone(): void
    {
        $pass = GuestPass::factory()->expired()->create();

        $this->get(route('guest-pass.redeem', ['token' => $pass->token]))
            ->assertStatus(410);
    }

    public function test_guest_can_logout(): void
    {
        $pass = GuestPass::factory()->create();

        $this->get(route('guest-pass.redeem', ['token' => $pass->token]))->assertRedirect(route('home'));

        $this->post(route('guest-pass.logout'))
            ->assertRedirect(route('home'));

        $this->assertNull(session('guest_pass_id'));
    }
}

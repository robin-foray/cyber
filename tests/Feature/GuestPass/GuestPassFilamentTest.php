<?php

namespace Tests\Feature\GuestPass;

use App\Models\GuestPass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestPassFilamentTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_guest_pass_admin_pages(): void
    {
        $pass = GuestPass::factory()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->get('/admin/guest-passes')
            ->assertOk();

        $this->actingAs(User::factory()->admin()->create())
            ->get('/admin/guest-passes/'.$pass->id)
            ->assertOk();

        $this->actingAs(User::factory()->admin()->create())
            ->get('/admin/guest-pass-stats-page')
            ->assertOk();
    }
}

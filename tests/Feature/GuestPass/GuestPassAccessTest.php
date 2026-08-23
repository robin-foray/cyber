<?php

namespace Tests\Feature\GuestPass;

use App\Models\GuestPass;
use App\Models\GuestPassView;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GuestPassAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_without_pass_cannot_visit_machines(): void
    {
        $this->get(route('machines.index'))
            ->assertRedirect(route('home'));
    }

    public function test_guest_with_pass_can_visit_allowed_pages(): void
    {
        $pass = GuestPass::factory()->create();

        $this->get(route('guest-pass.redeem', ['token' => $pass->token]));

        $this->get(route('machines.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('machines/gallery'));

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('guestPass.display_name', $pass->display_name)
            );
    }

    public function test_guest_with_pass_cannot_visit_profile(): void
    {
        $pass = GuestPass::factory()->create();

        $this->get(route('guest-pass.redeem', ['token' => $pass->token]));

        $this->get(route('profile.show'))
            ->assertRedirect(route('home'));
    }

    public function test_guest_page_views_are_recorded(): void
    {
        $pass = GuestPass::factory()->create();

        $this->get(route('guest-pass.redeem', ['token' => $pass->token]));
        $this->get(route('tech-stack.index'))->assertOk();

        $this->assertDatabaseHas('guest_pass_views', [
            'guest_pass_id' => $pass->id,
            'route_name' => 'tech-stack.index',
        ]);

        $pass->refresh();
        $this->assertGreaterThanOrEqual(1, $pass->view_count);
        $this->assertGreaterThanOrEqual(1, GuestPassView::query()->where('guest_pass_id', $pass->id)->count());
    }

    public function test_admin_still_has_full_access(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('machines.index'))
            ->assertOk();

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('profile.show'))
            ->assertOk();
    }
}

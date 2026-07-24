<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CyberProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_profile(): void
    {
        $this->get(route('profile.show'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_profile(): void
    {
        $user = User::factory()->create([
            'title' => 'Neural Operator',
            'bio' => 'Building the mesh.',
        ]);

        $this->actingAs($user)
            ->get(route('profile.show'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('profile'));
    }

    public function test_authenticated_users_can_update_profile_identity(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Robin Foray',
                'title' => 'System Admin',
                'avatar_seed' => 'robin',
                'bio' => 'Foray core operator.',
            ])
            ->assertRedirect(route('profile.show'));

        $user->refresh();

        $this->assertSame('Robin Foray', $user->name);
        $this->assertSame('System Admin', $user->title);
        $this->assertSame('robin', $user->avatar_seed);
        $this->assertSame('Foray core operator.', $user->bio);
    }
}

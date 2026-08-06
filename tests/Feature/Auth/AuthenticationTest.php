<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_is_rendered_on_the_index(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('auth/login'));
    }

    public function test_login_path_redirects_guests_to_the_index(): void
    {
        $this->get('/login')->assertRedirect(route('home'));
    }

    public function test_admin_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->admin()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_authenticated_users_see_welcome_on_the_index(): void
    {
        $user = User::factory()->admin()->create();

        $this->actingAs($user)
            ->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('welcome'));
    }

    public function test_non_admin_users_cannot_authenticate(): void
    {
        $user = User::factory()->create();

        $this->from('/')
            ->post('/login', [
                'email' => $user->email,
                'password' => 'password',
            ])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->admin()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->admin()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect(route('home'));
    }
}

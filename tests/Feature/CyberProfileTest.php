<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CyberProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_profile(): void
    {
        $this->get(route('profile.show'))->assertRedirect(route('home'));
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

    public function test_authenticated_users_can_upload_a_profile_avatar(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'avatar_seed' => 'seed-before',
        ]);

        $file = UploadedFile::fake()->image('operator.png', 120, 120);

        $this->actingAs($user)
            ->post(route('profile.update'), [
                'name' => $user->name,
                'title' => $user->title,
                'avatar_seed' => $user->avatar_seed,
                'bio' => $user->bio,
                'avatar' => $file,
                'remove_avatar' => 0,
                '_method' => 'patch',
            ])
            ->assertRedirect(route('profile.show'));

        $user->refresh();

        $this->assertNotNull($user->avatar_path);
        $this->assertTrue($user->has_custom_avatar);
        Storage::disk('public')->assertExists($user->avatar_path);
        $this->assertStringStartsWith('/media/avatar', $user->avatar_url);
        $this->assertStringNotContainsString('dicebear.com', $user->avatar_url);
    }

    public function test_uploaded_avatar_is_served_via_media_route(): void
    {
        Storage::fake('public');

        $path = UploadedFile::fake()->image('served.png', 64, 64)->store('avatars', 'public');

        $user = User::factory()->create([
            'avatar_path' => $path,
            'avatar_seed' => 'should-not-win',
        ]);

        $this->actingAs($user)
            ->get(route('profile.avatar'))
            ->assertOk();

        $this->actingAs($user)
            ->get(route('profile.show'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.has_custom_avatar', true)
                ->where('auth.user.avatar_url', fn ($url) => str_starts_with($url, '/media/avatar')));
    }

    public function test_authenticated_users_can_remove_a_custom_profile_avatar(): void
    {
        Storage::fake('public');

        $path = UploadedFile::fake()->image('old.png')->store('avatars', 'public');

        $user = User::factory()->create([
            'avatar_path' => $path,
            'avatar_seed' => 'fallback-seed',
        ]);

        $this->actingAs($user)
            ->post(route('profile.update'), [
                'name' => $user->name,
                'title' => $user->title,
                'avatar_seed' => 'fallback-seed',
                'bio' => $user->bio,
                'remove_avatar' => 1,
                '_method' => 'patch',
            ])
            ->assertRedirect(route('profile.show'));

        $user->refresh();

        $this->assertNull($user->avatar_path);
        $this->assertFalse($user->has_custom_avatar);
        Storage::disk('public')->assertMissing($path);
        $this->assertStringContainsString('dicebear.com', $user->avatar_url);
        $this->assertStringContainsString('fallback-seed', $user->avatar_url);
    }

    public function test_upload_wins_over_remove_avatar_flag(): void
    {
        Storage::fake('public');

        $old = UploadedFile::fake()->image('old.png')->store('avatars', 'public');

        $user = User::factory()->create([
            'avatar_path' => $old,
            'avatar_seed' => 'seed',
        ]);

        $file = UploadedFile::fake()->image('new.png', 80, 80);

        $this->actingAs($user)
            ->post(route('profile.update'), [
                'name' => $user->name,
                'title' => $user->title,
                'avatar_seed' => 'seed',
                'bio' => $user->bio,
                'avatar' => $file,
                'remove_avatar' => 1,
                '_method' => 'patch',
            ])
            ->assertRedirect(route('profile.show'));

        $user->refresh();

        $this->assertNotNull($user->avatar_path);
        $this->assertNotSame($old, $user->avatar_path);
        Storage::disk('public')->assertExists($user->avatar_path);
        Storage::disk('public')->assertMissing($old);
        $this->assertTrue($user->has_custom_avatar);
    }
}

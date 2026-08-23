<?php

namespace Database\Factories;

use App\Models\GuestPass;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GuestPass>
 */
class GuestPassFactory extends Factory
{
    protected $model = GuestPass::class;

    public function definition(): array
    {
        return [
            'token' => Str::random(48),
            'label' => fake()->company(),
            'display_name' => fake()->name(),
            'title' => 'Guest Visitor',
            'bio' => fake()->sentence(),
            'avatar_seed' => Str::slug(fake()->userName()),
            'expires_at' => now()->addDay(),
            'allowed_routes' => null,
            'view_count' => 0,
            'is_active' => true,
            'created_by' => User::factory()->admin(),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn (): array => [
            'expires_at' => now()->subHour(),
        ]);
    }

    public function revoked(): static
    {
        return $this->state(fn (): array => [
            'revoked_at' => now(),
            'is_active' => false,
        ]);
    }
}

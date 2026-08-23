<?php

namespace Database\Factories;

use App\Models\QrLink;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QrLink>
 */
class QrLinkFactory extends Factory
{
    protected $model = QrLink::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'destination_url' => fake()->url(),
            'notes' => fake()->optional()->sentence(),
            'scan_count' => 0,
            'is_active' => true,
            'created_by' => User::factory()->admin(),
        ];
    }
}

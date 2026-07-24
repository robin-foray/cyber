<?php

namespace Tests\Feature\TechStack;

use App\Models\TechStack;
use Database\Seeders\TechStackSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TechStackSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_tech_stack_seeder_loads_catalog_with_svg_icons(): void
    {
        $this->seed(TechStackSeeder::class);

        $this->assertDatabaseCount('tech_categories', 5);
        $this->assertSame(26, TechStack::query()->where('is_active', true)->count());

        $laravel = TechStack::query()->where('slug', 'laravel')->first();

        $this->assertNotNull($laravel);
        $this->assertSame('stacks/laravel.svg', $laravel->icon);
        $this->assertFileExists(public_path($laravel->icon));
        $this->assertStringContainsString('PHP-s', (string) $laravel->summary);

        $this->get(route('tech-stack.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tech-stack/index')
                ->has('stacks', 26)
                ->where('stacks.0.icon', 'stacks/laravel.svg')
            );
    }
}

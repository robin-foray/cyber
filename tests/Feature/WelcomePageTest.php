<?php

namespace Tests\Feature;

use Database\Seeders\FreeApiSeeder;
use Database\Seeders\MachineSeeder;
use Database\Seeders\TechStackSeeder;
use Database\Seeders\UsefulSiteSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WelcomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_renders_categorized_stacks_from_database(): void
    {
        $this->seed(TechStackSeeder::class);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->has('categories', 5)
                ->has('stacks', 26)
                ->has('integrity')
                ->has('telemetry.counts')
                ->where('categories.0.name', 'Backend')
                ->where('categories.0.stacks.0.name', 'Laravel')
                ->where('categories.0.stacks.0.icon', 'stacks/laravel.svg')
                ->where('stacks.0.name', 'Laravel')
                ->where('telemetry.counts.stacks', 26)
                ->where('telemetry.counts.layers', 5)
                ->where('integrity.0.name', 'Git')
            );
    }

    public function test_welcome_page_telemetry_includes_module_counts(): void
    {
        $this->seed([
            TechStackSeeder::class,
            MachineSeeder::class,
            UsefulSiteSeeder::class,
            FreeApiSeeder::class,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('telemetry.status', 'online')
                ->where('telemetry.node', 'foray-core')
                ->where('telemetry.counts.stacks', 26)
                ->where('telemetry.counts.free_apis', fn ($count) => $count >= 20)
                ->where('telemetry.counts.machines', fn ($count) => $count >= 1)
                ->where('telemetry.counts.useful_sites', fn ($count) => $count >= 1)
            );
    }

    public function test_welcome_page_hides_empty_categories_and_inactive_stacks(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->has('categories', 0)
                ->has('stacks', 0)
                ->has('integrity', 0)
                ->where('telemetry.counts.stacks', 0)
            );
    }
}

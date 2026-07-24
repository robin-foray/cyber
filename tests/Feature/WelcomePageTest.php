<?php

namespace Tests\Feature;

use Database\Seeders\CmsSeeder;
use Database\Seeders\TechStackSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WelcomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_renders_cms_payload(): void
    {
        $this->seed(CmsSeeder::class);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->has('cms.hero')
                ->has('cms.stacks')
                ->has('cms.navigation')
                ->where('cms.hero.titleAccent', 'Digital Future')
            );
    }

    public function test_welcome_page_includes_catalog_navigation_links(): void
    {
        $this->seed(CmsSeeder::class);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('cms.navigation', fn ($navigation) => collect($navigation)
                    ->pluck('href')
                    ->intersect(['/machines', '/tech-stack', '/useful-sites', '/free-apis'])
                    ->count() === 4)
            );
    }

    public function test_welcome_page_uses_tech_stack_registry_cards(): void
    {
        $this->seed([CmsSeeder::class, TechStackSeeder::class]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->has('stacks')
                ->where('stacks.0.name', 'Laravel')
                ->where('stacks.0.icon', 'stacks/laravel.svg')
                ->where('stacks.0.category', 'Backend')
                ->has('stacks.0.level')
                ->has('stacks.0.accent')
                ->has('integrity')
                ->has('telemetry.avg_integrity')
                ->has('telemetry.counts.stacks')
            );
    }
}

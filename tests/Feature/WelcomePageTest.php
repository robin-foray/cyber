<?php

namespace Tests\Feature;

use Database\Seeders\CmsSeeder;
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
}

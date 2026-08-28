<?php

namespace Tests\Feature;

use Database\Seeders\CmsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WelcomePreviewPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_preview_is_available_in_local_environment(): void
    {
        $this->seed(CmsSeeder::class);

        $this->get(route('test.welcome-preview'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('cms.hero.titleAccent', 'kód & projektek')
            );
    }
}

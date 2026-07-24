<?php

namespace Tests\Feature\UsefulSites;

use App\Models\UsefulSite;
use App\Models\UsefulSiteCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UsefulSitesPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_useful_sites_page_renders_links(): void
    {
        $category = UsefulSiteCategory::query()->create([
            'name' => 'Media Tools',
            'slug' => 'media-tools',
            'description' => 'Converters',
            'sort_order' => 1,
        ]);

        UsefulSite::query()->create([
            'useful_site_category_id' => $category->id,
            'name' => '123apps',
            'slug' => '123apps',
            'url' => 'https://123apps.com/',
            'summary' => 'Online tools',
            'icon' => 'film',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->get(route('useful-sites.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('useful-sites/index')
                ->has('categories', 1)
                ->has('sites', 1)
                ->where('sites.0.name', '123apps')
                ->where('sites.0.host', '123apps.com')
            );
    }

    public function test_useful_sites_page_filters_by_category(): void
    {
        $design = UsefulSiteCategory::query()->create(['name' => 'Design', 'slug' => 'design', 'sort_order' => 1]);
        $dev = UsefulSiteCategory::query()->create(['name' => 'Dev', 'slug' => 'dev', 'sort_order' => 2]);

        UsefulSite::query()->create([
            'useful_site_category_id' => $design->id,
            'name' => 'Figma',
            'slug' => 'figma',
            'url' => 'https://www.figma.com/',
            'icon' => 'layers',
            'is_active' => true,
        ]);
        UsefulSite::query()->create([
            'useful_site_category_id' => $dev->id,
            'name' => 'Can I Use',
            'slug' => 'caniuse',
            'url' => 'https://caniuse.com/',
            'icon' => 'globe',
            'is_active' => true,
        ]);

        $this->get(route('useful-sites.index', ['category' => 'design']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('sites', 1)
                ->where('sites.0.name', 'Figma')
                ->where('activeCategory', 'design')
            );
    }

    public function test_useful_sites_page_hides_inactive_links(): void
    {
        $category = UsefulSiteCategory::query()->create([
            'name' => 'Design',
            'slug' => 'design',
            'sort_order' => 1,
        ]);

        UsefulSite::query()->create([
            'useful_site_category_id' => $category->id,
            'name' => 'Hidden',
            'slug' => 'hidden',
            'url' => 'https://example.com',
            'icon' => 'link',
            'is_active' => false,
        ]);

        $this->get(route('useful-sites.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('useful-sites/index')
                ->has('sites', 0)
            );
    }
}

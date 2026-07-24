<?php

namespace Tests\Feature\TechStack;

use App\Models\TechCategory;
use App\Models\TechStack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TechStackPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_tech_stack_page_renders_modules(): void
    {
        $category = TechCategory::query()->create([
            'name' => 'Backend',
            'slug' => 'backend',
            'description' => 'Core',
            'accent' => '#ccff00',
            'sort_order' => 1,
        ]);

        TechStack::query()->create([
            'tech_category_id' => $category->id,
            'name' => 'Laravel',
            'slug' => 'laravel',
            'signal' => 'runtime_core',
            'summary' => 'Backend core',
            'bullets' => ['routing'],
            'docs_url' => 'https://laravel.com/docs',
            'icon' => 'server',
            'level' => 90,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->get(route('tech-stack.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tech-stack/index')
                ->has('categories', 1)
                ->has('stacks', 1)
                ->where('stacks.0.name', 'Laravel')
            );
    }

    public function test_tech_stack_page_hides_inactive_modules(): void
    {
        $category = TechCategory::query()->create([
            'name' => 'Backend',
            'slug' => 'backend',
            'sort_order' => 1,
        ]);

        TechStack::query()->create([
            'tech_category_id' => $category->id,
            'name' => 'Hidden',
            'slug' => 'hidden',
            'icon' => 'cpu',
            'level' => 10,
            'sort_order' => 1,
            'is_active' => false,
        ]);

        $this->get(route('tech-stack.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tech-stack/index')
                ->has('stacks', 0)
            );
    }

    public function test_tech_stack_page_filters_by_category(): void
    {
        $backend = TechCategory::query()->create(['name' => 'Backend', 'slug' => 'backend', 'sort_order' => 1]);
        $frontend = TechCategory::query()->create(['name' => 'Frontend', 'slug' => 'frontend', 'sort_order' => 2]);

        TechStack::query()->create([
            'tech_category_id' => $backend->id,
            'name' => 'Laravel',
            'slug' => 'laravel',
            'icon' => 'server',
            'level' => 90,
            'is_active' => true,
        ]);
        TechStack::query()->create([
            'tech_category_id' => $frontend->id,
            'name' => 'React',
            'slug' => 'react',
            'icon' => 'code',
            'level' => 90,
            'is_active' => true,
        ]);

        $this->get(route('tech-stack.index', ['category' => 'frontend']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('stacks', 1)
                ->where('stacks.0.name', 'React')
                ->where('activeCategory', 'frontend')
            );
    }
}

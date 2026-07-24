<?php

namespace App\Http\Controllers;

use App\Models\TechCategory;
use App\Models\TechStack;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TechStackController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = TechCategory::query()
            ->with(['stacks' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (TechCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'accent' => $category->accent,
                'count' => $category->stacks->count(),
            ]);

        $activeSlug = $request->string('category')->toString();
        $activeCategory = $categories->firstWhere('slug', $activeSlug);

        $stacksQuery = TechStack::query()
            ->with('category:id,name,slug,accent')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($activeCategory) {
            $stacksQuery->whereHas('category', fn ($query) => $query->where('slug', $activeCategory['slug']));
        }

        $stacks = $stacksQuery->get()->map(fn (TechStack $stack) => [
            'id' => $stack->id,
            'name' => $stack->name,
            'slug' => $stack->slug,
            'signal' => $stack->signal,
            'summary' => $stack->summary,
            'bullets' => $stack->bullets ?? [],
            'docs_url' => $stack->docs_url,
            'icon' => $stack->icon,
            'level' => $stack->level,
            'category' => $stack->category?->name,
            'category_slug' => $stack->category?->slug,
            'accent' => $stack->category?->accent ?? '#ccff00',
        ]);

        return Inertia::render('tech-stack/index', [
            'categories' => $categories,
            'stacks' => $stacks,
            'activeCategory' => $activeCategory['slug'] ?? null,
        ]);
    }
}

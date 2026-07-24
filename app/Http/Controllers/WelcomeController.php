<?php

namespace App\Http\Controllers;

use App\Models\FreeApi;
use App\Models\Machine;
use App\Models\TechCategory;
use App\Models\TechStack;
use App\Models\UsefulSite;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        $categories = TechCategory::query()
            ->with(['stacks' => fn ($query) => $query
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->filter(fn (TechCategory $category) => $category->stacks->isNotEmpty())
            ->values()
            ->map(fn (TechCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'accent' => $category->accent,
                'stacks' => $category->stacks->map(fn ($stack) => [
                    'id' => $stack->id,
                    'name' => $stack->name,
                    'slug' => $stack->slug,
                    'signal' => $stack->signal,
                    'summary' => $stack->summary,
                    'bullets' => $stack->bullets ?? [],
                    'docs' => $stack->docs_url,
                    'icon' => $stack->icon,
                    'level' => $stack->level,
                    'category' => $category->name,
                    'category_slug' => $category->slug,
                    'accent' => $category->accent,
                ])->values(),
            ]);

        $stacks = $categories->flatMap(fn (array $category) => $category['stacks'])->values();

        $avgIntegrity = $stacks->isEmpty()
            ? 0
            : (int) round($stacks->avg('level'));

        $integrity = $stacks
            ->sortByDesc('level')
            ->take(5)
            ->values()
            ->map(fn (array $stack) => [
                'id' => $stack['id'],
                'name' => $stack['name'],
                'slug' => $stack['slug'],
                'icon' => $stack['icon'],
                'level' => $stack['level'],
                'category' => $stack['category'],
                'signal' => $stack['signal'],
            ]);

        $telemetry = [
            'status' => 'online',
            'node' => 'foray-core',
            'protocol' => 'stacks/v1',
            'avg_integrity' => $avgIntegrity,
            'counts' => [
                'stacks' => TechStack::query()->where('is_active', true)->count(),
                'layers' => $categories->count(),
                'machines' => Machine::query()->count(),
                'free_apis' => FreeApi::query()->where('is_active', true)->count(),
                'useful_sites' => UsefulSite::query()->where('is_active', true)->count(),
            ],
            'top_layer' => $categories
                ->sortByDesc(fn (array $category) => count($category['stacks']))
                ->first()['name'] ?? null,
            'scanned_at' => now()->toIso8601String(),
        ];

        return Inertia::render('welcome', [
            'categories' => $categories,
            'stacks' => $stacks,
            'integrity' => $integrity,
            'telemetry' => $telemetry,
        ]);
    }
}

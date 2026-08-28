<?php

namespace App\Http\Controllers;

use App\Models\FreeApi;
use App\Models\Machine;
use App\Models\TechCategory;
use App\Models\TechStack;
use App\Models\UsefulSite;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        $payload = Cache::remember('welcome.page', now()->addMinutes(10), function (): array {
            // Persist plain arrays only — Redis+Octane can unserialize Collections as
            // __PHP_Incomplete_Class and blank the logged-in home page.
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
                    ])->values()->all(),
                ])
                ->all();

            $stacks = collect($categories)->flatMap(fn (array $category) => $category['stacks'])->values();

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
                ])
                ->all();

            $stacks = $stacks->all();

            return [
                'categories' => $categories,
                'stacks' => $stacks,
                'integrity' => $integrity,
                'telemetry' => [
                    'status' => 'Elérhető',
                    'node' => 'foray.hu',
                    'protocol' => 'stacks/v1',
                    'avg_integrity' => $avgIntegrity,
                    'counts' => [
                        'stacks' => TechStack::query()->where('is_active', true)->count(),
                        'layers' => count($categories),
                        'machines' => Machine::query()->count(),
                        'free_apis' => FreeApi::query()->where('is_active', true)->count(),
                        'useful_sites' => UsefulSite::query()->where('is_active', true)->count(),
                    ],
                    'top_layer' => collect($categories)
                        ->sortByDesc(fn (array $category) => count($category['stacks']))
                        ->first()['name'] ?? null,
                ],
            ];
        });

        $payload['telemetry']['scanned_at'] = now()->toIso8601String();

        return Inertia::render('welcome', $payload);
    }
}

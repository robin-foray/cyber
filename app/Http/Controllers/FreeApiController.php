<?php

namespace App\Http\Controllers;

use App\Models\FreeApi;
use App\Models\FreeApiCategory;
use App\Services\FreeApiProbeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FreeApiController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = FreeApiCategory::query()
            ->withCount(['apis' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description', 'accent']);

        $activeSlug = $request->string('category')->toString();
        $activeCategory = $categories->firstWhere('slug', $activeSlug);

        $apisQuery = FreeApi::query()
            ->with('category:id,name,slug,accent')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($activeCategory) {
            $apisQuery->where('free_api_category_id', $activeCategory->id);
        }

        $apis = $apisQuery->get()->map(fn (FreeApi $api) => [
            'id' => $api->id,
            'name' => $api->name,
            'slug' => $api->slug,
            'url' => $api->url,
            'base_url' => $api->base_url,
            'sample_endpoint' => $api->sample_endpoint,
            'summary' => $api->summary,
            'auth' => $api->auth,
            'https' => $api->https,
            'cors' => $api->cors,
            'icon' => $api->icon,
            'category' => $api->category?->name,
            'category_slug' => $api->category?->slug,
            'accent' => $api->category?->accent ?? '#ccff00',
            'host' => parse_url($api->url, PHP_URL_HOST),
        ]);

        return Inertia::render('free-apis/index', [
            'categories' => $categories,
            'apis' => $apis,
            'activeCategory' => $activeCategory?->slug,
        ]);
    }

    public function probe(Request $request, FreeApiProbeService $probe): JsonResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:120'],
            'endpoint' => ['nullable', 'string', 'url', 'max:2048'],
        ]);

        $api = FreeApi::query()
            ->where('slug', $validated['slug'])
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($probe->execute($api, $validated['endpoint'] ?? null));
    }
}

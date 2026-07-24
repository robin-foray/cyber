<?php

namespace App\Http\Controllers;

use App\Models\FreeApi;
use App\Models\FreeApiCategory;
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
}

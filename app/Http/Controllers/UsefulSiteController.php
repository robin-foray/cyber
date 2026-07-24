<?php

namespace App\Http\Controllers;

use App\Models\UsefulSite;
use App\Models\UsefulSiteCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UsefulSiteController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = UsefulSiteCategory::query()
            ->withCount(['sites' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description']);

        $activeSlug = $request->string('category')->toString();
        $activeCategory = $categories->firstWhere('slug', $activeSlug);

        $sitesQuery = UsefulSite::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($activeCategory) {
            $sitesQuery->where('useful_site_category_id', $activeCategory->id);
        }

        $sites = $sitesQuery->get()->map(fn (UsefulSite $site) => [
            'id' => $site->id,
            'name' => $site->name,
            'slug' => $site->slug,
            'url' => $site->url,
            'summary' => $site->summary,
            'icon' => $site->icon,
            'category' => $site->category?->name,
            'category_slug' => $site->category?->slug,
            'host' => parse_url($site->url, PHP_URL_HOST),
        ]);

        return Inertia::render('useful-sites/index', [
            'categories' => $categories,
            'sites' => $sites,
            'activeCategory' => $activeCategory?->slug,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\MachineCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MachineGalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = MachineCategory::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description']);

        $activeSlug = $request->string('category')->toString();
        $activeCategory = $categories->firstWhere('slug', $activeSlug);

        $machinesQuery = Machine::query()
            ->with('category:id,name,slug')
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($activeCategory) {
            $machinesQuery->where('machine_category_id', $activeCategory->id);
        }

        $machines = $machinesQuery->get()->map(fn (Machine $machine) => [
            'id' => $machine->id,
            'name' => $machine->name,
            'slug' => $machine->slug,
            'description' => $machine->description,
            'img' => $machine->image_url,
            'url' => $machine->url,
            'height' => $machine->height,
            'category' => $machine->category?->name,
            'category_slug' => $machine->category?->slug,
        ]);

        return Inertia::render('machines/gallery', [
            'categories' => $categories,
            'machines' => $machines,
            'activeCategory' => $activeCategory?->slug,
        ]);
    }
}

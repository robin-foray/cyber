<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the cyber profile page.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('profile');
    }

    /**
     * Update the cyber identity fields.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:120'],
            'avatar_seed' => ['nullable', 'string', 'max:120'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $request->user()->fill($validated)->save();

        return to_route('profile.show')->with('status', 'identity-updated');
    }
}

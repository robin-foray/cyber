<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'avatar' => ['nullable', 'image', 'max:2048'],
            'remove_avatar' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();

        if ($request->boolean('remove_avatar') && $user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->avatar_path = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            $user->avatar_path = $request->file('avatar')->store('avatars', 'public');
        }

        $user->fill([
            'name' => $validated['name'],
            'title' => $validated['title'] ?? null,
            'avatar_seed' => $validated['avatar_seed'] ?? null,
            'bio' => $validated['bio'] ?? null,
        ])->save();

        return to_route('profile.show')->with('status', 'identity-updated');
    }
}

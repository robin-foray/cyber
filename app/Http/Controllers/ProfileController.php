<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
     * Stream a user's avatar from storage (or legacy public/avatars).
     *
     * Avoids depending on the public/storage symlink.
     */
    public function avatar(Request $request): BinaryFileResponse|StreamedResponse
    {
        $user = $request->user();
        abort_unless($user && filled($user->avatar_path), 404);

        $path = ltrim($user->avatar_path, '/');

        if (is_file(public_path($path))) {
            return response()->file(public_path($path));
        }

        abort_unless(Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path);
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
        $uploading = $request->hasFile('avatar');
        $removing = $request->boolean('remove_avatar') && ! $uploading;

        if ($removing && $user->avatar_path) {
            $this->deleteAvatarFile($user->avatar_path);
            $user->avatar_path = null;
        }

        if ($uploading) {
            if ($user->avatar_path) {
                $this->deleteAvatarFile($user->avatar_path);
            }

            // Writable storage disk (www-data); served via profile.avatar route.
            $path = $request->file('avatar')->store('avatars', 'public');

            if ($path === false) {
                throw ValidationException::withMessages([
                    'avatar' => 'Avatar upload failed. Ensure storage/app/public is writable.',
                ]);
            }

            $user->avatar_path = $path;
        }

        $user->fill([
            'name' => $validated['name'],
            'title' => $validated['title'] ?? null,
            'avatar_seed' => $validated['avatar_seed'] ?? null,
            'bio' => $validated['bio'] ?? null,
        ])->save();

        return to_route('profile.show')->with('status', 'identity-updated');
    }

    /**
     * Remove an avatar from storage and the legacy public web root.
     */
    private function deleteAvatarFile(string $path): void
    {
        Storage::disk('public')->delete($path);
        Storage::disk('public_web')->delete($path);
    }
}

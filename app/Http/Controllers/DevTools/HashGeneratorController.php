<?php

namespace App\Http\Controllers\DevTools;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class HashGeneratorController extends Controller
{
    /**
     * Show the hash generator tool.
     */
    public function show(): Response
    {
        return Inertia::render('dev-tools/hash-generator');
    }

    /**
     * Generate a Laravel-compatible bcrypt hash.
     */
    public function bcrypt(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'value' => ['required', 'string', 'max:10000'],
            'rounds' => ['required', 'integer', 'min:4', 'max:14'],
        ]);

        return response()->json([
            'hash' => Hash::make($validated['value'], [
                'rounds' => $validated['rounds'],
            ]),
        ]);
    }

    /**
     * Verify a plaintext value against a bcrypt hash.
     */
    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'value' => ['required', 'string', 'max:10000'],
            'hash' => ['required', 'string', 'max:255'],
        ]);

        if (! str_starts_with($validated['hash'], '$2y$') && ! str_starts_with($validated['hash'], '$2a$') && ! str_starts_with($validated['hash'], '$2b$')) {
            throw ValidationException::withMessages([
                'hash' => 'The hash does not look like a bcrypt payload.',
            ]);
        }

        return response()->json([
            'matches' => Hash::check($validated['value'], $validated['hash']),
        ]);
    }
}

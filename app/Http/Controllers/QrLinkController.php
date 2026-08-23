<?php

namespace App\Http\Controllers;

use App\Models\QrLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class QrLinkController extends Controller
{
    public function index(Request $request): Response
    {
        $links = QrLink::query()
            ->where('created_by', $request->user()?->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (QrLink $link) => [
                'id' => $link->id,
                'name' => $link->name,
                'slug' => $link->slug,
                'destination_url' => $link->destination_url,
                'notes' => $link->notes,
                'public_url' => $link->public_url,
                'qr_preview_url' => $link->qr_preview_url,
                'scan_count' => $link->scan_count,
                'last_scanned_at' => $link->last_scanned_at?->toIso8601String(),
                'is_active' => $link->is_active,
                'updated_at' => $link->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('qr-links/index', [
            'links' => $links,
            'publicBaseUrl' => rtrim((string) config('foray.qr.public_base_url'), '/'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:64', 'alpha_dash', Rule::unique('qr_links', 'slug')],
            'destination_url' => ['required', 'url', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        QrLink::query()->create([
            ...$validated,
            'created_by' => $request->user()?->id,
        ]);

        return redirect()->route('qr-links.index');
    }

    public function update(Request $request, QrLink $qrLink): RedirectResponse
    {
        abort_unless($qrLink->created_by === $request->user()?->id, 403);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'destination_url' => ['sometimes', 'required', 'url', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $qrLink->update($validated);

        return redirect()->route('qr-links.index');
    }
}

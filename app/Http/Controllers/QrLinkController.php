<?php

namespace App\Http\Controllers;

use App\Models\QrLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QrLinkController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('qr-links/index', [
            ...$this->pageProps($request),
        ]);
    }

    public function mobile(Request $request): Response
    {
        return Inertia::render('qr-links/mobile', [
            ...$this->pageProps($request),
        ]);
    }

    /**
     * @return array{links: list<array<string, mixed>>, publicBaseUrl: string}
     */
    private function pageProps(Request $request): array
    {
        $links = QrLink::query()
            ->ownedBy($request->user())
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (QrLink $link) => $this->serializeLink($link));

        return [
            'links' => $links,
            'publicBaseUrl' => rtrim((string) config('foray.qr.public_base_url'), '/'),
        ];
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'destination_url' => ['required', 'url', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        QrLink::query()->create([
            ...$validated,
            'design' => QrLink::defaultDesign(),
            'created_by' => $request->user()?->id,
        ]);

        return back();
    }

    public function update(Request $request, QrLink $qrLink): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'destination_url' => ['sometimes', 'required', 'url', 'max:2048'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
            'design' => ['sometimes', 'array'],
            'design.style_id' => ['nullable', 'string', 'max:40'],
            'design.dark' => ['nullable', 'string', 'max:32'],
            'design.light' => ['nullable', 'string', 'max:32'],
            'design.module_shape' => ['nullable', 'string', 'max:20'],
            'design.eye_style' => ['nullable', 'string', 'max:20'],
            'design.logo_size' => ['nullable', 'integer', 'min:10', 'max:32'],
            'design.logo_pad' => ['nullable'],
            'design.logo_shape' => ['nullable', 'string', 'max:20'],
            'design.frame' => ['nullable', 'string', 'max:20'],
            'design.caption' => ['nullable', 'string', 'max:120'],
            'design.subtitle' => ['nullable', 'string', 'max:200'],
            'design.embed_html' => ['nullable', 'string', 'max:20000'],
            'logo' => ['nullable', 'file', 'max:2048', 'mimes:jpg,jpeg,png,webp,gif,svg'],
            'remove_logo' => ['sometimes', 'boolean'],
        ]);

        $qrLink->fill(collect($validated)->only(['name', 'destination_url', 'notes', 'is_active'])->all());

        if ($request->has('design')) {
            $qrLink->design = QrLink::normalizeDesign($request->input('design'));
        }

        if ($request->hasFile('logo')) {
            $qrLink->storeLogo($request->file('logo'));
        } elseif ($request->boolean('remove_logo')) {
            $qrLink->deleteLogoFile();
        }

        $qrLink->save();

        return back();
    }

    public function logo(QrLink $qrLink): StreamedResponse
    {
        abort_unless(filled($qrLink->logo_path), 404);

        $path = ltrim((string) $qrLink->logo_path, '/');

        abort_unless(Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeLink(QrLink $link): array
    {
        return [
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
            'design' => $link->normalizedDesign(),
            'logo_url' => $link->logo_url,
            'has_logo' => filled($link->logo_path),
        ];
    }

    public function destroy(Request $request, QrLink $qrLink): RedirectResponse
    {
        $qrLink->delete();

        return back();
    }
}

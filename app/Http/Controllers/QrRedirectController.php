<?php

namespace App\Http\Controllers;

use App\Models\QrLink;
use App\Models\QrLinkScan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QrRedirectController extends Controller
{
    public function __invoke(Request $request, string $slug): RedirectResponse
    {
        $link = QrLink::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        QrLinkScan::query()->create([
            'qr_link_id' => $link->id,
            'destination_url' => $link->destination_url,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 512),
            'scanned_at' => now(),
        ]);

        $link->forceFill([
            'scan_count' => $link->scan_count + 1,
            'last_scanned_at' => now(),
        ])->save();

        return redirect()->away($link->destination_url);
    }
}

<?php

namespace App\Services;

use App\Models\GuestPass;
use App\Models\GuestPassView;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class GuestPassViewTracker
{
    private const int DEDUPE_SECONDS = 8;

    public function record(Request $request, GuestPass $pass): void
    {
        if ($request->routeIs('guest-pass.*')) {
            return;
        }

        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return;
        }

        $path = '/'.ltrim($request->path(), '/');

        $recentDuplicate = GuestPassView::query()
            ->where('guest_pass_id', $pass->id)
            ->where('path', $path)
            ->where('viewed_at', '>=', Carbon::now()->subSeconds(self::DEDUPE_SECONDS))
            ->exists();

        if ($recentDuplicate) {
            return;
        }

        GuestPassView::query()->create([
            'guest_pass_id' => $pass->id,
            'path' => $path,
            'route_name' => $request->route()?->getName(),
            'page_label' => $this->pageLabel($request),
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 512),
            'viewed_at' => now(),
        ]);

        $pass->forceFill([
            'view_count' => $pass->view_count + 1,
            'last_used_at' => now(),
        ])->save();
    }

    private function pageLabel(Request $request): ?string
    {
        return match ($request->route()?->getName()) {
            'home' => 'Welcome',
            'machines.index' => 'Machines',
            'tech-stack.index' => 'Tech Stack',
            'useful-sites.index' => 'Useful Sites',
            'free-apis.index' => 'Free APIs',
            default => $request->route()?->getName(),
        };
    }
}

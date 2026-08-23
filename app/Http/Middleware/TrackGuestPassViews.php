<?php

namespace App\Http\Middleware;

use App\Services\GuestPassSession;
use App\Services\GuestPassViewTracker;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackGuestPassViews
{
    public function __construct(
        private GuestPassSession $guestPassSession,
        private GuestPassViewTracker $viewTracker,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($request->user()?->is_admin) {
            return $response;
        }

        $pass = $this->guestPassSession->current($request);

        if ($pass !== null && $response->isSuccessful()) {
            $this->viewTracker->record($request, $pass);
        }

        return $response;
    }
}

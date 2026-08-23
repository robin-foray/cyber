<?php

namespace App\Http\Middleware;

use App\Services\GuestPassSession;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSiteAccess
{
    public function __construct(private GuestPassSession $guestPassSession) {}

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->is_admin) {
            return $next($request);
        }

        $pass = $this->guestPassSession->current($request);

        if ($pass === null) {
            return redirect()->route('home');
        }

        $routeName = $request->route()?->getName();

        if (! $pass->allowsRoute($routeName)) {
            abort(403, 'This guest pass cannot access this section.');
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\GuestPass;
use App\Services\GuestPassSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GuestPassController extends Controller
{
    public function __construct(private GuestPassSession $guestPassSession) {}

    public function redeem(Request $request, string $token): RedirectResponse
    {
        $pass = GuestPass::query()->where('token', $token)->firstOrFail();

        if (! $pass->isValid()) {
            abort(410, 'This guest pass has expired or been revoked.');
        }

        $this->guestPassSession->start($request, $pass);

        $pass->forceFill([
            'last_used_at' => now(),
        ])->save();

        return redirect()->route('home');
    }

    public function logout(Request $request): RedirectResponse
    {
        $this->guestPassSession->clear($request);

        return redirect()->route('home');
    }

    public function avatar(Request $request, GuestPass $guestPass): StreamedResponse|Response
    {
        $sessionPass = $this->guestPassSession->current($request);

        abort_unless(
            $request->user()?->is_admin || $sessionPass?->id === $guestPass->id,
            404,
        );

        abort_unless(filled($guestPass->avatar_path), 404);

        $path = ltrim($guestPass->avatar_path, '/');

        if (! Storage::disk('public')->exists($path)) {
            abort(404);
        }

        return Storage::disk('public')->response($path);
    }
}

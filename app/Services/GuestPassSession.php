<?php

namespace App\Services;

use App\Models\GuestPass;
use Illuminate\Http\Request;

class GuestPassSession
{
    public const SESSION_KEY = 'guest_pass_id';

    public function current(Request $request): ?GuestPass
    {
        $passId = $request->session()->get(self::SESSION_KEY);

        if (! is_numeric($passId)) {
            return null;
        }

        $pass = GuestPass::query()->find($passId);

        if ($pass === null || ! $pass->isValid()) {
            $request->session()->forget(self::SESSION_KEY);

            return null;
        }

        return $pass;
    }

    public function start(Request $request, GuestPass $pass): void
    {
        $request->session()->regenerate();
        $request->session()->put(self::SESSION_KEY, $pass->id);
    }

    public function clear(Request $request): void
    {
        $request->session()->forget(self::SESSION_KEY);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function sharedPayload(?GuestPass $pass): ?array
    {
        if ($pass === null) {
            return null;
        }

        return [
            'id' => $pass->id,
            'display_name' => $pass->display_name,
            'title' => $pass->title,
            'bio' => $pass->bio,
            'avatar_url' => $pass->avatar_url,
            'has_custom_avatar' => $pass->has_custom_avatar,
            'expires_at' => $pass->expires_at->toIso8601String(),
            'expires_label' => $pass->expires_at->timezone(config('app.timezone'))->format('Y-m-d H:i'),
            'label' => $pass->label,
        ];
    }
}

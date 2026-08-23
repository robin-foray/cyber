<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class GuestPass extends Model
{
    use HasFactory, LogsCmsActivity;

    public const DEFAULT_ALLOWED_ROUTES = [
        'home',
        'machines.index',
        'tech-stack.index',
        'useful-sites.index',
        'free-apis.index',
        'dev-tools.console',
        'dev-tools.runtime',
        'dev-tools.cron-guru',
        'dev-tools.image-compressor',
        'dev-tools.deployments',
        'dev-tools.hash-generator',
        'dev-tools.qr-generator',
        'dev-tools.php-syntax-checker',
        'dev-tools.html-syntax-checker',
        'dev-tools.color-converter',
        'dev-tools.regex-lab',
        'dev-tools.sql-builder',
    ];

    protected $fillable = [
        'token',
        'label',
        'display_name',
        'title',
        'bio',
        'avatar_path',
        'avatar_seed',
        'expires_at',
        'allowed_routes',
        'view_count',
        'last_used_at',
        'revoked_at',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'last_used_at' => 'datetime',
            'revoked_at' => 'datetime',
            'allowed_routes' => 'array',
            'is_active' => 'boolean',
            'view_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (GuestPass $pass): void {
            if (blank($pass->token)) {
                $pass->token = Str::random(48);
            }

            if (blank($pass->avatar_seed)) {
                $pass->avatar_seed = Str::slug($pass->display_name ?: $pass->label) ?: Str::random(8);
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function views(): HasMany
    {
        return $this->hasMany(GuestPassView::class);
    }

    public function getAvatarUrlAttribute(): string
    {
        if (filled($this->avatar_path)) {
            $version = optional($this->updated_at)->timestamp ?? time();

            return route('guest-pass.avatar', ['guestPass' => $this->id]).'?v='.$version;
        }

        $seed = urlencode($this->avatar_seed ?: $this->display_name);

        return "https://api.dicebear.com/9.x/identicon/svg?seed={$seed}&backgroundColor=ccff00,111111&radius=18";
    }

    public function getHasCustomAvatarAttribute(): bool
    {
        return filled($this->avatar_path);
    }

    public function getRedemptionUrlAttribute(): string
    {
        return route('guest-pass.redeem', ['token' => $this->token]);
    }

    public function getQrCodeUrlAttribute(): string
    {
        return 'https://quickchart.io/qr?size=240&margin=1&dark=ccff00&light=000000&text='.urlencode($this->redemption_url);
    }

    /**
     * @return list<string>
     */
    public function resolvedAllowedRoutes(): array
    {
        $routes = $this->allowed_routes;

        if (! is_array($routes) || $routes === []) {
            return self::DEFAULT_ALLOWED_ROUTES;
        }

        return array_values($routes);
    }

    public function isValid(): bool
    {
        return $this->is_active
            && $this->revoked_at === null
            && $this->expires_at->isFuture();
    }

    public function allowsRoute(?string $routeName): bool
    {
        if ($routeName === null) {
            return false;
        }

        return in_array($routeName, $this->resolvedAllowedRoutes(), true);
    }
}

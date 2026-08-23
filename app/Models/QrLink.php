<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QrLink extends Model
{
    use HasFactory, LogsCmsActivity;

    /** Opaque public token length (hex chars) — printed QR encodes /q/{slug}. */
    public const HASH_LENGTH = 16;

    protected $fillable = [
        'name',
        'destination_url',
        'notes',
        'scan_count',
        'last_scanned_at',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'scan_count' => 'integer',
            'last_scanned_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (QrLink $link): void {
            if (blank($link->slug)) {
                $link->slug = self::generateUniqueHash();
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scans(): HasMany
    {
        return $this->hasMany(QrLinkScan::class);
    }

    public function scopeOwnedBy(Builder $query, User|int|null $user): Builder
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $query->where('created_by', $userId);
    }

    public function isOwnedBy(User|int|null $user): bool
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $this->created_by === $userId;
    }

    public function getPublicUrlAttribute(): string
    {
        $base = rtrim((string) config('foray.qr.public_base_url'), '/');

        return $base.'/q/'.$this->slug;
    }

    public function getQrPreviewUrlAttribute(): string
    {
        return 'https://quickchart.io/qr?size=320&margin=2&dark=ccff00&light=000000&text='.urlencode($this->public_url);
    }

    public static function generateUniqueHash(): string
    {
        do {
            $candidate = bin2hex(random_bytes(self::HASH_LENGTH / 2));
        } while (self::query()->where('slug', $candidate)->exists());

        return $candidate;
    }
}

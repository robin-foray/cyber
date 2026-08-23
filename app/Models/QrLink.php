<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class QrLink extends Model
{
    use HasFactory, LogsCmsActivity;

    protected $fillable = [
        'name',
        'slug',
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
                $link->slug = self::generateUniqueSlug($link->name);
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

    public function getPublicUrlAttribute(): string
    {
        $base = rtrim((string) config('foray.qr.public_base_url'), '/');

        return $base.'/q/'.$this->slug;
    }

    public function getQrPreviewUrlAttribute(): string
    {
        return 'https://quickchart.io/qr?size=320&margin=2&dark=ccff00&light=000000&text='.urlencode($this->public_url);
    }

    public static function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);

        if ($base === '') {
            $base = 'link';
        }

        $candidate = $base;
        $suffix = 1;

        while (self::query()->where('slug', $candidate)->exists()) {
            $candidate = $base.'-'.$suffix;
            $suffix++;
        }

        return Str::limit($candidate, 64, '');
    }
}

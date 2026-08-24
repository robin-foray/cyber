<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class QrLink extends Model
{
    use HasFactory, LogsCmsActivity;

    /** Opaque public token length (hex chars) — printed QR encodes /q/{slug}. */
    public const HASH_LENGTH = 16;

    public const STYLE_IDS = [
        'cyber',
        'cyber-rounded',
        'cyber-dots',
        'cyber-soft',
        'print',
        'mono-rounded',
        'inverted',
        'neon-blue',
        'magenta',
        'amber',
        'ice',
        'forest',
        'coral',
        'violet',
        'gold-classy',
        'blueprint',
        'sunset',
        'mint',
        'stark-dots',
        'diamond-neon',
    ];

    public const MODULE_SHAPES = ['square', 'rounded', 'soft', 'dots', 'diamond'];

    public const EYE_STYLES = ['square', 'rounded', 'circle', 'leaf'];

    public const FRAMES = ['bare', 'badge', 'card', 'banner', 'sticker', 'poster', 'custom'];

    public const LOGO_SHAPES = ['circle', 'rounded', 'square'];

    protected $fillable = [
        'name',
        'destination_url',
        'notes',
        'logo_path',
        'design',
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
            'design' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (QrLink $link): void {
            if (blank($link->slug)) {
                $link->slug = self::generateUniqueHash();
            }
        });

        static::updating(function (QrLink $link): void {
            if (! $link->isDirty('logo_path')) {
                return;
            }

            $original = $link->getOriginal('logo_path');

            if (filled($original) && $original !== $link->logo_path) {
                Storage::disk('public')->delete($original);
            }
        });

        static::deleting(function (QrLink $link): void {
            $link->deleteLogoFile();
        });
    }

    /**
     * @return array<string, mixed>
     */
    public static function defaultDesign(): array
    {
        return [
            'style_id' => 'cyber',
            'dark' => null,
            'light' => null,
            'module_shape' => null,
            'eye_style' => null,
            'logo_size' => 22,
            'logo_pad' => true,
            'logo_shape' => 'rounded',
            'frame' => 'bare',
            'caption' => '',
            'subtitle' => '',
            'embed_html' => '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function normalizeDesign(mixed $design): array
    {
        $incoming = is_array($design) ? $design : [];
        $defaults = self::defaultDesign();

        $styleId = (string) ($incoming['style_id'] ?? $defaults['style_id']);
        $moduleShape = $incoming['module_shape'] ?? null;
        $eyeStyle = $incoming['eye_style'] ?? null;
        $frame = (string) ($incoming['frame'] ?? $defaults['frame']);
        $logoShape = (string) ($incoming['logo_shape'] ?? $defaults['logo_shape']);
        $logoSize = (int) ($incoming['logo_size'] ?? $defaults['logo_size']);

        $dark = self::nullableHex($incoming['dark'] ?? null);
        $light = self::nullableHex($incoming['light'] ?? null);

        $logoPad = array_key_exists('logo_pad', $incoming)
            ? filter_var($incoming['logo_pad'], FILTER_VALIDATE_BOOLEAN)
            : $defaults['logo_pad'];

        return [
            'style_id' => in_array($styleId, self::STYLE_IDS, true) ? $styleId : $defaults['style_id'],
            'dark' => $dark,
            'light' => $light,
            'module_shape' => is_string($moduleShape) && in_array($moduleShape, self::MODULE_SHAPES, true)
                ? $moduleShape
                : null,
            'eye_style' => is_string($eyeStyle) && in_array($eyeStyle, self::EYE_STYLES, true)
                ? $eyeStyle
                : null,
            'logo_size' => max(10, min(32, $logoSize)),
            'logo_pad' => $logoPad,
            'logo_shape' => in_array($logoShape, self::LOGO_SHAPES, true) ? $logoShape : $defaults['logo_shape'],
            'frame' => in_array($frame, self::FRAMES, true) ? $frame : $defaults['frame'],
            'caption' => Str::limit(trim((string) ($incoming['caption'] ?? '')), 120, ''),
            'subtitle' => Str::limit(trim((string) ($incoming['subtitle'] ?? '')), 200, ''),
            'embed_html' => Str::limit((string) ($incoming['embed_html'] ?? ''), 20000, ''),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function normalizedDesign(): array
    {
        return self::normalizeDesign($this->design);
    }

    public function storeLogo(UploadedFile $file): void
    {
        $directory = 'qr-logos';
        $extension = strtolower($file->getClientOriginalExtension() ?: 'png');
        $isSvg = $extension === 'svg' || $file->getMimeType() === 'image/svg+xml';

        if ($isSvg) {
            $path = $file->storeAs($directory, Str::uuid()->toString().'.svg', 'public');
            $this->logo_path = $path;

            return;
        }

        try {
            $path = $directory.'/'.Str::uuid()->toString().'.png';
            $image = Image::read($file)->scaleDown(width: 512);
            Storage::disk('public')->put($path, (string) $image->toPng());
            $this->logo_path = $path;
        } catch (\Throwable) {
            $this->logo_path = $file->store($directory, 'public');
        }
    }

    public function deleteLogoFile(): void
    {
        if (blank($this->logo_path)) {
            return;
        }

        Storage::disk('public')->delete($this->logo_path);
        $this->logo_path = null;
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

    public function getLogoUrlAttribute(): ?string
    {
        if (blank($this->logo_path)) {
            return null;
        }

        return route('qr-links.logo', $this);
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

    private static function nullableHex(mixed $value): ?string
    {
        $hex = is_string($value) ? trim($value) : '';

        if ($hex === '') {
            return null;
        }

        return preg_match('/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $hex) === 1
            ? $hex
            : null;
    }
}

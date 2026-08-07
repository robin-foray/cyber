<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'title',
        'avatar_seed',
        'avatar_path',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getAvatarUrlAttribute(): string
    {
        if (filled($this->avatar_path)) {
            // Root-relative media route — works without storage:link and without APP_URL.
            $version = optional($this->updated_at)->timestamp ?? time();

            return '/media/avatar?v='.$version;
        }

        $seed = urlencode($this->avatar_seed ?: $this->name ?: $this->email);

        return "https://api.dicebear.com/9.x/identicon/svg?seed={$seed}&backgroundColor=ccff00,111111&radius=18";
    }

    public function getHasCustomAvatarAttribute(): bool
    {
        return filled($this->avatar_path);
    }

    public function getIsAdminAttribute(): bool
    {
        return $this->role === 'admin';
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin;
    }
}

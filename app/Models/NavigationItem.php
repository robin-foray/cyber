<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NavigationItem extends Model
{
    protected $fillable = [
        'parent_id',
        'label',
        'href',
        'icon',
        'sort_order',
        'is_active',
        'requires_auth',
        'is_group',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'requires_auth' => 'boolean',
            'is_group' => 'boolean',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }
}

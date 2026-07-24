<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FreeApi extends Model
{
    protected $fillable = [
        'free_api_category_id',
        'name',
        'slug',
        'url',
        'base_url',
        'sample_endpoint',
        'summary',
        'auth',
        'https',
        'cors',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'https' => 'boolean',
            'cors' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FreeApiCategory::class, 'free_api_category_id');
    }
}

<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FreeApi extends Model
{
    use LogsCmsActivity;

    protected $fillable = [
        'free_api_category_id',
        'name',
        'slug',
        'url',
        'base_url',
        'sample_endpoint',
        'examples',
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
            'examples' => 'array',
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

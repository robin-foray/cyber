<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechStack extends Model
{
    protected $fillable = [
        'tech_category_id',
        'name',
        'slug',
        'signal',
        'summary',
        'bullets',
        'docs_url',
        'icon',
        'level',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'bullets' => 'array',
            'is_active' => 'boolean',
            'level' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TechCategory::class, 'tech_category_id');
    }
}

<?php

namespace App\Models;

use App\Models\Concerns\LogsCmsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsefulSite extends Model
{
    use LogsCmsActivity;

    protected $fillable = [
        'useful_site_category_id',
        'name',
        'slug',
        'url',
        'summary',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(UsefulSiteCategory::class, 'useful_site_category_id');
    }
}

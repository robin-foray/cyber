<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UsefulSiteCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'sort_order',
    ];

    public function sites(): HasMany
    {
        return $this->hasMany(UsefulSite::class)->orderBy('sort_order')->orderBy('name');
    }
}

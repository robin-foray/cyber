<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FreeApiCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'accent',
        'sort_order',
    ];

    public function apis(): HasMany
    {
        return $this->hasMany(FreeApi::class)->orderBy('sort_order')->orderBy('name');
    }
}

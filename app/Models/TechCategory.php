<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TechCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'accent',
        'sort_order',
    ];

    public function stacks(): HasMany
    {
        return $this->hasMany(TechStack::class)->orderBy('sort_order')->orderBy('name');
    }
}

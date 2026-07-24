<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MachineCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'sort_order',
    ];

    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class)->orderBy('sort_order')->orderBy('name');
    }
}

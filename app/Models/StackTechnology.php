<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StackTechnology extends Model
{
    protected $fillable = [
        'name',
        'signal',
        'summary',
        'bullets',
        'docs_url',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'bullets' => 'array',
            'is_active' => 'boolean',
        ];
    }
}

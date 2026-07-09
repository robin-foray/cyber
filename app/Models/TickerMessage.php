<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TickerMessage extends Model
{
    protected $fillable = [
        'location',
        'text',
        'is_highlighted',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_highlighted' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DevToolPage extends Model
{
    protected $fillable = [
        'slug',
        'header_label',
        'page_title',
        'heading_prefix',
        'heading_accent',
        'sample_input',
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
}

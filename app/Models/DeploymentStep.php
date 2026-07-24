<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeploymentStep extends Model
{
    protected $fillable = [
        'label',
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

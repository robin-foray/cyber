<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Machine extends Model
{
    protected $fillable = [
        'machine_category_id',
        'name',
        'slug',
        'description',
        'image_url',
        'url',
        'height',
        'sort_order',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MachineCategory::class, 'machine_category_id');
    }
}

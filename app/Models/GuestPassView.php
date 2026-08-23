<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestPassView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'guest_pass_id',
        'path',
        'route_name',
        'page_label',
        'ip_address',
        'user_agent',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
        ];
    }

    public function guestPass(): BelongsTo
    {
        return $this->belongsTo(GuestPass::class);
    }
}

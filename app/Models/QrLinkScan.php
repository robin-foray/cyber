<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrLinkScan extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'qr_link_id',
        'destination_url',
        'ip_address',
        'user_agent',
        'scanned_at',
    ];

    protected function casts(): array
    {
        return [
            'scanned_at' => 'datetime',
        ];
    }

    public function qrLink(): BelongsTo
    {
        return $this->belongsTo(QrLink::class);
    }
}

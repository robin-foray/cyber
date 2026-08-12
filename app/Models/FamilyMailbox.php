<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyMailbox extends Model
{
    public const TYPE_MAILBOX = 'mailbox';

    public const TYPE_ALIAS = 'alias';

    public const TYPE_FORWARD = 'forward';

    protected $fillable = [
        'local_part',
        'domain',
        'display_name',
        'owner_name',
        'type',
        'forward_to',
        'quota_mb',
        'notes',
        'password_rotated_at',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'quota_mb' => 'integer',
            'password_rotated_at' => 'datetime',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function getEmailAttribute(): string
    {
        return strtolower($this->local_part).'@'.$this->domain;
    }

    /**
     * @return array<string, string>
     */
    public static function typeOptions(): array
    {
        return [
            self::TYPE_MAILBOX => 'Postafiók',
            self::TYPE_ALIAS => 'Alias',
            self::TYPE_FORWARD => 'Továbbítás',
        ];
    }
}

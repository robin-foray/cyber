<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroContent extends Model
{
    protected $fillable = [
        'badge',
        'title_line',
        'title_accent',
        'cta_label',
        'background_image',
    ];
}

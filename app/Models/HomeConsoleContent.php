<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeConsoleContent extends Model
{
    protected $fillable = [
        'section_label',
        'input_sample',
        'output_sample',
    ];
}

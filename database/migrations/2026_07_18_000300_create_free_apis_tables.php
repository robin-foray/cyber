<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('free_api_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->string('accent')->default('#ccff00');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('free_apis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('free_api_category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('url');
            $table->string('base_url')->nullable();
            $table->string('sample_endpoint')->nullable();
            $table->text('summary')->nullable();
            $table->string('auth')->default('none');
            $table->boolean('https')->default(true);
            $table->boolean('cors')->default(false);
            $table->string('icon')->default('globe');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('free_apis');
        Schema::dropIfExists('free_api_categories');
    }
};

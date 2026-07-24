<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tech_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->string('accent')->default('#ccff00');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('tech_stacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tech_category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('signal')->nullable();
            $table->text('summary')->nullable();
            $table->json('bullets')->nullable();
            $table->string('docs_url')->nullable();
            $table->string('icon')->default('cpu');
            $table->unsignedTinyInteger('level')->default(80);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tech_stacks');
        Schema::dropIfExists('tech_categories');
    }
};

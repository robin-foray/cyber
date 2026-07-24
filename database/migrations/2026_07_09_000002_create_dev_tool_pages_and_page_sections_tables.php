<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dev_tool_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('header_label');
            $table->string('page_title');
            $table->string('heading_prefix')->nullable();
            $table->string('heading_accent')->nullable();
            $table->text('sample_input')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('section_label');
            $table->string('title');
            $table->string('title_accent')->nullable();
            $table->text('body')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('dev_tool_pages');
    }
};

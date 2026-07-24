<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('navigation_items')->nullOnDelete();
            $table->string('label');
            $table->string('href')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_auth')->default(false);
            $table->boolean('is_group')->default(false);
            $table->timestamps();
        });

        Schema::create('hero_contents', function (Blueprint $table) {
            $table->id();
            $table->string('badge')->nullable();
            $table->string('title_line');
            $table->string('title_accent');
            $table->string('cta_label')->nullable();
            $table->string('background_image')->nullable();
            $table->timestamps();
        });

        Schema::create('home_console_contents', function (Blueprint $table) {
            $table->id();
            $table->string('section_label');
            $table->text('input_sample');
            $table->text('output_sample');
            $table->timestamps();
        });

        Schema::create('skill_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('stack_technologies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('signal');
            $table->text('summary');
            $table->json('bullets');
            $table->string('docs_url');
            $table->string('icon');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('ticker_messages', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->string('text');
            $table->boolean('is_highlighted')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->string('url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('deployment_steps', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('deployment_steps');
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('ticker_messages');
        Schema::dropIfExists('stack_technologies');
        Schema::dropIfExists('skill_metrics');
        Schema::dropIfExists('home_console_contents');
        Schema::dropIfExists('hero_contents');
        Schema::dropIfExists('navigation_items');
    }
};

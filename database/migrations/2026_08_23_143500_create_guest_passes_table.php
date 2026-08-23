<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guest_passes', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->string('label');
            $table->string('display_name');
            $table->string('title')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar_path')->nullable();
            $table->string('avatar_seed')->nullable();
            $table->timestamp('expires_at');
            $table->json('allowed_routes')->nullable();
            $table->unsignedInteger('view_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('guest_pass_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_pass_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('route_name')->nullable();
            $table->string('page_label')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('viewed_at');
            $table->index(['guest_pass_id', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_pass_views');
        Schema::dropIfExists('guest_passes');
    }
};

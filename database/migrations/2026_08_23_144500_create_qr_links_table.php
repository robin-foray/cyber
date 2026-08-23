<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_links', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug', 64)->unique();
            $table->text('destination_url');
            $table->text('notes')->nullable();
            $table->unsignedInteger('scan_count')->default(0);
            $table->timestamp('last_scanned_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('qr_link_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('qr_link_id')->constrained()->cascadeOnDelete();
            $table->text('destination_url');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('scanned_at');
            $table->index(['qr_link_id', 'scanned_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_link_scans');
        Schema::dropIfExists('qr_links');
    }
};

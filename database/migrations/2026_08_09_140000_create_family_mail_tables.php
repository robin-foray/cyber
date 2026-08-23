<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_server_settings', function (Blueprint $table) {
            $table->id();
            $table->string('domain')->default('foray.hu');
            $table->string('display_name')->default('Foray Family Mail');
            $table->string('imap_host')->nullable();
            $table->unsignedInteger('imap_port')->default(993);
            $table->string('smtp_host')->nullable();
            $table->unsignedInteger('smtp_port')->default(465);
            $table->string('webmail_url')->nullable();
            $table->text('admin_notes')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
        });

        Schema::create('family_mailboxes', function (Blueprint $table) {
            $table->id();
            $table->string('local_part');
            $table->string('domain')->default('foray.hu');
            $table->string('display_name');
            $table->string('owner_name')->nullable();
            $table->string('type')->default('mailbox');
            $table->string('forward_to')->nullable();
            $table->unsignedInteger('quota_mb')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('password_rotated_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['local_part', 'domain']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_mailboxes');
        Schema::dropIfExists('mail_server_settings');
    }
};

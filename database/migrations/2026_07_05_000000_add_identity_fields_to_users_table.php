<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('member')->after('email_verified_at');
            $table->string('title')->nullable()->after('role');
            $table->string('avatar_seed')->nullable()->after('title');
            $table->text('bio')->nullable()->after('avatar_seed');
        });

        $firstUser = DB::table('users')->orderBy('id')->first();

        if ($firstUser && ! DB::table('users')->where('role', 'admin')->exists()) {
            DB::table('users')
                ->where('id', $firstUser->id)
                ->update([
                    'role' => 'admin',
                    'title' => 'Root Operator',
                    'avatar_seed' => $firstUser->name,
                    'bio' => 'Primary admin node for the Foray cyber dashboard.',
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'title', 'avatar_seed', 'bio']);
        });
    }
};

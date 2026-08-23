<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('free_apis', function (Blueprint $table) {
            $table->json('examples')->nullable()->after('sample_endpoint');
        });
    }

    public function down(): void
    {
        Schema::table('free_apis', function (Blueprint $table) {
            $table->dropColumn('examples');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;



return new class extends Migration
{
    /**
 * Get the migration connection name.
     */
    public function getConnection(): ?string
    {
        return config('telescope.storage.database.connection');
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE `user_petition` 
ADD COLUMN `payment_intent_id` VARCHAR(255) NULL AFTER `notified_at`;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE `user_petition` 
DROP COLUMN `payment_intent_id`;
        ');
    }
};


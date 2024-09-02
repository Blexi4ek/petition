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
        DB::statement('ALTER TABLE `users` 
ADD COLUMN `customer_id` VARCHAR(255) NULL AFTER `updated_at`,
ADD UNIQUE INDEX `customer_id_UNIQUE` (`customer_id` ASC) VISIBLE;
;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE `users` 
DROP COLUMN `customer_id`,
DROP INDEX `customer_id_UNIQUE` ;
;
');
    }
};

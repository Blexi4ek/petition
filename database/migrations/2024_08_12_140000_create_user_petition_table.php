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
        DB::statement('CREATE TABLE `user_petition` (
            `id` bigint unsigned NOT NULL,
            `user_id` bigint unsigned DEFAULT NULL,
            `petition_id` bigint unsigned NOT NULL,
            `created_at` timestamp NOT NULL,
            `notified_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `user_id_idx` (`user_id`),
            KEY `signed_petition_id_idx` (`petition_id`),
            CONSTRAINT `fk_petitions_petition_id` FOREIGN KEY (`petition_id`) REFERENCES `petitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT `fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
          
          ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_petition');
      
    }
};

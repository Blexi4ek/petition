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
        DB::statement('CREATE TABLE `images` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        `petition_id` BIGINT UNSIGNED NULL,
        `name` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP NULL,
        `updated_at` TIMESTAMP NULL,
        PRIMARY KEY (`id`),
        INDEX `fk_images_1_idx` (`petition_id` ASC) VISIBLE,
        CONSTRAINT `fk_images_1`
    FOREIGN KEY (`petition_id`)
    REFERENCES `petition_vk`.`petitions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
      
    }
};
